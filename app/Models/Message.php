<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_message';
    protected $fillable = ['contenu', 'piece_jointe', 'nom_piece_jointe', 'lu', 'id_expediteur', 'id_destinataire', 'id_echange'];
    protected $casts = [
        'lu' => 'boolean',
    ];

    public function expediteur() {
        return $this->belongsTo(User::class, 'id_expediteur');
    }

    public function destinataire() {
        return $this->belongsTo(User::class, 'id_destinataire');
    }

    public function echange() {
        return $this->belongsTo(Echange::class, 'id_echange');
    }
}
