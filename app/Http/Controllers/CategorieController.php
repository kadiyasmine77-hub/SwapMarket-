<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:sanctum')->except(['index', 'show']);
        // $this->middleware('checkrole:admin')->except(['index', 'show']);
    }

    public function index()
    {
        return response()->json(Categorie::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|unique:categories,nom',
            'description' => 'nullable|string',
        ]);

        return response()->json(Categorie::create($data), 201);
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

        $categorie->delete();

        return response()->json(['message' => 'Categorie supprimee']);
    }
}
