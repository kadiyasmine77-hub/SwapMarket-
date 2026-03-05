<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;  

    protected $primaryKey = 'id_user';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nom', 'prenom', 'email', 'mot_de_passe',
        'telephone', 'photo_profil', 'ville', 'pays',
        'date_naissance', 'is_verifie', 'date_inscription',
        'role', 'statut_compte'
    ];

    public function objets() {
        return $this->hasMany(Objet::class, 'id_user');
    }

    public function avis() {
        return $this->hasMany(Avis::class, 'id_user');
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
}