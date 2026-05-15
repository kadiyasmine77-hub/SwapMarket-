<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $data = $request->validate([
            'nom_complet'    => 'required|string|max:200',
            'email'          => 'required|email|unique:users,email',
            'telephone'      => 'nullable|string|max:20',
            'mot_de_passe'   => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*#?&_\-\+\=\(\)\[\]\{\}\.\,\;]/',
                'confirmed'
            ],
            'ville'          => 'required|string|max:100',
            'date_naissance' => 'nullable|date',
            'photo_profil'   => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo_profil')) {
            $data['photo_profil'] = $request->file('photo_profil')->store('profiles', 'public');
        }

        $data['mot_de_passe']  = Hash::make($data['mot_de_passe']);
        $data['statut_compte'] = 'actif';
        $data['is_verifie']    = true;
        $data['role'] = 'user';

        $user  = User::create($data);
        $token = $user->createToken('api-token')->plainTextToken;

        // Enregistrer le log
        ActivityLog::create([
            'admin_id' => 1, // Action système
            'action' => 'Inscription utilisateur',
            'target' => $user->nom_complet,
            'details' => "Nouvel utilisateur inscrit"
        ]);

        return response()->json([
            'user'  => $user,
            'token' => $token
        ]);
    }


    public function login(Request $request)
    {
        $request->validate([
            'email'        => 'required|email',
            'mot_de_passe' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => trans('auth.failed')], 401);
        }

        if (!Hash::check($request->mot_de_passe, $user->mot_de_passe)) {
            return response()->json(['message' => trans('auth.password')], 401);
        }

        if (!$user->is_verifie) {
            return response()->json(['message' => 'Compte non vérifié'], 403);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token
        ]);
    }


    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Déconnecté avec succès'
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Aucun compte trouvé avec cette adresse email.'], 404);
        }

        $token = Str::random(60);

        DB::table('password_resets')->updateOrInsert(
            ['email' => $user->email],
            ['token' => $token, 'created_at' => now()]
        );

        $resetLink = env('FRONTEND_URL', 'http://localhost:5173') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);

        Mail::to($user->email)->send(new \App\Mail\ReinitialisationMdpMail($resetLink, $user->nom_complet));

        return response()->json(['message' => 'Un lien de réinitialisation a été envoyé à votre adresse email.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'mot_de_passe' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*#?&_\-\+\=\(\)\[\]\{\}\.\,\;]/',
                'confirmed'
            ]
        ]);

        $resetRecord = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$resetRecord) {
            return response()->json(['message' => 'Le lien de réinitialisation est invalide ou a expiré.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        $user->mot_de_passe = Hash::make($request->mot_de_passe);
        $user->save();

        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.']);
    }
    public function getProfile($id)
    {
        $user = \App\Models\User::withCount('objets')->findOrFail($id);
        
        // Count completed exchanges (where user is either demandeur or destinataire)
        $user->echanges_count = \App\Models\Echange::where('statut', 'termine')
            ->where(function($q) use ($id) {
                $q->where('id_demandeur', $id)
                  ->orWhere('id_destinataire', $id);
            })->count();

        // Calculate average rating from reviews received on their objects
        $avgRating = \App\Models\Avis::whereHas('objet', function($q) use ($id) {
            $q->where('id_user', $id);
        })->avg('note');

        $user->avg_rating = round($avgRating, 1) ?: 0;

        return response()->json($user);
    }
}
