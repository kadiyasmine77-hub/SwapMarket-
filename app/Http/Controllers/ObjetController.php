<?php

namespace App\Http\Controllers;

use App\Models\Objet;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ObjetController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 10);
        $perPage = $perPage > 0 ? min($perPage, 100) : 10;

        $query = Objet::with(['user', 'categorie', 'images'])->latest('id_objet');

        if ($request->user_id) {
            $query->where('id_user', $request->user_id);
        }

        if ($request->categorie) {
            $query->where('id_categorie', $request->categorie);
        }

        if ($request->etat) {
            $query->where('etat', $request->etat);
        }

        if ($request->disponibilite) {
            $query->where('disponibilite', $request->disponibilite);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('titre', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $objets = $query->paginate($perPage);

        // Check favorites for logged in user
        if (Auth::guard('sanctum')->check()) {
            $userId = Auth::guard('sanctum')->id();
            $favorisIds = \App\Models\Favori::where('id_user', $userId)->pluck('id_objet')->toArray();
            
            $objets->getCollection()->transform(function($objet) use ($favorisIds) {
                $objet->is_favorited = in_array($objet->id_objet, $favorisIds);
                return $objet;
            });
        }

        return response()->json($objets);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'etat' => 'required|in:neuf,bon,moyen,mauvais',
            'disponibilite' => 'in:disponible,reserve,echange',
            'id_categorie' => 'required|exists:categories,id_categorie',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
            'gallery' => 'nullable|array|max:5',
            'gallery.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $user = Auth::user();
        $safeUser = str_replace(' ', '_', preg_replace('/[^A-Za-z0-9\- ]/', '', $user->nom_complet));
        $safeTitle = str_replace(' ', '_', preg_replace('/[^A-Za-z0-9\- ]/', '', $request->titre));

        $data = $request->only(['titre', 'description', 'etat', 'disponibilite', 'id_categorie']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $filename = $safeUser . '_' . $safeTitle . '_cover.' . $extension;
            $data['image'] = $file->storeAs('objets/covers', $filename, 'public');
        }

        $data['id_user'] = $user->id_user;
        $objet = Objet::create($data);

        // Enregistrer le log
        ActivityLog::create([
            'admin_id' => 1, // Marqué comme action système/automatique
            'action' => 'Nouvelle annonce',
            'target' => $objet->titre,
            'details' => "Annonce publiée par {$user->nom_complet}"
        ]);

        // Handle gallery images if present
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $index => $img) {
                $extension = $img->getClientOriginalExtension();
                $filename = $safeUser . '_' . $safeTitle . '_galerie_' . time() . '_' . $index . '.' . $extension;
                $path = $img->storeAs('objets/galerie', $filename, 'public');
                
                \App\Models\ObjetImage::create([
                    'image_url' => $path,
                    'id_objet'  => $objet->id_objet,
                ]);
            }
        }

        return response()->json($objet->load('images'), 201);
    }

    public function show($id)
    {
        $objet = Objet::with(['user', 'categorie', 'images', 'avis'])->findOrFail($id);

        if (Auth::guard('sanctum')->check()) {
            $userId = Auth::guard('sanctum')->id();
            $objet->is_favorited = \App\Models\Favori::where('id_user', $userId)
                ->where('id_objet', $id)
                ->exists();
        }

        return response()->json($objet);
    }

    public function update(Request $request, $id)
    {
        $obj = Objet::findOrFail($id);

        if ($obj->id_user !== Auth::user()->id_user) {
            return response()->json(['message' => 'Non autorise'], 403);
        }

        $request->validate([
            'titre' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'etat' => 'sometimes|in:neuf,bon,moyen,mauvais',
            'disponibilite' => 'sometimes|in:disponible,reserve,echange',
            'id_categorie' => 'sometimes|exists:categories,id_categorie',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'gallery' => 'nullable|array|max:10',
            'gallery.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'deleted_images' => 'nullable|array',
            'deleted_images.*' => 'integer',
        ]);

        $data = $request->only(['titre', 'description', 'etat', 'disponibilite', 'id_categorie']);
        $user = Auth::user();
        $safeUser = str_replace(' ', '_', preg_replace('/[^A-Za-z0-9\- ]/', '', $user->nom_complet));
        $safeTitle = str_replace(' ', '_', preg_replace('/[^A-Za-z0-9\- ]/', '', $request->titre ?: $obj->titre));

        if ($request->hasFile('image')) {
            // Delete old main image
            if ($obj->image) {
                Storage::disk('public')->delete($obj->image);
            }
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $filename = $safeUser . '_' . $safeTitle . '_cover_' . time() . '.' . $extension;
            $data['image'] = $file->storeAs('objets/covers', $filename, 'public');
        }

        $obj->update($data);

        // Handle gallery image deletions
        if ($request->deleted_images) {
            foreach ($request->deleted_images as $imgId) {
                $image = \App\Models\ObjetImage::where('id_objet', $id)->find($imgId);
                if ($image) {
                    Storage::disk('public')->delete($image->image_url);
                    $image->delete();
                }
            }
        }

        // Add new images to gallery
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $index => $img) {
                $extension = $img->getClientOriginalExtension();
                $filename = $safeUser . '_' . $safeTitle . '_galerie_' . time() . '_' . $index . '.' . $extension;
                $path = $img->storeAs('objets/galerie', $filename, 'public');
                
                \App\Models\ObjetImage::create([
                    'image_url' => $path,
                    'id_objet'  => $obj->id_objet,
                ]);
            }
        }

        return response()->json($obj->load('images'));
    }

    public function destroy($id)
    {
        $obj = Objet::findOrFail($id);

        if ($obj->id_user !== Auth::user()->id_user) {
            return response()->json(['message' => 'Non autorise'], 403);
        }

        if ($obj->image) {
            Storage::disk('public')->delete($obj->image);
        }

        // Supprimer aussi les images de la galerie s'il y en a
        if ($obj->images) {
            foreach ($obj->images as $img) {
                Storage::disk('public')->delete($img->image_url);
            }
        }

        $obj->delete();

        return response()->json(['message' => 'Objet supprime']);
    }

    public function addImages(Request $request, $id)
    {
        $obj = Objet::findOrFail($id);
        
        if ($obj->id_user !== Auth::user()->id_user) {
            return response()->json(['message' => 'Non autorise'], 403);
        }

        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|max:5120'
        ]);

        $uploadedImages = [];
        if ($request->hasFile('images')) {
            $user = Auth::user();
            $safeUser = str_replace(' ', '_', preg_replace('/[^A-Za-z0-9\- ]/', '', $user->nom_complet));
            $safeTitle = str_replace(' ', '_', preg_replace('/[^A-Za-z0-9\- ]/', '', $obj->titre));

            foreach ($request->file('images') as $index => $file) {
                $extension = $file->getClientOriginalExtension();
                // On ajoute un index et le temps pour éviter que les fichiers s'écrasent
                $filename = $safeUser . '_' . $safeTitle . '_galerie_' . ($index + 1) . '_' . time() . '.' . $extension;
                
                $path = $file->storeAs('objets/galerie', $filename, 'public');
                $uploadedImages[] = $obj->images()->create(['image_url' => $path]);
            }
        }

        return response()->json($uploadedImages, 201);
    }
}
