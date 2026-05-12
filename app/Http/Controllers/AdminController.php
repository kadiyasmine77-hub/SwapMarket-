<?php

namespace App\Http\Controllers;

use App\Models\Avis;
use App\Models\Categorie;
use App\Models\Echange;
use App\Models\Message;
use App\Models\Objet;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum', 'checkrole:admin']);
    }

    public function stats()
    {
        return response()->json([
            'users' => User::count(),
            'users_actifs' => User::where('statut_compte', 'actif')->count(),
            'users_suspendus' => User::where('statut_compte', 'suspendu')->count(),
            'objets' => Objet::count(),
            'objets_dispo' => Objet::where('disponibilite', 'disponible')->count(),
            'echanges' => Echange::count(),
            'echanges_en_attente' => Echange::where('statut', 'en_attente')->count(),
            'echanges_valides' => Echange::where('statut', '!=', 'en_attente')
                                ->where('statut', '!=', 'refuse')
                                ->where('statut', '!=', 'annule')
                                ->count(),
            'avis' => Avis::count(),
            'messages' => Message::count(),
            'echanges_par_mois' => Echange::selectRaw('MONTH(created_at) as mois, COUNT(*) as total')
                ->whereYear('created_at', now()->year)
                ->groupBy('mois')
                ->orderBy('mois')
                ->get(),
            'objets_par_categorie' => DB::table('objets')
                ->join('categories', 'objets.id_categorie', '=', 'categories.id_categorie')
                ->selectRaw('categories.nom, COUNT(*) as total')
                ->groupBy('categories.nom')
                ->orderByRaw("CASE WHEN LOWER(categories.nom) IN ('autre', 'autres', 'other', 'others') THEN 1 ELSE 0 END ASC")
                ->orderBy('categories.nom', 'ASC')
                ->get(),
        ]);
    }

    public function users(Request $request)
    {
        $query = User::withCount(['objets', 'avis']);

        if ($request->statut) {
            $query->where('statut_compte', $request->statut);
        }

        if ($request->role) {
            $query->where('role', $request->role);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nom_complet', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return response()->json($query->latest('id_user')->paginate(15));
    }

    public function updateStatutUser(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:actif,suspendu,desactive',
        ]);

        $user = User::findOrFail($id);

        if ($user->id_user === $request->user()->id_user) {
            return response()->json([
                'message' => 'Vous ne pouvez pas modifier votre propre statut',
            ], 403);
        }

        $user->update(['statut_compte' => $request->statut]);

        ActivityLog::create([
            'admin_id' => Auth::id(),
            'action' => ucfirst($request->statut) . ' utilisateur',
            'target' => $user->nom_complet,
            'details' => "L'utilisateur a été passé en statut {$request->statut}"
        ]);

        return response()->json([
            'message' => 'Statut mis a jour',
            'user' => $user,
        ]);
    }

    public function echanges(Request $request)
    {
        $query = Echange::with(['demandeur', 'destinataire', 'objet1', 'objet2']);

        if ($request->statut) {
            $query->where('statut', $request->statut);
        }

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->whereHas('demandeur', function($uq) use ($request) {
                    $uq->where('nom_complet', 'like', '%' . $request->search . '%');
                })->orWhereHas('destinataire', function($uq) use ($request) {
                    $uq->where('nom_complet', 'like', '%' . $request->search . '%');
                });
            });
        }

        return response()->json($query->latest('id_echange')->paginate(15));
    }

    public function updateRoleUser(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        $user = User::findOrFail($id);

        if ($user->id_user === $request->user()->id_user) {
            return response()->json([
                'message' => 'Vous ne pouvez pas modifier votre propre role',
            ], 403);
        }

        $user->update(['role' => $request->role]);

        ActivityLog::create([
            'admin_id' => Auth::id(),
            'action' => 'Modifié rôle',
            'target' => $user->nom_complet,
            'details' => "Rôle changé en {$request->role}"
        ]);

        return response()->json([
            'message' => 'Role mis a jour',
            'user' => $user,
        ]);
    }

    public function destroyUser($id)
    {
        $user = User::with('objets.images')->findOrFail($id);

        if ($user->id_user === Auth::id()) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte',
            ], 403);
        }

        // 1. Supprimer les objets de l'utilisateur et leurs fichiers physiques
        foreach ($user->objets as $objet) {
            // Supprimer la photo de couverture de l'objet
            if ($objet->image) {
                Storage::disk('public')->delete($objet->image);
            }

            // Supprimer toutes les images de la galerie de l'objet
            foreach ($objet->images as $img) {
                Storage::disk('public')->delete($img->image_url);
            }

            // Supprimer l'objet de la base de données
            $objet->delete();
        }

        // 2. Supprimer la photo de profil de l'utilisateur
        if ($user->photo_profil) {
            Storage::disk('public')->delete($user->photo_profil);
        }

        // 3. Supprimer l'utilisateur de la base de données
        $user->delete();

        ActivityLog::create([
            'admin_id' => Auth::id(),
            'action' => 'Supprimé utilisateur',
            'target' => $user->nom_complet,
            'details' => "L'utilisateur et toutes ses annonces ont été supprimés définitivement"
        ]);

        return response()->json(['message' => 'Utilisateur et ses annonces supprimés avec succès']);
    }

    public function categories()
    {
        return response()->json(
            Categorie::withCount('objets')
                ->orderByRaw("CASE WHEN LOWER(nom) IN ('autre', 'autres', 'other', 'others') THEN 1 ELSE 0 END ASC")
                ->orderBy('nom', 'ASC')
                ->get()
        );
    }

    public function objets()
    {
        return response()->json(
            Objet::with(['user', 'categorie'])->latest('id_objet')->get()
        );
    }

    public function destroyObjet($id)
    {
        $objet = Objet::with('images')->findOrFail($id);

        // Supprimer la cover
        if ($objet->image) {
            Storage::disk('public')->delete($objet->image);
        }

        // Supprimer la galerie
        if ($objet->images) {
            foreach ($objet->images as $img) {
                Storage::disk('public')->delete($img->image_url);
            }
        }

        $objet->delete();

        ActivityLog::create([
            'admin_id' => Auth::id(),
            'action' => 'Supprimé annonce',
            'target' => "Annonce #{$id}",
            'details' => "L'annonce '{$objet->titre}' a été supprimée"
        ]);

        return response()->json(['message' => 'Objet supprime']);
    }

    public function updateStatutEchange(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:en_attente,valide,refuse,termine',
        ]);

        $echange = Echange::findOrFail($id);
        $echange->update([
            'statut' => $request->statut,
            'date_validation' => in_array($request->statut, ['valide', 'refuse', 'termine'], true) ? now() : null,
        ]);

        if ($request->statut === 'valide') {
            Objet::whereIn('id_objet', [$echange->id_objet1, $echange->id_objet2])
                ->update(['disponibilite' => 'echange']);
        }

        if ($request->statut === 'refuse') {
            Objet::where('id_objet', $echange->id_objet2)
                ->update(['disponibilite' => 'disponible']);
        }

        ActivityLog::create([
            'admin_id' => Auth::id(),
            'action' => ucfirst($request->statut) . ' échange',
            'target' => "Échange #{$id}",
            'details' => "L'échange a été mis en statut {$request->statut}"
        ]);

        return response()->json([
            'message' => 'Statut de l echange mis a jour',
            'echange' => $echange->load(['objet1', 'objet2', 'demandeur', 'destinataire']),
        ]);
    }

    public function avis()
    {
        return response()->json(
            Avis::with(['user', 'objet'])->latest('id_avis')->get()
        );
    }

    public function destroyAvis($id)
    {
        $avis = Avis::findOrFail($id);
        $avis->delete();

        ActivityLog::create([
            'admin_id' => Auth::id(),
            'action' => 'Supprimé avis',
            'target' => "Avis #{$id}",
            'details' => "Avis supprimé"
        ]);

        return response()->json(['message' => 'Avis supprime']);
    }

    public function exportPdf(Request $request)
    {
        $lang = strtolower((string) $request->query('lang', 'fr'));
        $lang = in_array($lang, ['fr', 'en'], true) ? $lang : 'fr';

        $data = [
            'users' => User::withCount(['objets', 'avis'])->get(),
            'echanges' => Echange::with(['demandeur', 'destinataire', 'objet1', 'objet2'])
                ->latest()
                ->take(50)
                ->get(),
            'stats' => [
                'total_users' => User::count(),
                'total_objets' => Objet::count(),
                'total_echanges' => Echange::count(),
                'total_avis' => Avis::count(),
            ],
            'date' => now()->format('d/m/Y H:i'),
            'lang' => $lang,
        ];

        $pdf = Pdf::loadView('pdf.rapport_admin', $data)
            ->setPaper('a4', 'landscape');

        return $pdf->download('rapport-swapmarket-' . $lang . '-' . now()->format('Y-m-d') . '.pdf');
    }

    public function statsUser($id)
    {
        $stats = DB::select('CALL GetUserStats(?)', [$id]);

        return response()->json($stats[0] ?? []);
    }

    // Exportation XML (Point 16)
    public function exportXml()
    {
        $users = User::all();
        $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><users></users>');

        foreach ($users as $user) {
            $userNode = $xml->addChild('user');
            $userNode->addChild('id', $user->id_user);
            $userNode->addChild('nom_complet', htmlspecialchars($user->nom_complet ?? ''));
            $userNode->addChild('email', $user->email);
            $userNode->addChild('role', $user->role);
            $userNode->addChild('statut_compte', $user->statut_compte);
            $userNode->addChild('ville', htmlspecialchars($user->ville ?? ''));
        }

        return response($xml->asXML(), 200)
            ->header('Content-Type', 'application/xml')
            ->header('Content-Disposition', 'attachment; filename="users.xml"');
    }

    // Importation XML (Point 16)
    public function importXml(Request $request)
    {
        $request->validate(['fichier_xml' => 'required|file|mimes:xml']);

        $xmlString = file_get_contents($request->file('fichier_xml')->getRealPath());
        $xml = simplexml_load_string($xmlString);

        if ($xml === false) {
            return response()->json(['message' => 'Fichier XML invalide'], 400);
        }

        $imported = 0;
        foreach ($xml->user as $userNode) {
            // Vérifier si l'utilisateur existe déjà par email
            $exists = User::where('email', (string)$userNode->email)->exists();
            if (!$exists) {
                User::create([
                    'nom_complet' => (string)$userNode->nom_complet,
                    'email' => (string)$userNode->email,
                    'mot_de_passe' => bcrypt('password123'), // par defaut
                    'role' => (string)$userNode->role ?? 'user',
                    'statut_compte' => (string)$userNode->statut_compte ?? 'actif',
                    'ville' => !empty((string)$userNode->ville) ? (string)$userNode->ville : 'Inconnue', // Champ requis
                    'is_verifie' => true
                ]);
                $imported++;
            }
        }

        return response()->json(['message' => "$imported utilisateurs importes avec succes"]);
    }
}
