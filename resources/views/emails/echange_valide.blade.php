@extends('layouts.email')

@section('color', '#2a9d8f')

@section('title')
  ✅ Échange accepté !
@endsection

@section('content')
      <p>Bonjour <strong>{{ $echange->demandeur->nom_complet ?? 'Utilisateur' }}</strong>,</p>
      <p>Bonne nouvelle ! Votre demande d'échange a été <strong>acceptée</strong>.</p>
      <div class="card">
        <div class="card-row">
          <span class="label">Votre objet</span>
          <span class="value">{{ $echange->objet1->titre }}</span>
        </div>
        <div class="card-row">
          <span class="label">Objet reçu</span>
          <span class="value">{{ $echange->objet2->titre }}</span>
        </div>
        <div class="card-row">
          <span class="label">Avec</span>
          <span class="value">{{ $echange->destinataire->nom_complet ?? 'Inconnu' }}</span>
        </div>
        <div class="card-row">
          <span class="label">Date validation</span>
          <span class="value">{{ now()->format('d/m/Y') }}</span>
        </div>
      </div>
      <p>Contactez l'autre utilisateur pour organiser l'échange.</p>
      <center><a href="#" class="btn">Voir l'échange</a></center>
@endsection