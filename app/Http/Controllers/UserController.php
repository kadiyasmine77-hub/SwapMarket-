<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Had lfonction katjib les informations dyal luser li mconnecti db
    public function profil(Request $request)
    {
        return response()->json($request->user());
    }

    // Had lfonction katkhalli luser ibeddel lprofile dyalo (smia, tel, tswira...)
    public function update(Request $request)
    {
        $user = $request->user();
        $this->normalizeProfileInput($request);

        $data = $request->validate([
            'nom_complet'    => 'nullable|string|max:200',
            'telephone'      => 'nullable|regex:/^[0-9]{10}$/',
            'ville'          => 'nullable|string|max:100|regex:/^([^0-9]*)$/',
            'date_naissance' => 'nullable',
            'photo_profil'   => 'nullable|image|max:5120'
        ]);

        if ($request->hasFile('photo_profil')) {
            // Supprimer l'ancienne photo si elle existe
            if ($user->photo_profil) {
                Storage::disk('public')->delete($user->photo_profil);
            }

            $file = $request->file('photo_profil');
            $extension = $file->getClientOriginalExtension();
            // Nettoyer le nom pour le fichier (pas d'espaces ni caractères spéciaux)
            $safeName = str_replace(' ', '_', preg_replace('/[^A-Za-z0-9\- ]/', '', $user->nom_complet));
            $filename = $safeName . '_profil_' . time() . '.' . $extension;
            
            $path = $file->storeAs('profiles', $filename, 'public');
            $data['photo_profil'] = $path;
        }

        $user->update($data);

        return response()->json($user->fresh());
    }

    // — Procédure stockée
    // Had lfonction katjib les statistiques dyal luser (chhal mn echange dar...) bProcedure Stockee
    public function stats(Request $request)
    {
        $userId = $request->user()->id_user;
        $stats  = DB::select('CALL GetUserStats(?)', [$userId]);
        return response()->json($stats[0] ?? []);
    }

    private function normalizeProfileInput(Request $request): void
    {
        $updates = [];
        if ($request->has('nom_complet') || $request->has('full_name')) {
            $updates['nom_complet'] = $request->input('nom_complet', $request->input('full_name'));
        }
        if ($request->has('telephone') || $request->has('phone')) {
            $updates['telephone'] = $request->input('telephone', $request->input('phone'));
        }
        if ($request->has('ville') || $request->has('city')) {
            $updates['ville'] = $request->input('ville', $request->input('city'));
        }
        if ($request->has('date_naissance') || $request->has('birth_date')) {
            $updates['date_naissance'] = $request->input('date_naissance', $request->input('birth_date'));
        }

        $request->merge($updates);

        if (($request->hasFile('profile_photo') || $request->hasFile('photo')) && !$request->hasFile('photo_profil')) {
            $file = $request->file('profile_photo') ?: $request->file('photo');
            $request->files->set('photo_profil', $file);
        }
    }


    // Had l-fonction katkhalli luser ibeddel modepasse dyalo b-wahed jdid
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!\Illuminate\Support\Facades\Hash::check($request->current_password, $user->mot_de_passe)) {
            return response()->json(['message' => 'Le mot de passe actuel est incorrect.'], 422);
        }

        $user->update([
            'mot_de_passe' => \Illuminate\Support\Facades\Hash::make($request->new_password)
        ]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès.']);
    }
}
