<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('objets', function (Blueprint $table) {
            $table->id('id_objet');
            $table->string('titre');
            $table->text('description');
            $table->string('image')->nullable();
            $table->enum('etat', ['neuf', 'bon', 'moyen', 'mauvais']);
            $table->enum('disponibilite', ['disponible', 'reserve', 'echange'])->default('disponible');
            $table->foreignId('id_user')->constrained('users', 'id_user')->onDelete('cascade');
            $table->foreignId('id_categorie')->constrained('categories', 'id_categorie');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('objets');
    }
};
