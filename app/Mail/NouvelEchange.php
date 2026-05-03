<?php
namespace App\Mail;

use App\Models\Echange;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NouvelEchange extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Echange $echange) {}

    public function build()
    {
        return $this->subject('🔄 Nouvelle demande d\'échange — SwapMarket')
                    ->view('emails.nouvel_echange');
    }
}