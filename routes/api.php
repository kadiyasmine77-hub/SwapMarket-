<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AvisController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\EchangeController;
use App\Http\Controllers\FavoriController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ObjetController;
use App\Http\Controllers\ObjetImageController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/categories', [CategorieController::class, 'index']);
Route::get('/categories/{id}', [CategorieController::class, 'show']);

Route::get('/objets', [ObjetController::class, 'index']);
Route::get('/objets/{id}', [ObjetController::class, 'show']);
Route::get('/objets/{id}/avis', [AvisController::class, 'index']);
Route::get('/items', [ObjetController::class, 'index']);
Route::get('/items/{id}', [ObjetController::class, 'show']);
Route::get('/items/{id}/reviews', [AvisController::class, 'index']);
Route::get('/users/{id}/reviews', [AvisController::class, 'userReviews']);
Route::get('/users/{id}/profile', [AuthController::class, 'getProfile']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/profil', [UserController::class, 'profil']);
    Route::post('/profil', [UserController::class, 'update']);
    Route::get('/profile', [UserController::class, 'profil']);
    Route::put('/profile', [UserController::class, 'update']);
    Route::patch('/profile', [UserController::class, 'update']);
    Route::post('/profil/password', [UserController::class, 'changePassword']);
    Route::get('/profil/stats', [UserController::class, 'stats']);

    Route::post('/objets/{id}/images', [ObjetController::class, 'addImages']);
    Route::post('/objets', [ObjetController::class, 'store']);
    Route::put('/objets/{id}', [ObjetController::class, 'update']);
    Route::delete('/objets/{id}', [ObjetController::class, 'destroy']);
    Route::post('/items', [ObjetController::class, 'store']);
    Route::put('/items/{id}', [ObjetController::class, 'update']);
    Route::patch('/items/{id}', [ObjetController::class, 'update']);
    Route::delete('/items/{id}', [ObjetController::class, 'destroy']);

    Route::get('/objets/{id}/images', [ObjetImageController::class, 'index']);
    Route::post('/objets/{id}/images', [ObjetImageController::class, 'store']);
    Route::delete('/objets/{id}/images/{imageId}', [ObjetImageController::class, 'destroy']);

    Route::post('/objets/{id}/avis', [AvisController::class, 'store']);
    Route::delete('/avis/{id}', [AvisController::class, 'destroy']);
    Route::post('/items/{id}/reviews', [AvisController::class, 'store']);
    Route::delete('/reviews/{id}', [AvisController::class, 'destroy']);

    Route::get('/echanges', [EchangeController::class, 'index']);
    Route::post('/echanges', [EchangeController::class, 'store']);
    Route::get('/echanges/{id}', [EchangeController::class, 'show']);
    Route::put('/echanges/{id}/statut', [EchangeController::class, 'updateStatut']);
    Route::get('/echanges/{id}/pdf', [EchangeController::class, 'generatePDF']);
    Route::get('/echanges/{id}/historique', [EchangeController::class, 'historique']);
    Route::get('/swaps', [EchangeController::class, 'index']);
    Route::post('/swaps', [EchangeController::class, 'store']);
    Route::get('/swaps/{id}', [EchangeController::class, 'show']);
    Route::put('/swaps/{id}/status', [EchangeController::class, 'updateStatut']);
    Route::patch('/swaps/{id}/status', [EchangeController::class, 'updateStatut']);
    Route::get('/swaps/{id}/history', [EchangeController::class, 'historique']);

    Route::get('/messages/unread-count', [MessageController::class, 'unreadCount']);
    Route::get('/echanges/{id}/messages', [MessageController::class, 'index']);
    Route::post('/echanges/{id}/messages', [MessageController::class, 'store']);
    Route::get('/swaps/{id}/messages', [MessageController::class, 'index']);
    Route::post('/swaps/{id}/messages', [MessageController::class, 'store']);

    // Favoris
    Route::get('/favoris', [FavoriController::class, 'index']);
    Route::post('/favoris/toggle', [FavoriController::class, 'toggle']);
    Route::get('/favoris/{id}/check', [FavoriController::class, 'check']);

    // Signalements (Utilisateurs)
    Route::post('/signalements', [App\Http\Controllers\SignalementController::class, 'store']);
});

Route::middleware(['auth:sanctum', 'checkrole:admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'stats']);

    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/echanges', [AdminController::class, 'echanges']);
    Route::put('/users/{id}/statut', [AdminController::class, 'updateStatutUser']);
    Route::put('/users/{id}/role', [AdminController::class, 'updateRoleUser']);
    Route::delete('/users/{id}', [AdminController::class, 'destroyUser']);
    Route::get('/users/{id}/stats', [AdminController::class, 'statsUser']);

    Route::get('/categories', [AdminController::class, 'categories']);
    Route::post('/categories', [CategorieController::class, 'store']);
    Route::put('/categories/{id}', [CategorieController::class, 'update']);
    Route::delete('/categories/{id}', [CategorieController::class, 'destroy']);

    // Signalements (Admins)
    Route::get('/signalements', [App\Http\Controllers\SignalementController::class, 'indexAdmin']);
    Route::put('/signalements/{id}/statut', [App\Http\Controllers\SignalementController::class, 'updateStatut']);

    Route::get('/objets', [AdminController::class, 'objets']);
    Route::delete('/objets/{id}', [AdminController::class, 'destroyObjet']);

    Route::get('/echanges', [AdminController::class, 'echanges']);
    Route::put('/echanges/{id}/statut', [AdminController::class, 'updateStatutEchange']);

    Route::get('/avis', [AdminController::class, 'avis']);
    Route::delete('/avis/{id}', [AdminController::class, 'destroyAvis']);

    Route::get('/logs', [App\Http\Controllers\LogController::class, 'index']);

    Route::get('/export/pdf', [AdminController::class, 'exportPdf']);
    Route::get('/export/xml', [AdminController::class, 'exportXml']);
    Route::post('/import/xml', [AdminController::class, 'importXml']);
});
