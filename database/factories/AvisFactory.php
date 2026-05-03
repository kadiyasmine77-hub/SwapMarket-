<?php
namespace Database\Factories;

use App\Models\User;
use App\Models\Objet;
use Illuminate\Database\Eloquent\Factories\Factory;

class AvisFactory extends Factory
{
    public function definition(): array
    {
        static $pairs = [];

        do {
            $userId  = User::inRandomOrder()->first()->id_user;
            $objetId = Objet::inRandomOrder()->first()->id_objet;
        } while (in_array("$userId-$objetId", $pairs));

        $pairs[] = "$userId-$objetId";

        return [
            'note'        => fake()->numberBetween(1, 5),
            'commentaire' => fake()->paragraph(),
            'id_user'     => $userId,
            'id_objet'    => $objetId,
        ];
    }
}