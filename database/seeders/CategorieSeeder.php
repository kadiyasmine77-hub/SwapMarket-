<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categorie;

class CategorieSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['nom' => 'Électronique', 'description' => 'Téléphones, ordinateurs'],
            ['nom' => 'Vêtements', 'description' => 'Habits et accessoires'],
            ['nom' => 'Livres', 'description' => 'Romans et manuels'],
            ['nom' => 'Maison', 'description' => 'Meubles et décoration'],
            ['nom' => 'Sport', 'description' => 'Équipements sportifs'],
            ['nom' => 'Jeux', 'description' => 'Jeux vidéo et société'],
            ['nom' => 'Cuisine', 'description' => 'Ustensiles cuisine'],
            ['nom' => 'Autres', 'description' => 'Divers objets'],
        ];

        foreach ($categories as $cat) {
            Categorie::create($cat);
        }
    }
}