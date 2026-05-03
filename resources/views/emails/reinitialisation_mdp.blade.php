@extends('layouts.email')

@section('color', '#2563eb')

@section('title')
  🔒 Sécurisez votre compte
@endsection

@section('content')
      <p style="font-size: 18px; color: #1e293b; font-weight: 600;">Bonjour {{ $nom }},</p>
      <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte SwapMarket. Si vous êtes à l'origine de cette demande, vous pouvez procéder à la réinitialisation ci-dessous :</p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="{{ $url }}" class="btn">Réinitialiser mon mot de passe</a>
      </div>

      <div class="card">
        <p style="margin: 0; font-size: 13px; color: #64748b; text-align: center;">
          <strong>Note de sécurité :</strong> Ce lien expirera dans 60 minutes. Pour votre sécurité, ne partagez jamais cet e-mail.
        </p>
      </div>

      <p>Si vous n'avez pas demandé de réinitialisation, vous pouvez ignorer cet e-mail en toute sécurité. Votre mot de passe actuel restera inchangé.</p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
        <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
          Si vous rencontrez des difficultés avec le bouton, copiez et collez l'adresse suivante dans votre navigateur :<br>
          <a href="{{ $url }}" style="color: #2563eb; text-decoration: none; word-break: break-all;">{{ $url }}</a>
        </p>
      </div>
@endsection
