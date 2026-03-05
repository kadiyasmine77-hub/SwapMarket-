<?php
namespace Database\Factories;

use App\Models\User;
use App\Models\Objet;
use Illuminate\Database\Eloquent\Factories\Factory;

class AvisFactory extends Factory
{
    public function definition(): array
    {
        return [
            'note'        => fake()->numberBetween(1, 5),
            'commentaire' => fake()->paragraph(),
            'id_user'     => User::inRandomOrder()->first()->id_user,
            'id_objet'    => Objet::inRandomOrder()->first()->id_objet,
        ];
    }
}