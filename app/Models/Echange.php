<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Echange extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_echange';
    protected $fillable = [
        'date_demande', 'date_validation', 'statut',
        'id_objet1', 'id_objet2', 'id_demandeur', 'id_destinataire'
    ];

    public function objet1() {
        return $this->belongsTo(Objet::class, 'id_objet1');
    }

    public function objet2() {
        return $this->belongsTo(Objet::class, 'id_objet2');
    }

    public function demandeur() {
        return $this->belongsTo(User::class, 'id_demandeur');
    }

    public function destinataire() {
        return $this->belongsTo(User::class, 'id_destinataire');
    }

    public function messages() {
        return $this->hasMany(Message::class, 'id_echange');
    }

    public function historique() {
    return $this->hasMany(HistoriqueEchange::class, 'id_echange');
}
}
