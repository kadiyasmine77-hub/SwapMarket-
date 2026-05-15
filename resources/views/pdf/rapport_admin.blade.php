@php
    $copy = ($lang ?? 'fr') === 'en'
        ? [
            'title' => 'SwapMarket Admin Report',
            'generated' => 'Generated on',
            'confidential' => 'Confidential',
            'users' => 'Users',
            'objects' => 'Objects',
            'exchanges' => 'Exchanges',
            'reviews' => 'Reviews',
            'registered_users' => 'Registered users',
            'full_name' => 'Full name',
            'city' => 'City',
            'role' => 'Role',
            'status' => 'Status',
            'active' => 'Active',
            'suspended' => 'Suspended',
            'disabled' => 'Disabled',
            'pending' => 'Pending',
            'accepted' => 'Accepted',
            'refused' => 'Refused',
            'completed' => 'Completed',
            'admin_role' => 'Admin',
            'user_role' => 'User',
            'none_user' => 'No users',
            'latest_exchanges' => 'Latest exchanges',
            'requester' => 'Requester',
            'recipient' => 'Recipient',
            'offered_item' => 'Offered item',
            'requested_item' => 'Requested item',
            'date' => 'Date',
            'none_exchange' => 'No exchange',
            'footer' => 'Object exchange platform',
            'footer_generated' => 'Report generated automatically on',
            'footer_confidential' => 'Confidential document',
        ]
        : [
            'title' => 'Rapport Administrateur SwapMarket',
            'generated' => 'Genere le',
            'confidential' => 'Confidentiel',
            'users' => 'Utilisateurs',
            'objects' => 'Objets',
            'exchanges' => 'Echanges',
            'reviews' => 'Avis',
            'registered_users' => 'Utilisateurs inscrits',
            'full_name' => 'Nom complet',
            'city' => 'Ville',
            'role' => 'Role',
            'status' => 'Statut',
            'active' => 'Actif',
            'suspended' => 'Suspendu',
            'disabled' => 'Desactive',
            'pending' => 'En attente',
            'accepted' => 'Valide',
            'refused' => 'Refuse',
            'completed' => 'Termine',
            'admin_role' => 'Admin',
            'user_role' => 'Utilisateur',
            'none_user' => 'Aucun utilisateur',
            'latest_exchanges' => 'Derniers echanges',
            'requester' => 'Demandeur',
            'recipient' => 'Destinataire',
            'offered_item' => 'Objet propose',
            'requested_item' => 'Objet demande',
            'date' => 'Date',
            'none_exchange' => 'Aucun echange',
            'footer' => "Plateforme d'echange d'objets",
            'footer_generated' => 'Rapport genere automatiquement le',
            'footer_confidential' => 'Document confidentiel',
        ];
@endphp
@php
    $statusLabels = [
        'actif' => $copy['active'],
        'suspendu' => $copy['suspended'],
        'desactive' => $copy['disabled'],
        'en_attente' => $copy['pending'],
        'valide' => $copy['accepted'],
        'refuse' => $copy['refused'],
        'termine' => $copy['completed'],
    ];
    $roleLabels = [
        'admin' => $copy['admin_role'],
        'user' => $copy['user_role'],
    ];
@endphp
<!DOCTYPE html>
<html lang="{{ $lang ?? 'fr' }}">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $copy['title'] }}</title>
    <style>
        @page { margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 10px;
            color: #1a1a1a;
            background: #ffffff;
            line-height: 1.5;
        }
        .header {
            padding: 30px 30px 20px 30px;
            margin-bottom: 30px;
            border-bottom: 1px solid #eaeaea;
        }
        .header h1 {
            color: #000000;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
            letter-spacing: -0.5px;
        }
        .header p {
            font-size: 11px;
            color: #666666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .stats-grid {
            width: 100%;
            margin-bottom: 30px;
            padding: 0 30px;
        }
        .stats-grid table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 15px 0;
        }
        .stat-box {
            background: #fafafa;
            border: 1px solid #eaeaea;
            border-radius: 8px;
            padding: 20px 15px;
            text-align: center;
            width: 25%;
        }
        .stat-number {
            font-size: 24px;
            font-weight: 700;
            color: #000000;
            display: block;
            margin-bottom: 4px;
        }
        .stat-label {
            font-size: 10px;
            color: #666666;
            text-transform: uppercase;
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #000000;
            padding: 0 30px 10px 30px;
            margin-bottom: 15px;
            border-bottom: 1px solid #eaeaea;
        }
        .table-wrap { padding: 0 30px; margin-bottom: 40px; }
        table.data {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }
        table.data thead tr {
            background: #fafafa;
            border-top: 1px solid #eaeaea;
            border-bottom: 1px solid #eaeaea;
        }
        table.data thead th {
            padding: 12px 15px;
            text-align: left;
            font-weight: 600;
            color: #333333;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        table.data tbody tr {
            border-bottom: 1px solid #f5f5f5;
        }
        table.data tbody tr:nth-child(even) {
            background: #ffffff;
        }
        table.data tbody td {
            padding: 10px 15px;
            color: #1a1a1a;
            vertical-align: middle;
        }
        .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 500;
            display: inline-block;
            text-transform: uppercase;
        }
        /* Elegant Minimalist Badges (Notion style) */
        .badge-actif, .badge-active { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .badge-suspendu, .badge-suspended { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
        .badge-desactive, .badge-disabled { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }
        
        .badge-valide, .badge-accepted { background: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd; }
        .badge-refuse, .badge-refused { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
        .badge-en_attente, .badge-pending { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
        .badge-termine, .badge-completed { background: #f8fafc; color: #334155; border: 1px solid #e2e8f0; }
        
        .badge-admin { background: #0f172a; color: #ffffff; border: 1px solid #0f172a; }
        .badge-user { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
        
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 15px 30px;
            background: #ffffff;
            border-top: 1px solid #eaeaea;
            font-size: 9px;
            color: #888888;
            text-align: center;
        }
    </style>
</head>
<body>
<div class="header">
    <h1>SwapMarket - {{ $copy['title'] }}</h1>
    <p>{{ $copy['generated'] }} {{ $date }} &nbsp;|&nbsp; {{ $copy['confidential'] }}</p>
</div>

<div class="stats-grid">
    <table>
        <tr>
            <td class="stat-box">
                <span class="stat-number">{{ $stats['total_users'] }}</span>
                <span class="stat-label">{{ $copy['users'] }}</span>
            </td>
            <td class="stat-box">
                <span class="stat-number">{{ $stats['total_objets'] }}</span>
                <span class="stat-label">{{ $copy['objects'] }}</span>
            </td>
            <td class="stat-box">
                <span class="stat-number">{{ $stats['total_echanges'] }}</span>
                <span class="stat-label">{{ $copy['exchanges'] }}</span>
            </td>
            <td class="stat-box">
                <span class="stat-number">{{ $stats['total_avis'] }}</span>
                <span class="stat-label">{{ $copy['reviews'] }}</span>
            </td>
        </tr>
    </table>
</div>

<div class="section-title">{{ $copy['registered_users'] }}</div>
<div class="table-wrap">
    <table class="data">
        <thead>
            <tr>
                <th>#</th>
                <th>{{ $copy['full_name'] }}</th>
                <th>Email</th>
                <th>{{ $copy['city'] }}</th>
                <th>{{ $copy['role'] }}</th>
                <th>{{ $copy['objects'] }}</th>
                <th>{{ $copy['reviews'] }}</th>
                <th>{{ $copy['status'] }}</th>
            </tr>
        </thead>
        <tbody>
            @forelse($users as $user)
            <tr>
                <td>{{ $user->id_user }}</td>
                <td>{{ $user->nom_complet }}</td>
                <td>{{ $user->email }}</td>
                <td>{{ $user->ville ?? '-' }}</td>
                <td>
                    <span class="badge badge-{{ $user->role }}">
                        {{ $roleLabels[$user->role] ?? ucfirst($user->role) }}
                    </span>
                </td>
                <td>{{ $user->objets_count }}</td>
                <td>{{ $user->avis_count }}</td>
                <td>
                    <span class="badge badge-{{ $user->statut_compte }}">
                        {{ $statusLabels[$user->statut_compte] ?? ucfirst($user->statut_compte) }}
                    </span>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="8" style="text-align:center; color:#9ca3af;">
                    {{ $copy['none_user'] }}
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

<div class="section-title">{{ $copy['latest_exchanges'] }}</div>
<div class="table-wrap">
    <table class="data">
        <thead>
            <tr>
                <th>#</th>
                <th>{{ $copy['requester'] }}</th>
                <th>{{ $copy['recipient'] }}</th>
                <th>{{ $copy['offered_item'] }}</th>
                <th>{{ $copy['requested_item'] }}</th>
                <th>{{ $copy['status'] }}</th>
                <th>{{ $copy['date'] }}</th>
            </tr>
        </thead>
        <tbody>
            @forelse($echanges as $e)
            <tr>
                <td>{{ $e->id_echange }}</td>
                <td>{{ $e->demandeur->nom_complet ?? '-' }}</td>
                <td>{{ $e->destinataire->nom_complet ?? '-' }}</td>
                <td>{{ Str::limit($e->objet1->titre ?? '-', 40) }}</td>
                <td>{{ Str::limit($e->objet2->titre ?? '-', 40) }}</td>
                <td>
                    <span class="badge badge-{{ $e->statut }}">
                        {{ $statusLabels[$e->statut] ?? ucfirst(str_replace('_', ' ', $e->statut)) }}
                    </span>
                </td>
                <td>{{ \Carbon\Carbon::parse($e->created_at)->format('d/m/Y') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="7" style="text-align:center; color:#9ca3af;">
                    {{ $copy['none_exchange'] }}
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

<div class="footer">
    SwapMarket - {{ $copy['footer'] }} &nbsp;|&nbsp;
    {{ $copy['footer_generated'] }} {{ $date }} &nbsp;|&nbsp;
    {{ $copy['footer_confidential'] }}
</div>
</body>
</html>
