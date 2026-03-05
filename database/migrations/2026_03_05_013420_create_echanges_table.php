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
        Schema::create('echanges', function (Blueprint $table) {
            $table->id('id_echange');
            $table->date('date_demande');
            $table->date('date_validation')->nullable();
            $table->enum('statut', ['en_attente', 'valide', 'refuse', 'termine'])->default('en_attente');
            $table->foreignId('id_objet1')->constrained('objets', 'id_objet');
            $table->foreignId('id_objet2')->constrained('objets', 'id_objet');
            $table->foreignId('id_demandeur')->constrained('users', 'id_user');
            $table->foreignId('id_destinataire')->constrained('users', 'id_user');
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
        Schema::dropIfExists('echanges');
    }
};
