<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // جدول الـ historique
        Schema::create('historique_echanges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_echange')->constrained('echanges', 'id_echange')->onDelete('cascade');
            $table->string('ancien_statut')->nullable();
            $table->string('nouveau_statut');
            $table->timestamp('changed_at')->useCurrent();
        });

        // الـ Trigger
        DB::unprepared('
            CREATE TRIGGER after_echange_statut_update
            AFTER UPDATE ON echanges
            FOR EACH ROW
            BEGIN
                IF OLD.statut != NEW.statut THEN
                    INSERT INTO historique_echanges
                        (id_echange, ancien_statut, nouveau_statut, changed_at)
                    VALUES
                        (NEW.id_echange, OLD.statut, NEW.statut, NOW());
                END IF;
            END
        ');
    }

    public function down()
    {
        DB::unprepared('DROP TRIGGER IF EXISTS after_echange_statut_update');
        Schema::dropIfExists('historique_echanges');
    }
};