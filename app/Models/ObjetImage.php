<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ObjetImage extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_image';
    protected $fillable = ['image_url', 'id_objet'];

    public function objet() {
        return $this->belongsTo(Objet::class, 'id_objet');
    }
}
