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
            'echanges_valides' => Echange::where('statut', 'valide')->count(),
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

        return response()->json([
            'message' => 'Statut mis a jour',
            'user' => $user,
        ]);
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

        return response()->json([
            'message' => 'Role mis a jour',
            'user' => $user,
        ]);
    }

    public function categories()
    {
        return response()->json(
            Categorie::withCount('objets')->orderBy('nom')->get()
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

        return response()->json(['message' => 'Objet supprime']);
    }

    public function echanges()
    {
        return response()->json(
            Echange::with(['objet1', 'objet2', 'demandeur', 'destinataire'])
                ->latest('id_echange')
                ->get()
        );
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
        Avis::findOrFail($id)->delete();

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
