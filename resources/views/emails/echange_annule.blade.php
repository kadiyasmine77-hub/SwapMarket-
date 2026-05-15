@extends('layouts.email')

@section('content')
  <h1>Échange annulé</h1>
  
  @if($estDemandeur)
    <p>Bonjour {{ $echange->demandeur->nom_complet }},</p>
    <p>Nous vous informons que votre demande d'échange pour l'objet <strong>{{ $echange->objet2->titre }}</strong> a été annulée.</p>
  @else
    <p>Bonjour {{ $echange->destinataire->nom_complet }},</p>
    <p>Nous vous informons que la proposition d'échange concernant votre objet <strong>{{ $echange->objet2->titre }}</strong> a été annulée par l'autre partie.</p>
  @endif
  
  <p>L'objet redevient disponible pour d'autres propositions sur la plateforme.</p>
  
  <a href="{{ env('FRONTEND_URL') }}/user" class="btn">Voir mes échanges</a>

  <div class="subtle-box">
    <p style="margin: 0; font-size: 14px; color: #666;">
      Vous pouvez continuer à explorer d'autres objets sur SwapMarket pour trouver de nouveaux échanges intéressants !
    </p>
  </div>
@endsection
