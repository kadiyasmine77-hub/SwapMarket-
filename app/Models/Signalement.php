<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Signalement extends Model
{
    use HasFactory;

    protected $table = 'signalements';
    protected $primaryKey = 'id_signalement';

    protected $fillable = [
        'id_utilisateur',
        'id_objet',
        'motif',
        'description',
        'statut'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_utilisateur', 'id_user');
    }

    public function objet()
    {
        return $this->belongsTo(Objet::class, 'id_objet', 'id_objet');
    }
}
