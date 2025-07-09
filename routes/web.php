<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\EventController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/profil', [PublicController::class, 'about'])->name('about');
Route::get('/layanan', [PublicController::class, 'services'])->name('services');
Route::get('/event', [PublicController::class, 'events'])->name('public.events');
Route::get('/event/{id}', [PublicController::class, 'eventShow'])->name('public.events.show');
Route::get('/hubungi-kami', [PublicController::class, 'contact'])->name('contact');
Route::get('/artikel', [PublicController::class, 'articles'])->name('public.articles');
Route::get('/artikel/{id}', [PublicController::class, 'articleShow'])->name('public.articles.show');

// RFC2350 page - static content for now
Route::get('/rfc2350', function () {
    return Inertia::render('Public/RFC2350');
})->name('rfc2350');

// Dashboard and Admin Routes
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Admin routes for CRUD
    Route::resource('articles', ArticleController::class);
    Route::resource('events', EventController::class);
});

require __DIR__.'/auth.php';
