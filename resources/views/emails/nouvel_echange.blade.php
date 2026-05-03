@extends('layouts.email')

@section('title')
  🔄 Nouvelle demande d'échange
@endsection

@section('content')
      <p>Bonjour <strong>{{ $echange->destinataire->nom_complet ?? 'Utilisateur' }}</strong>,</p>
      <p>Vous avez reçu une <strong>nouvelle demande d'échange</strong> !</p>
      <div class="card">
        <div class="card-row">
          <span class="label">Demandeur</span>
          <span class="value">{{ $echange->demandeur->nom_complet ?? 'Inconnu' }}</span>
        </div>
        <div class="card-row">
          <span class="label">Il propose</span>
          <span class="value">{{ $echange->objet1->titre }}</span>
        </div>
        <div class="card-row">
          <span class="label">Il veut</span>
          <span class="value">{{ $echange->objet2->titre }}</span>
        </div>
      </div>
      <p>Connectez-vous pour accepter ou refuser cette demande.</p>
      <center><a href="#" class="btn">Voir la demande</a></center>
@endsection