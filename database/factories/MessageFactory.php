<?php
namespace Database\Factories;

use App\Models\User;
use App\Models\Echange;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    public function definition(): array
    {
        $users   = User::inRandomOrder()->take(2)->get();
        $echange = Echange::inRandomOrder()->first();

        return [
            'contenu'         => fake()->paragraph(),
            'lu'              => fake()->randomElement(['oui', 'non']),
            'id_expediteur'   => $users[0]->id_user,
            'id_destinataire' => $users[1]->id_user,
            'id_echange'      => $echange->id_echange,
        ];
    }
}