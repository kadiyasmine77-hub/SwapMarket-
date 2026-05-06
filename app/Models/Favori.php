&<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favori extends Model
{
    use HasFactory;

    protected $table = 'favoris';
    protected $primaryKey = 'id_favori';

    protected $fillable = [
        'id_user',
        'id_objet',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function objet()
    {
        return $this->belongsTo(Objet::class, 'id_objet');
    }
}
