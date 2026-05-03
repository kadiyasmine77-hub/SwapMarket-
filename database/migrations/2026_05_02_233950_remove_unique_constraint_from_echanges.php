<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('echanges', function (Blueprint $table) {
            // Créer d'abord des index simples pour les clés étrangères
            // car MySQL utilise l'index unique pour satisfaire les FK si c'est le seul
            $table->index('id_objet1');
            $table->index('id_demandeur');
            
            // Maintenant on peut supprimer l'index unique
            $table->dropUnique('echanges_id_objet1_id_objet2_id_demandeur_id_destinataire_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('echanges', function (Blueprint $table) {
            $table->unique(['id_objet1', 'id_objet2', 'id_demandeur', 'id_destinataire']);
        });
    }
};
