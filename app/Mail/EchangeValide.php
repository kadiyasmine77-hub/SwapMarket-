<?php
namespace App\Mail;

use App\Models\Echange;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EchangeValide extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Echange $echange) {}

    public function build()
    {
        return $this->subject('✅ Votre échange a été accepté — SwapMarket')
                    ->view('emails.echange_valide');
    }
}