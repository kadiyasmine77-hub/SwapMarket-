<?php
namespace Database\Seeders;

use App\Models\User;
use App\Models\Categorie;
use App\Models\Objet;
use App\Models\ObjetImage;
use App\Models\Avis;
use App\Models\Echange;
use App\Models\Message;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        //m1
        // 1. D'abord les tables sans dépendances
        // User::factory(10)->create();
        // Categorie::factory(5)->create();

        // 1. Données fixes (important pour PFE)
        $this->call([
            CategorieSeeder::class,
            UserSeeder::class,
        ]);

        // 2. Ensuite les tables qui dépendent de User + Categorie
        Objet::factory(20)->create();

        // 3. Ensuite les tables qui dépendent de Objet
        ObjetImage::factory(30)->create();
        Avis::factory(25)->create();

        // 4. Ensuite Echange (dépend de Objet + User)
        Echange::factory(10)->create();

        // 5. En dernier Message (dépend de Echange + User)
        Message::factory(40)->create();
    }
}