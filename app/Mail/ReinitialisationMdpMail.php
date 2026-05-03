<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReinitialisationMdpMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $url, public string $nom) {}

    public function build()
    {
        return $this->subject('🔒 Réinitialisation de votre mot de passe — SwapMarket')
                    ->view('emails.reinitialisation_mdp');
    }
}
