<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // En MySQL, pour modifier un ENUM, on utilise ALTER TABLE
        DB::statement("ALTER TABLE echanges MODIFY COLUMN statut ENUM('en_attente', 'valide', 'refuse', 'termine', 'annule') DEFAULT 'en_attente'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE echanges MODIFY COLUMN statut ENUM('en_attente', 'valide', 'refuse', 'termine') DEFAULT 'en_attente'");
    }
};
