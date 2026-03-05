<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom'             => fake()->lastName(),
            'prenom'          => fake()->firstName(),
            'email'           => fake()->unique()->safeEmail(),
            'mot_de_passe'    => bcrypt('password'),
            'telephone'       => fake()->phoneNumber(),
            'photo_profil'    => fake()->imageUrl(200, 200, 'people'),
            'ville'           => fake()->city(),
            'pays'            => fake()->country(),
            'date_naissance'  => fake()->date('Y-m-d', '-18 years'),
            'is_verifie'      => fake()->boolean(),
            'date_inscription'=> now(),
            'role'            => fake()->randomElement(['admin', 'user']),
            'statut_compte'   => fake()->randomElement(['actif', 'suspendu', 'desactive']),
        ];
    }
}