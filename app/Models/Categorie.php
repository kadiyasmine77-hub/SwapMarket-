<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    use HasFactory;
    
    protected $primaryKey = 'id_categorie';
    protected $fillable = ['nom', 'description'];

    public function objets() {
        return $this->hasMany(Objet::class, 'id_categorie');
    }
}
