<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash; // Pour hasher le mot de passe

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom_complet'     => fake()->name(),
            'email'           => fake()->unique()->safeEmail(),
            'mot_de_passe'    => Hash::make('password123'),
            'telephone'       => fake()->phoneNumber(),
            'photo_profil'    => fake()->imageUrl(200, 200, 'people'),
            'ville'           => fake()->city(),
            'date_naissance'  => fake()->date('Y-m-d', '-18 years'),
            'is_verifie'      => true,
            'role'            => fake()->randomElement(['admin', 'user']),
            'statut_compte'   => fake()->randomElement(['actif', 'suspendu', 'desactive']),
        ];
    }
}