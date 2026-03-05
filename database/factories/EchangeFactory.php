<?php
namespace Database\Factories;

use App\Models\User;
use App\Models\Objet;
use Illuminate\Database\Eloquent\Factories\Factory;

class EchangeFactory extends Factory
{
    public function definition(): array
    {
        $objets = Objet::inRandomOrder()->take(2)->get();
        $users  = User::inRandomOrder()->take(2)->get();

        return [
            'date_demande'    => fake()->dateTimeBetween('-1 month', 'now'),
            'date_validation' => fake()->optional()->dateTimeBetween('now', '+1 month'),
            'statut'          => fake()->randomElement(['en_attente', 'valide', 'refuse', 'termine']),
            'id_objet1'       => $objets[0]->id_objet,
            'id_objet2'       => $objets[1]->id_objet,
            'id_demandeur'    => $users[0]->id_user,
            'id_destinataire' => $users[1]->id_user,
        ];
    }
}