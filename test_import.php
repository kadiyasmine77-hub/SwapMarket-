<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$xml = '<?xml version="1.0"?><users><user><nom_complet>Test User</nom_complet><email>test_import_unique@test.com</email><role>user</role><statut_compte>actif</statut_compte><ville>TestVille</ville></user></users>';
$req = request();
file_put_contents('test.xml', $xml);
$file = new \Illuminate\Http\UploadedFile('test.xml', 'test.xml', 'text/xml', null, true);
$req->files->set('fichier_xml', $file);
echo (new App\Http\Controllers\AdminController())->importXml($req)->getContent();
