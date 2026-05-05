<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'action',
        'target',
        'details'
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id', 'id_user');
    }
}
