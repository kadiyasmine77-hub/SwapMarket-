<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'nom_complet' => 'Admin SwapMarket',
            'email' => 'admin@swapmarket.com',
            'mot_de_passe' => Hash::make('admin123'),
            'role' => 'admin',
            'statut_compte' => 'actif',
            'is_verifie' => true,
            'ville' => 'Casablanca',
        ]);

        // Users random
        User::factory()->count(10)->create();
    }
}
