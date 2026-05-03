@extends('layouts.email')

@section('color', '#e74c3c')

@section('title')
  ❌ Échange refusé
@endsection

@section('content')
      <p>Bonjour <strong>{{ $echange->demandeur->nom_complet ?? 'Utilisateur' }}</strong>,</p>
      <p>Malheureusement, votre demande d'échange a été <strong>refusée</strong>.</p>
      <div class="card">
        <div class="card-row">
          <span class="label">Votre objet</span>
          <span class="value">{{ $echange->objet1->titre }}</span>
        </div>
        <div class="card-row">
          <span class="label">Objet demandé</span>
          <span class="value">{{ $echange->objet2->titre }}</span>
        </div>
      </div>
      <p>Ne vous découragez pas, il y a plein d'autres objets disponibles !</p>
      <center><a href="#" class="btn">Découvrir d'autres objets</a></center>
@endsection