<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Objet extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_objet';
    protected $fillable = [
        'titre', 'description', 'image', 'etat',
        'disponibilite', 'id_user', 'id_categorie'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function categorie() {
        return $this->belongsTo(Categorie::class, 'id_categorie');
    }

    public function images() {
        return $this->hasMany(ObjetImage::class, 'id_objet');
    }

    public function avis() {
        return $this->hasMany(Avis::class, 'id_objet');
    }

    public function echangesCommeObjet1() {
        return $this->hasMany(Echange::class, 'id_objet1');
    }

    public function echangesCommeObjet2() {
        return $this->hasMany(Echange::class, 'id_objet2');
    }

    // Moyenne des notes d’un objet 
    // tilisé pour afficher le rating et aider les utilisateurs à évaluer la qualité
    public function moyenneNotes()
    {
        return $this->avis()->avg('note');
    }

}
