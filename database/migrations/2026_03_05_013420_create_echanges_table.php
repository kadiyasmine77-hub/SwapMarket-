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
            $table->timestamp('date_demande')->useCurrent();
            $table->timestamp('date_validation')->nullable();
            $table->enum('statut', ['en_attente', 'valide', 'refuse', 'termine'])->default('en_attente');

            $table->foreignId('id_objet1')->constrained('objets', 'id_objet')->onDelete('cascade');
            $table->foreignId('id_objet2')->constrained('objets', 'id_objet')->onDelete('cascade');
            $table->foreignId('id_demandeur')->constrained('users', 'id_user')->onDelete('cascade');
            $table->foreignId('id_destinataire')->constrained('users', 'id_user')->onDelete('cascade');

            // Index pour améliorer la rapidité des recherches (performance)
            $table->index(['id_demandeur', 'id_destinataire']);
            // Empêche la duplication du même échange
            $table->unique(['id_objet1', 'id_objet2', 'id_demandeur', 'id_destinataire']);
        
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
