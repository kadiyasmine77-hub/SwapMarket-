<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bon d'échange #{{ $echange->id_echange }}</title>
    <style>
        @page { margin: 0; }
        body { 
            font-family: 'Helvetica', Arial, sans-serif; 
            color: #030213; 
            line-height: 1.4; 
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .header { 
            background-color: #14213d; 
            color: #ffffff; 
            padding: 25px 40px; 
            text-align: center;
        }
        .logo { height: 35px; margin-bottom: 10px; }
        .header h1 { margin: 0; font-size: 22px; letter-spacing: 1px; font-weight: 500; }
        .header p { margin: 5px 0 0; opacity: 0.8; font-size: 13px; font-weight: 300; }
        
        .container {
            padding: 30px 40px;
            max-width: 800px;
            margin: 0 auto;
        }

        .section { margin-bottom: 25px; page-break-inside: avoid; }
        .section-title { 
            font-size: 14px; 
            text-transform: uppercase; 
            color: #14213d; 
            font-weight: bold; 
            letter-spacing: 1px;
            border-bottom: 2px solid #e9ebef;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }

        .info-grid { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .info-grid td { width: 50%; vertical-align: top; padding: 5px 0; }
        .info-grid td:nth-child(2) { padding-left: 20px; }
        
        .label { font-size: 11px; color: #717182; text-transform: uppercase; margin-bottom: 3px; display: block; font-weight: bold; }
        .value { font-size: 14px; color: #030213; display: block; margin-bottom: 5px; }
        
        .item-box {
            background-color: #f3f3f5;
            border-radius: 8px;
            padding: 15px;
            border-left: 4px solid #2d80d3;
        }

        .status-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            background-color: rgba(45, 128, 211, 0.12);
            color: #2d80d3;
            border: 1px solid rgba(45, 128, 211, 0.2);
        }

        .footer {
            text-align: center;
            padding: 20px;
            color: #717182;
            font-size: 11px;
            border-top: 1px solid #ececf0;
            margin-top: 10px;
            background-color: #fcfcfd;
            position: absolute;
            bottom: 0;
            width: 100%;
        }
        
        .footer p { margin: 3px 0; }

        .date-box {
            background: #ffffff;
            border: 1px solid #ececf0;
            border-radius: 8px;
            padding: 12px;
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
            <h2 style="margin: 0; margin-bottom: 10px; font-size: 24px; color: #7f9dcb;">SWAPMARKET</h2>
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
                        <span class="value" style="font-weight: bold; color: #2d80d3;">#SWAP-{{ str_pad($echange->id_echange, 5, '0', STR_PAD_LEFT) }}</span>
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
                        <span class="value" style="font-weight: bold;">{{ $echange->demandeur->nom_complet }}</span>
                        <span class="value" style="font-size: 13px; color: #717182;">{{ $echange->demandeur->email }}</span>
                        <span class="value" style="font-size: 13px; color: #717182;">{{ $echange->demandeur->telephone }}</span>
                        <span class="value" style="font-size: 13px; color: #717182;">{{ $echange->demandeur->ville }}</span>
                    </td>
                    <td>
                        <span class="label">Destinataire</span>
                        <span class="value" style="font-weight: bold;">{{ $echange->destinataire->nom_complet }}</span>
                        <span class="value" style="font-size: 13px; color: #717182;">{{ $echange->destinataire->email }}</span>
                        <span class="value" style="font-size: 13px; color: #717182;">{{ $echange->destinataire->telephone }}</span>
                        <span class="value" style="font-size: 13px; color: #717182;">{{ $echange->destinataire->ville }}</span>
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
                            <span class="label" style="color: #2d80d3;">Objet proposé par le demandeur</span>
                            <span class="value" style="font-weight: bold; margin-bottom: 5px;">{{ $echange->objet1->titre }}</span>
                            <span style="font-size: 13px; color: #717182; display: block;">Catégorie: {{ $echange->objet1->categorie->nom ?? 'N/A' }}</span>
                            <span style="font-size: 13px; color: #717182; display: block;">État: {{ ucfirst($echange->objet1->etat) }}</span>
                        </div>
                    </td>
                    <td>
                        <div class="item-box">
                            <span class="label" style="color: #2d80d3;">Objet reçu du destinataire</span>
                            <span class="value" style="font-weight: bold; margin-bottom: 5px;">{{ $echange->objet2->titre }}</span>
                            <span style="font-size: 13px; color: #717182; display: block;">Catégorie: {{ $echange->objet2->categorie->nom ?? 'N/A' }}</span>
                            <span style="font-size: 13px; color: #717182; display: block;">État: {{ ucfirst($echange->objet2->etat) }}</span>
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
        <p><strong style="color: #14213d;">SwapMarket</strong> - La plateforme de troc communautaire</p>
        <p>Ce document est généré de manière automatique et a valeur de preuve d'accord mutuel entre les parties concernées.</p>
        <p>&copy; {{ date('Y') }} Tous droits réservés.</p>
    </div>
</body>
</html>
