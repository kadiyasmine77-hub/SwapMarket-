<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function index() // katjib log dyal admin 
    {
        $logs = ActivityLog::with('admin:id_user,nom_complet')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($log) {
                return [
                    'id' => (string) $log->id,
                    'admin' => $log->admin ? $log->admin->nom_complet : 'Système',
                    'action' => $log->action,
                    'target' => $log->target,
                    'timestamp' => $log->created_at->format('Y-m-d H:i'),
                    'details' => $log->details,
                ];
            });

        return response()->json($logs);
    }
}
