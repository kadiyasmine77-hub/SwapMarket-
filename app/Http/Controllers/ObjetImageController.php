<?php
namespace App\Http\Controllers;

use App\Models\Objet;
use App\Models\ObjetImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ObjetImageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // jib image 
    public function index($objetId)
    {
        return response()->json(Objet::findOrFail($objetId)->images);
    }

    // zid image
    public function store(Request $request, $objetId)
    {
        $objet = Objet::findOrFail($objetId);

        if ($objet->id_user !== Auth::user()->id_user)
            return response()->json(['message' => 'Non autorisé'], 403);

        $request->validate([
            'images'   => 'required|array|max:5',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $saved = [];
        $user = Auth::user();
        $safeUser = str_replace(' ', '_', preg_replace('/[^A-Za-z0-9\- ]/', '', $user->nom_complet));
        $safeTitle = str_replace(' ', '_', preg_replace('/[^A-Za-z0-9\- ]/', '', $objet->titre));

        foreach ($request->file('images') as $index => $img) {
            $extension = $img->getClientOriginalExtension();
            $filename = $safeUser . '_' . $safeTitle . '_galerie_' . time() . '_' . $index . '.' . $extension;
            
            $path = $img->storeAs('objets/galerie', $filename, 'public');
            
            $saved[] = ObjetImage::create([
                'image_url' => $path,
                'id_objet'  => $objetId,
            ]);
        }

        return response()->json($saved, 201);
    }

    //delete image dyal objet
    public function destroy($objetId, $imageId)
    {
        $objet = Objet::findOrFail($objetId);

        if ($objet->id_user !== Auth::user()->id_user)
            return response()->json(['message' => 'Non autorisé'], 403);

        $image = ObjetImage::where('id_objet', $objetId)->findOrFail($imageId);
        Storage::disk('public')->delete($image->image_url);
        $image->delete();

        return response()->json(['message' => 'Image supprimée']);
    }
}
