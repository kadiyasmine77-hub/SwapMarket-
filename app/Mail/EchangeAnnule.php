<?php

namespace App\Mail;

use App\Models\Echange;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EchangeAnnule extends Mailable
{
    use Queueable, SerializesModels;

    public $echange;
    public $estDemandeur;

    public function __construct(Echange $echange, $estDemandeur = false)
    {
        $this->echange = $echange;
        // Permet de savoir si celui qui reçoit l'email est le demandeur ou le destinataire initial
        $this->estDemandeur = $estDemandeur;
    }

    public function build()
    {
        return $this->subject('❌ Annulation d\'échange — SwapMarket')
                    ->view('emails.echange_annule');
    }
}
