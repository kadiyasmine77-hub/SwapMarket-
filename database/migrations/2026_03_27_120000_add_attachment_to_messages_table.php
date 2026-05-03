<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->string('piece_jointe')->nullable()->after('contenu');
            $table->string('nom_piece_jointe')->nullable()->after('piece_jointe');
        });
    }

    public function down()
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn(['piece_jointe', 'nom_piece_jointe']);
        });
    }
};
