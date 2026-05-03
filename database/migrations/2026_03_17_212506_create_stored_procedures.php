<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::unprepared('
            DROP PROCEDURE IF EXISTS GetUserStats;

            CREATE PROCEDURE GetUserStats(IN user_id INT)
            BEGIN
                SELECT
                    u.id_user,
                    u.nom_complet,
                    u.email,
                    COUNT(DISTINCT o.id_objet) AS total_objets,
                    COUNT(DISTINCT e.id_echange) AS total_echanges,
                    COALESCE(ROUND(AVG(a.note), 1), 0) AS note_moyenne
                FROM users u
                LEFT JOIN objets o ON o.id_user = u.id_user
                LEFT JOIN echanges e ON (e.id_demandeur = u.id_user OR e.id_destinataire = u.id_user)
                LEFT JOIN avis a ON a.id_user = u.id_user
                WHERE u.id_user = user_id
                GROUP BY u.id_user, u.nom, u.prenom, u.email;
            END
        ');
    }

    public function down()
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS GetUserStats');
    }
};
