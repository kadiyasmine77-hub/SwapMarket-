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
        Schema::create('signalements', function (Blueprint $table) {
            $table->id('id_signalement');
            $table->unsignedBigInteger('id_utilisateur');
            $table->unsignedBigInteger('id_objet');
            $table->enum('motif', ['spam', 'inapproprie', 'contrefacon', 'arnaque', 'autre']);
            $table->text('description')->nullable();
            $table->enum('statut', ['en_attente', 'traite', 'rejete'])->default('en_attente');
            $table->timestamps();

            // Foreign keys
            $table->foreign('id_utilisateur')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('id_objet')->references('id_objet')->on('objets')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('signalements');
    }
};
