<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Serve storage files directly to bypass Windows symlink issues
Route::get('/storage/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);
    if (file_exists($fullPath)) {
        $mimeType = mime_content_type($fullPath);
        return response()->file($fullPath, ['Content-Type' => $mimeType]);
    }
    abort(404);
})->where('path', '.*');
