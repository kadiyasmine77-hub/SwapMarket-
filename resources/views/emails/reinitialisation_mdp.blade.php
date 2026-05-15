@extends('layouts.email')

@section('content')
  <h1>Réinitialisez votre mot de passe</h1>
  
  <p>Bonjour {{ $nom }},</p>
  
  <p>Vous avez demandé la réinitialisation de votre mot de passe SwapMarket. Cliquez sur le lien ci-dessous pour continuer :</p>
  
  <a href="{{ $url }}" class="btn">Réinitialiser le mot de passe</a>

  <div class="subtle-box">
    <p style="margin: 0; font-size: 14px; color: #666;">
      Ce lien expirera dans 60 minutes. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.
    </p>
  </div>

  <p style="margin-top: 40px; font-size: 13px; color: #999;">
    Si le bouton ne fonctionne pas, copiez ce lien :<br>
    {{ $url }}
  </p>
@endsection
