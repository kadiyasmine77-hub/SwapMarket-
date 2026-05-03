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
        Schema::create('messages', function (Blueprint $table) {
            $table->id('id_message');
            $table->text('contenu');
            $table->boolean('lu')->default(false);
            $table->foreignId('id_expediteur')->constrained('users', 'id_user')->onDelete('cascade');
            $table->foreignId('id_destinataire')->constrained('users', 'id_user')->onDelete('cascade');
            $table->foreignId('id_echange')->constrained('echanges', 'id_echange')->onDelete('cascade');

            // Index pour améliorer les performances
            $table->index(['id_expediteur', 'id_destinataire']);
            $table->index('id_echange');
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
        Schema::dropIfExists('messages');
    }
};
