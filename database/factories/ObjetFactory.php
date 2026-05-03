<?php
namespace Database\Factories;

use App\Models\User;
use App\Models\Categorie;
use Illuminate\Database\Eloquent\Factories\Factory;

class ObjetFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titre'         => fake()->sentence(3),
            'description'   => fake()->paragraph(),
            'image'         => fake()->imageUrl(640, 480, 'objects'),
            'etat'          => fake()->randomElement(['neuf', 'bon', 'moyen', 'mauvais']),
            'disponibilite' => fake()->randomElement(['disponible', 'reserve', 'echange']),
            'id_user' => User::inRandomOrder()->first()?->id_user ?? User::factory(),
            'id_categorie'  => Categorie::inRandomOrder()->first()->id_categorie,
        ];
    }
}