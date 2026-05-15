<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bon d'échange #{{ $echange->id_echange }}</title>
    <style>
        @page { margin: 0; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            color: #1a1a1a; 
            line-height: 1.5; 
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .header { 
            padding: 40px 40px 20px 40px; 
            text-align: left;
            border-bottom: 1px solid #eaeaea;
        }
        .logo { height: 28px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #000000; letter-spacing: -0.02em; }
        .header p { margin: 5px 0 0; color: #666666; font-size: 14px; }
        
        .container {
            padding: 30px 40px;
            max-width: 800px;
            margin: 0 auto;
        }

        .section { margin-bottom: 25px; page-break-inside: avoid; }
        .section-title { 
            font-size: 14px; 
            color: #000000; 
            font-weight: 700; 
            border-bottom: 1px solid #eaeaea;
            padding-bottom: 8px;
            margin-bottom: 20px;
        }

        .info-grid { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .info-grid td { width: 50%; vertical-align: top; padding: 5px 0; }
        .info-grid td:nth-child(2) { padding-left: 20px; }
        
        .label { font-size: 12px; color: #666666; margin-bottom: 4px; display: block; }
        .value { font-size: 14px; color: #1a1a1a; display: block; margin-bottom: 8px; font-weight: 500; }
        
        .item-box {
            background-color: #fafafa;
            border: 1px solid #eaeaea;
            border-radius: 6px;
            padding: 20px;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            background-color: #0f172a;
            color: #ffffff;
            border: 1px solid #0f172a;
            text-transform: uppercase;
        }

        .footer {
            padding: 20px 40px;
            color: #888888;
            font-size: 12px;
            border-top: 1px solid #eaeaea;
            margin-top: 30px;
            background-color: #ffffff;
            position: absolute;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
        }
        
        .footer p { margin: 4px 0; }

        .date-box {
            background: #ffffff;
            border: 1px solid #eaeaea;
            border-radius: 6px;
            padding: 15px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="header">
        @php
            $gdEnabled = extension_loaded('gd');
            $base64 = '';
            if ($gdEnabled) {
                $path = public_path('images/logo.png');
                if (file_exists($path)) {
                    $type = pathinfo($path, PATHINFO_EXTENSION);
                    $data = file_get_contents($path);
                    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                }
            }
        @endphp
        
        @if($gdEnabled && $base64)
            <img src="{{ $base64 }}" class="logo" alt="SwapMarket">
        @else
            <h2 style="margin: 0; margin-bottom: 20px; font-size: 20px; color: #000000; font-weight: 700;">SwapMarket</h2>
        @endif
        
        <h1>Bon d'Échange Officiel</h1>
        <p>Document de confirmation de transaction</p>
    </div>

    <div class="container">
        
        <!-- Header Info -->
        <table class="info-grid" style="margin-bottom: 30px;">
            <tr>
                <td>
                    <div class="date-box">
                        <span class="label">Numéro d'échange</span>
                        <span class="value" style="font-weight: 700; color: #000000; font-size: 16px;">#SWAP-{{ str_pad($echange->id_echange, 5, '0', STR_PAD_LEFT) }}</span>
                    </div>
                </td>
                <td style="text-align: right;">
                    <div style="margin-bottom: 10px;">
                        <span class="status-badge">{{ str_replace('_', ' ', $echange->statut) }}</span>
                    </div>
                    <span class="label">Date de génération</span>
                    <span class="value" style="font-size: 13px;">{{ date('d/m/Y') }}</span>
                </td>
            </tr>
        </table>

        <!-- Participants -->
        <div class="section">
            <div class="section-title">Informations des Participants</div>
            <table class="info-grid">
                <tr>
                    <td>
                        <span class="label">Demandeur</span>
                        <span class="value">{{ $echange->demandeur->nom_complet }}</span>
                        <span style="font-size: 13px; color: #666666; display: block; margin-bottom: 3px;">{{ $echange->demandeur->email }}</span>
                        <span style="font-size: 13px; color: #666666; display: block; margin-bottom: 3px;">{{ $echange->demandeur->telephone }}</span>
                        <span style="font-size: 13px; color: #666666; display: block;">{{ $echange->demandeur->ville }}</span>
                    </td>
                    <td>
                        <span class="label">Destinataire</span>
                        <span class="value">{{ $echange->destinataire->nom_complet }}</span>
                        <span style="font-size: 13px; color: #666666; display: block; margin-bottom: 3px;">{{ $echange->destinataire->email }}</span>
                        <span style="font-size: 13px; color: #666666; display: block; margin-bottom: 3px;">{{ $echange->destinataire->telephone }}</span>
                        <span style="font-size: 13px; color: #666666; display: block;">{{ $echange->destinataire->ville }}</span>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Items -->
        <div class="section">
            <div class="section-title">Détails de l'Échange</div>
            <table class="info-grid">
                <tr>
                    <td>
                        <div class="item-box">
                            <span class="label">Objet proposé par le demandeur</span>
                            <span class="value" style="margin-bottom: 8px;">{{ $echange->objet1->titre }}</span>
                            <span style="font-size: 13px; color: #666666; display: block; margin-bottom: 3px;">Catégorie : {{ $echange->objet1->categorie->nom ?? 'N/A' }}</span>
                            <span style="font-size: 13px; color: #666666; display: block;">État : {{ ucfirst($echange->objet1->etat) }}</span>
                        </div>
                    </td>
                    <td>
                        <div class="item-box">
                            <span class="label">Objet reçu du destinataire</span>
                            <span class="value" style="margin-bottom: 8px;">{{ $echange->objet2->titre }}</span>
                            <span style="font-size: 13px; color: #666666; display: block; margin-bottom: 3px;">Catégorie : {{ $echange->objet2->categorie->nom ?? 'N/A' }}</span>
                            <span style="font-size: 13px; color: #666666; display: block;">État : {{ ucfirst($echange->objet2->etat) }}</span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Timeline -->
        <div class="section">
            <div class="section-title">Historique de la transaction</div>
            <table class="info-grid">
                <tr>
                    <td>
                        <span class="label">Date de proposition</span>
                        <span class="value">{{ \Carbon\Carbon::parse($echange->created_at)->format('d/m/Y à H:i') }}</span>
                    </td>
                    <td>
                        <span class="label">Date de dernière mise à jour</span>
                        <span class="value">{{ \Carbon\Carbon::parse($echange->updated_at)->format('d/m/Y à H:i') }}</span>
                    </td>
                </tr>
            </table>
        </div>

    </div>

    <div class="footer">
        <p><strong style="color: #000000;">SwapMarket</strong> — La plateforme de troc communautaire</p>
        <p>Ce document est généré de manière automatique et a valeur de preuve d'accord mutuel entre les parties concernées.</p>
        <p>© {{ date('Y') }} Tous droits réservés.</p>
    </div>
</body>
</html>
