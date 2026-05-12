<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ObjetImage extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_image';
    protected $fillable = ['image_url', 'id_objet'];

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($image) {
            if ($image->image_url) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($image->image_url);
            }
        });
    }

    public function objet() {
        return $this->belongsTo(Objet::class, 'id_objet');
    }
}
