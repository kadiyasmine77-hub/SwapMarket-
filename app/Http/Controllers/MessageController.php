<?php
namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Echange;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Had l-fonction kat-7seb ch-7al mn mayssaj jdid ja l-user o ba9i ma-9rahsh
    public function unreadCount()
    {
        $userId = Auth::user()->id_user;

        $count = Message::where('id_destinataire', $userId)
            ->where('lu', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    // GET /echanges/{id}/messages
    // Had l-fonction kat-jib ga3 l-mayssajat li trayin f-wahed l-echange o t-marquihom b-lu
    public function index($echangeId)
    {
        $echange = Echange::findOrFail($echangeId);
        $userId = Auth::user()->id_user;

        if ($echange->id_demandeur !== $userId && $echange->id_destinataire !== $userId)
            return response()->json(['message' => 'Non autorisé'], 403);

        Message::where('id_echange', $echangeId)
               ->where('id_destinataire', $userId)
               ->update(['lu' => true]);

        return response()->json(
            Message::with('expediteur')
                   ->where('id_echange', $echangeId)
                   ->oldest()
                   ->get()
        );
    }

    // POST /echanges/{id}/messages
    // Had l-fonction kat-khalli l-user i-sift mayssaj l-user l-akhor o t-uploadie hta les fichiers
    public function store(Request $request, $echangeId)
    {
        $echange = Echange::findOrFail($echangeId);
        $userId = Auth::user()->id_user;

        if ($echange->id_demandeur !== $userId && $echange->id_destinataire !== $userId)
            return response()->json(['message' => 'Non autorisé'], 403);

        if ($echange->statut === 'refuse' || $echange->statut === 'termine')
            return response()->json(['message' => 'Échange fermé'], 400);

        $data = $request->validate([
            'contenu' => 'nullable|string',
            'piece_jointe' => 'nullable|file|max:5120',
        ]);

        if (!$request->filled('contenu') && !$request->hasFile('piece_jointe')) {
            return response()->json(['message' => 'Le message ou la piece jointe est obligatoire'], 422);
        }

        $destinataire = $userId === $echange->id_demandeur
            ? $echange->id_destinataire
            : $echange->id_demandeur;

        if ($request->hasFile('piece_jointe')) {
            $user = Auth::user();
            $safeName = str_replace(' ', '_', preg_replace('/[^A-Za-z0-9\- ]/', '', $user->nom_complet));
            $extension = $request->file('piece_jointe')->getClientOriginalExtension();
            $filename = $safeName . '_msg_' . time() . '.' . $extension;
            
            $data['piece_jointe'] = $request->file('piece_jointe')->storeAs('messages/attachments', $filename, 'public');
            $data['nom_piece_jointe'] = $request->file('piece_jointe')->getClientOriginalName();
        }

        $message = Message::create([
            'contenu'         => $data['contenu'] ?? '',
            'piece_jointe'    => $data['piece_jointe'] ?? null,
            'nom_piece_jointe'=> $data['nom_piece_jointe'] ?? null,
            'id_expediteur'   => $userId,
            'id_destinataire' => $destinataire,
            'id_echange'      => $echangeId,
            'lu'              => false,
        ]);

        return response()->json($message->load('expediteur'), 201);
    }
}
