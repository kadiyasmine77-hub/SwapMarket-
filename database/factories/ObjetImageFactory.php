<?php
namespace Database\Factories;

use App\Models\Objet;
use Illuminate\Database\Eloquent\Factories\Factory;

class ObjetImageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'image_url' => fake()->imageUrl(800, 600, 'objects'),
            'id_objet'  => Objet::inRandomOrder()->first()->id_objet,
        ];
    }
}