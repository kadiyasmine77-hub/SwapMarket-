<?php

namespace App\Http\Controllers;

use App\Models\Favori;
use App\Models\Objet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriController extends Controller
{
    public function index()
    {
        $id = Auth::user()->id_user;
        $favoris = Favori::with(['objet.user', 'objet.categorie', 'objet.images'])
            ->where('id_user', $id)
            ->latest()
            ->get();
            
        return response()->json($favoris);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'id_objet' => 'required|exists:objets,id_objet',
        ]);

        $userId = Auth::user()->id_user;
        $objetId = $request->id_objet;

        $favori = Favori::where('id_user', $userId)
            ->where('id_objet', $objetId)
            ->first();

        if ($favori) {
            $favori->delete();
            return response()->json(['message' => 'Retiré des favoris', 'status' => 'removed']);
        } else {
            Favori::create([
                'id_user' => $userId,
                'id_objet' => $objetId,
            ]);
            return response()->json(['message' => 'Ajouté aux favoris', 'status' => 'added']);
        }
    }

    public function check($id_objet)
    {
        $userId = Auth::user()->id_user;
        $exists = Favori::where('id_user', $userId)
            ->where('id_objet', $id_objet)
            ->exists();

        return response()->json(['is_favorite' => $exists]);
    }
}
