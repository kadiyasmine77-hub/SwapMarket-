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
        Schema::create('avis', function (Blueprint $table) {
            $table->id('id_avis');
            $table->tinyInteger('note');
            $table->text('commentaire');

            $table->foreignId('id_user')->constrained('users', 'id_user')->onDelete('cascade');
            $table->foreignId('id_objet')->constrained('objets', 'id_objet')->onDelete('cascade');

            // Un utilisateur ne peut noter qu'une seule fois un objet
            $table->unique(['id_user', 'id_objet']);
            // Index pour performance
            $table->index('id_objet');

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
        Schema::dropIfExists('avis');
    }
};
