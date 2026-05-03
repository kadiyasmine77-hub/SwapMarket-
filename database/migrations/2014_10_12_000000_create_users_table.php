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
        Schema::create('users', function (Blueprint $table) {
            $table->id('id_user');
            $table->string('nom_complet', 200);
            $table->string('email')->unique();
            $table->string('mot_de_passe');
            $table->string('telephone', 20)->nullable();
            $table->string('photo_profil')->nullable();
            $table->string('ville', 100);
            $table->date('date_naissance')->nullable();
            $table->boolean('is_verifie')->default(false);
            $table->enum('role', ['admin', 'user'])->default('user');
            $table->enum('statut_compte', ['actif', 'suspendu', 'desactive'])->default('actif');
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
};
