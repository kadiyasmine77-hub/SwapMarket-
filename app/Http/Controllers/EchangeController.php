<?php
namespace App\Http\Controllers;

use App\Mail\EchangeRefuse;
use App\Mail\EchangeValide;
use App\Mail\NouvelEchange;
use App\Models\Echange;
use App\Models\Objet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;

class EchangeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // GET /echanges
    public function index()
    {
        $id = Auth::user()->id_user;
        $exchanges = Echange::with(['objet1', 'objet2', 'demandeur', 'destinataire'])
            ->where('id_demandeur', $id)
            ->orWhere('id_destinataire', $id)
            ->latest()
            ->get();
        
        // Add attempts count for each exchange
        $exchanges->each(function($e) {
            $e->attempts_count = Echange::where('id_demandeur', $e->id_demandeur)
                                      ->where('id_objet2', $e->id_objet2)
                                      ->count();
        });

        return response()->json($exchanges);
    }

    // POST /echanges
    public function store(Request $request)
    {
        $data = $request->validate([
            'id_objet1' => 'required|exists:objets,id_objet',
            'id_objet2' => 'required|exists:objets,id_objet',
        ]);

        $objet1 = Objet::findOrFail($data['id_objet1']);
        if ($objet1->id_user !== Auth::user()->id_user)
            return response()->json(['message' => 'Non autorisé'], 403);

        $objet2 = Objet::findOrFail($data['id_objet2']);
        if ($objet2->disponibilite !== 'disponible')
            return response()->json(['message' => 'Objet non disponible'], 400);

        $userId = Auth::user()->id_user;

        // Check if there's already a pending request for THIS object from THIS user
        $pendingCount = Echange::where('id_demandeur', $userId)
            ->where('id_objet2', $data['id_objet2'])
            ->where('statut', 'en_attente')
            ->count();
        
        if ($pendingCount > 0) {
            return response()->json(['message' => 'Vous avez déjà une demande en attente pour cet objet.'], 400);
        }

        // Count TOTAL attempts (including refuse and annule) for this user to this specific object
        $totalAttempts = Echange::where('id_demandeur', $userId)
            ->where('id_objet2', $data['id_objet2'])
            ->count();

        if ($totalAttempts >= 3) {
            return response()->json(['message' => 'Vous ne pouvez plus proposer d\'échange pour cet objet (limite de 3 tentatives atteinte).'], 403);
        }

        try {
            $echange = Echange::create([
                'id_objet1'       => $data['id_objet1'],
                'id_objet2'       => $data['id_objet2'],
                'id_demandeur'    => $userId,
                'id_destinataire' => $objet2->id_user,
                'date_demande'    => now(),
                'statut'          => 'en_attente',
            ]);

            $echange->load(['objet1', 'objet2', 'demandeur', 'destinataire']);

            // Email للـ destinataire
            Mail::to($echange->destinataire->email)
                ->send(new NouvelEchange($echange));

            return response()->json($echange, 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création de l\'échange',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // PUT /echanges/{id}/statut
    public function updateStatut(Request $request, $id)
    {
        $echange = Echange::findOrFail($id);

        $request->validate([
            'statut' => 'required|in:valide,refuse,termine,annule',
        ]);

        if ($request->statut !== 'termine' && $request->statut !== 'annule' && $echange->id_destinataire !== Auth::user()->id_user) {
            // Seul le destinataire peut refuser ou valider, SAUF si c'est une annulation
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        if (($request->statut === 'termine' || $request->statut === 'annule') && $echange->id_destinataire !== Auth::user()->id_user && $echange->id_demandeur !== Auth::user()->id_user) {
            // L'annulation et la fin d'échange sont ouvertes aux deux parties
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        try {
            DB::transaction(function () use ($request, $echange) {

                // 1. Mise à jour du statut de l'échange actuel
                $echange->update([
                    'statut'          => $request->statut,
                    'date_validation' => now(),
                ]);

                // 2. LOGIQUE SI ACCEPTÉ (valide)
                if ($request->statut === 'valide') {
                    // a. On rend les deux objets indisponibles
                    Objet::whereIn('id_objet', [$echange->id_objet1, $echange->id_objet2])
                         ->update(['disponibilite' => 'echange']);

                    // b. On REFUSE automatiquement toutes les autres demandes en attente pour ces objets
                    Echange::where('id_echange', '!=', $echange->id_echange)
                        ->where('statut', 'en_attente')
                        ->where(function($q) use ($echange) {
                            $q->whereIn('id_objet1', [$echange->id_objet1, $echange->id_objet2])
                              ->orWhereIn('id_objet2', [$echange->id_objet1, $echange->id_objet2]);
                        })
                        ->update(['statut' => 'refuse']);
                }

                // 3. LOGIQUE SI REFUSÉ (refuse)
                // L'objet reste disponible par défaut car on ne le bloque plus à la demande

                // 4. LOGIQUE SI TERMINÉ (termine)
                if ($request->statut === 'termine') {
                    // Les objets restent indisponibles (on peut les mettre en 'reserve' pour archivage)
                    Objet::whereIn('id_objet', [$echange->id_objet1, $echange->id_objet2])
                         ->update(['disponibilite' => 'reserve']);
                }

                // 5. LOGIQUE SI ANNULÉ (annule)
                if ($request->statut === 'annule') {
                    // Les objets redeviennent disponibles pour tout le monde
                    Objet::whereIn('id_objet', [$echange->id_objet1, $echange->id_objet2])
                         ->update(['disponibilite' => 'disponible']);
                }
            });

            $echange->load(['objet1', 'objet2', 'demandeur', 'destinataire']);

            // 4. Email pour information
            if ($request->statut === 'valide') {
                Mail::to($echange->demandeur->email)
                    ->send(new EchangeValide($echange));
            } else if ($request->statut === 'refuse') {
                Mail::to($echange->demandeur->email)
                    ->send(new EchangeRefuse($echange));
            } else if ($request->statut === 'annule') {
                $userAuthId = Auth::user()->id_user;
                if ($userAuthId === $echange->id_demandeur) {
                    // Le demandeur annule => on notifie le destinataire
                    Mail::to($echange->destinataire->email)
                        ->send(new \App\Mail\EchangeAnnule($echange, false));
                } else if ($userAuthId === $echange->id_destinataire) {
                    // Le destinataire annule => on notifie le demandeur
                    Mail::to($echange->demandeur->email)
                        ->send(new \App\Mail\EchangeAnnule($echange, true));
                }
            }

            return response()->json($echange);

        } catch (\Exception $e) {
            \Log::error("Erreur updateStatut: " . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la mise à jour : ' . $e->getMessage(),
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // GET /echanges/{id}
    public function show($id)
    {
        $echange = Echange::with(['objet1', 'objet2', 'demandeur', 'destinataire', 'messages'])
                          ->findOrFail($id);

        $userId = Auth::user()->id_user;
        if ($echange->id_demandeur !== $userId && $echange->id_destinataire !== $userId)
            return response()->json(['message' => 'Non autorisé'], 403);

        return response()->json($echange);
    }

    // GET /echanges/{id}/historique — Admin
    public function historique($id)
    {
        $echange = Echange::with('historique')->findOrFail($id);
        return response()->json($echange->historique);
    }

    public function generatePDF($id)
    {
        $echange = Echange::with(['objet1', 'objet2', 'demandeur', 'destinataire'])->findOrFail($id);

        $userId = Auth::user()->id_user;
        // Vérifier que l'utilisateur fait partie de l'échange
        if ($echange->id_demandeur !== $userId && $echange->id_destinataire !== $userId) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $pdf = Pdf::loadView('pdf.echange', compact('echange'));
        
        return $pdf->download('bon-echange-'.$id.'.pdf');
    }
}