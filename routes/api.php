<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\TeamController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\GameController;

Route::apiResource('teams', TeamController::class);
Route::apiResource('players', PlayerController::class);
Route::apiResource('games', GameController::class);
