<?php
namespace App\Http\Controllers;

use App\Models\Avis;
use App\Models\Objet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AvisController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'userReviews']);
    }

    // GET /objets/{id}/avis
    public function index($objetId)
    {
        Objet::findOrFail($objetId);
        return response()->json(
            Avis::with('user')
                ->where('id_objet', $objetId)
                ->latest()
                ->get()
        );
    }

    public function userReviews($userId)
    {
        return response()->json(
            Avis::with(['user', 'objet'])
                ->whereHas('objet', function($query) use ($userId) {
                    $query->where('id_user', $userId);
                })
                ->latest()
                ->get()
        );
    }

    // POST /objets/{id}/avis
    public function store(Request $request, $objetId)
    {
        $objet = Objet::findOrFail($objetId);

        if ($objet->id_user === Auth::user()->id_user)
            return response()->json(['message' => 'Vous ne pouvez pas noter votre propre objet'], 403);

        // Un seul avis par user par objet
        $exists = Avis::where('id_objet', $objetId)
                      ->where('id_user', Auth::user()->id_user)
                      ->exists();
        if ($exists)
            return response()->json(['message' => 'Avis déjà soumis'], 400);

        $avis = Avis::create($request->validate([
            'note'        => 'required|integer|min:1|max:5',
            'commentaire' => 'required|string',
        ]) + ['id_user' => Auth::user()->id_user, 'id_objet' => $objetId]);

        return response()->json($avis->load('user'), 201);
    }

    // DELETE /avis/{id}
    public function destroy($id)
    {
        $avis = Avis::findOrFail($id);

        if ($avis->id_user !== Auth::user()->id_user)
            return response()->json(['message' => 'Non autorisé'], 403);

        $avis->delete();
        return response()->json(['message' => 'Avis supprimé']);
    }
}