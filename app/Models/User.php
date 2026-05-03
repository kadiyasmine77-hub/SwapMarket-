<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // ← Sanctum trait
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'id_user';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nom_complet', 'email', 'mot_de_passe',
        'telephone', 'photo_profil', 'ville',
        'date_naissance', 'is_verifie',
        'role', 'statut_compte'
    ];

    protected $hidden = ['mot_de_passe'];

    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    public function objets() {
        return $this->hasMany(Objet::class, 'id_user');
    }

    public function echangesEnvoyes() {
        return $this->hasMany(Echange::class, 'id_demandeur');
    }

    public function echangesRecus() {
        return $this->hasMany(Echange::class, 'id_destinataire');
    }

    public function messagesEnvoyes() {
        return $this->hasMany(Message::class, 'id_expediteur');
    }

    public function messagesRecus() {
        return $this->hasMany(Message::class, 'id_destinataire');
    }

    public function avis() {
        return $this->hasMany(Avis::class, 'id_user');
    }

    /**
     * Envoyer la notification de réinitialisation de mot de passe.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $url = env('FRONTEND_URL', 'http://localhost:5173') . '/reset-password?token=' . $token . '&email=' . urlencode($this->email);
        
        \Illuminate\Support\Facades\Mail::to($this->email)->send(
            new \App\Mail\ReinitialisationMdpMail($url, $this->nom_complet)
        );
    }
}