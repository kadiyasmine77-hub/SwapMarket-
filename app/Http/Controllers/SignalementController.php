<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Signalement;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class SignalementController extends Controller
{
    
     // katkhli user ydir signaler lshi annonce
    public function store(Request $request)
    {
        $request->validate([
            'id_objet' => 'required|exists:objets,id_objet',
            'motif' => 'required|in:spam,inapproprie,contrefacon,arnaque,autre',
            'description' => 'nullable|string|max:1000',
        ]);

        // Vérifier si l'utilisateur n'a pas déjà signalé cet objet 
        $existing = Signalement::where('id_utilisateur', Auth::id())
            ->where('id_objet', $request->id_objet)
            ->where('statut', 'en_attente')
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Vous avez déjà signalé cet objet. Votre signalement est en cours de traitement.'], 422);
        }

        $signalement = Signalement::create([
            'id_utilisateur' => Auth::id(),
            'id_objet' => $request->id_objet,
            'motif' => $request->motif,
            'description' => $request->description,
            'statut' => 'en_attente',
        ]);

        return response()->json([
            'message' => 'L\'objet a été signalé avec succès. Merci pour votre vigilance.',
            'signalement' => $signalement
        ], 201);
    }

    // katjib ladmin signalements li msyftin lih gae users  
  
    public function indexAdmin()
    {
        $signalements = Signalement::with(['user:id_user,nom_complet,email,photo_profil', 'objet:id_objet,titre,image'])
            ->orderByRaw("FIELD(statut, 'en_attente', 'traite', 'rejete')")
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($signalements);
    }

    
    //update statu dyal signalement
    public function updateStatut(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:en_attente,traite,rejete',
        ]);

        $signalement = Signalement::findOrFail($id);
        $signalement->statut = $request->statut;
        $signalement->save();

        ActivityLog::create([
            'admin_id' => Auth::id(),
            'action' => ucfirst($request->statut) . ' signalement',
            'target' => "Signalement #{$id}",
            'details' => "Le statut du signalement a été mis à jour"
        ]);

        return response()->json([
            'message' => 'Le statut du signalement a été mis à jour.',
            'signalement' => $signalement
        ]);
    }
}
