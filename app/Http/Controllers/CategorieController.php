<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class CategorieController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:sanctum')->except(['index', 'show']);
        // $this->middleware('checkrole:admin')->except(['index', 'show']);
    }

    public function index()
    {
        return response()->json(
            Categorie::orderByRaw("CASE WHEN LOWER(nom) IN ('autre', 'autres', 'other', 'others') THEN 1 ELSE 0 END ASC")
                ->orderBy('nom', 'ASC')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|unique:categories,nom',
            'description' => 'nullable|string',
        ]);

        $categorie = Categorie::create($data);

        if (Auth::check() && Auth::user()->role === 'admin') {
            ActivityLog::create([
                'admin_id' => Auth::id(),
                'action' => 'Créé catégorie',
                'target' => "Catégorie: {$categorie->nom}",
                'details' => "Nouvelle catégorie ajoutée"
            ]);
        }

        return response()->json($categorie, 201);
    }

    public function show($id)
    {
        return response()->json(Categorie::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $categorie = Categorie::findOrFail($id);

        $categorie->update($request->validate([
            'nom' => 'required|string|unique:categories,nom,' . $categorie->id_categorie . ',id_categorie',
            'description' => 'nullable|string',
        ]));

        if (Auth::check() && Auth::user()->role === 'admin') {
            ActivityLog::create([
                'admin_id' => Auth::id(),
                'action' => 'Modifié catégorie',
                'target' => "Catégorie: {$categorie->nom}",
                'details' => "Catégorie mise à jour"
            ]);
        }

        return response()->json($categorie);
    }

    public function destroy($id)
    {
        $categorie = Categorie::withCount('objets')->findOrFail($id);

        if ($categorie->objets_count > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer cette categorie car elle contient encore ' . $categorie->objets_count . ' objet(s).',
            ], 409);
        }

        $nom = $categorie->nom;
        $categorie->delete();

        if (Auth::check() && Auth::user()->role === 'admin') {
            ActivityLog::create([
                'admin_id' => Auth::id(),
                'action' => 'Supprimé catégorie',
                'target' => "Catégorie: {$nom}",
                'details' => "Catégorie supprimée"
            ]);
        }

        return response()->json(['message' => 'Categorie supprimee']);
    }
}
