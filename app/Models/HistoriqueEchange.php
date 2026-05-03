<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriqueEchange extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['id_echange', 'ancien_statut', 'nouveau_statut'];

    public function echange() {
        return $this->belongsTo(Echange::class, 'id_echange');
    }
}
