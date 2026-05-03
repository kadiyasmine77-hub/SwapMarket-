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
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #1f2937;
            background: #ffffff;
        }
        .header {
            background: #1d4ed8;
            color: white;
            padding: 20px 30px;
            margin-bottom: 24px;
        }
        .header h1 {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 4px;
        }
        .header p {
            font-size: 11px;
            opacity: 0.85;
        }
        .stats-grid {
            width: 100%;
            margin-bottom: 24px;
            padding: 0 30px;
        }
        .stats-grid table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 8px;
        }
        .stat-box {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 14px 10px;
            text-align: center;
            width: 25%;
        }
        .stat-number {
            font-size: 26px;
            font-weight: bold;
            color: #1d4ed8;
            display: block;
            margin-bottom: 4px;
        }
        .stat-label {
            font-size: 10px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .section-title {
            font-size: 13px;
            font-weight: bold;
            color: #1d4ed8;
            padding: 0 30px 8px 30px;
            border-bottom: 2px solid #1d4ed8;
            margin-bottom: 10px;
        }
        .table-wrap { padding: 0 30px; margin-bottom: 28px; }
        table.data {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }
        table.data thead tr {
            background: #1d4ed8;
            color: white;
        }
        table.data thead th {
            padding: 8px 10px;
            text-align: left;
            font-weight: bold;
            font-size: 10px;
        }
        table.data tbody tr:nth-child(even) {
            background: #f9fafb;
        }
        table.data tbody tr:nth-child(odd) {
            background: #ffffff;
        }
        table.data tbody td {
            padding: 7px 10px;
            border-bottom: 1px solid #e5e7eb;
            color: #374151;
        }
        .badge {
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: bold;
            display: inline-block;
        }
        .badge-actif, .badge-active { background: #dcfce7; color: #166534; }
        .badge-suspendu, .badge-suspended { background: #fef9c3; color: #854d0e; }
        .badge-desactive, .badge-disabled { background: #fee2e2; color: #991b1b; }
        .badge-valide, .badge-accepted { background: #dbeafe; color: #1e40af; }
        .badge-refuse, .badge-refused { background: #fee2e2; color: #991b1b; }
        .badge-en_attente, .badge-pending { background: #fef9c3; color: #854d0e; }
        .badge-termine, .badge-completed { background: #f3f4f6; color: #374151; }
        .badge-admin { background: #ede9fe; color: #5b21b6; }
        .badge-user { background: #e0f2fe; color: #0369a1; }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px 30px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            font-size: 9px;
            color: #9ca3af;
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
                <td>{{ Str::limit($e->objet1->titre ?? '-', 25) }}</td>
                <td>{{ Str::limit($e->objet2->titre ?? '-', 25) }}</td>
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
