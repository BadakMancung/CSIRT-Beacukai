<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\NotificationController;
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

// SEO Routes
Route::get('/sitemap.xml', [PublicController::class, 'sitemap'])->name('sitemap');
Route::get('/robots.txt', [PublicController::class, 'robots'])->name('robots');

// Contact Form Route
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Secure File Access Routes (Public with token-based access)
Route::get('/secure-file/{token}', [ContactController::class, 'accessViaTemporaryToken'])->name('secure-file.temp');

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
    
    // API Key Rotation Management Routes
    Route::prefix('admin/api-keys')->name('admin.api-keys.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\ApiKeyRotationController::class, 'index'])->name('index');
        Route::post('/rotate', [App\Http\Controllers\Admin\ApiKeyRotationController::class, 'rotate'])->name('rotate');
        Route::post('/emergency-rotate', [App\Http\Controllers\Admin\ApiKeyRotationController::class, 'emergencyRotate'])->name('emergency-rotate');
        Route::post('/schedule', [App\Http\Controllers\Admin\ApiKeyRotationController::class, 'schedule'])->name('schedule');
        Route::post('/validate', [App\Http\Controllers\Admin\ApiKeyRotationController::class, 'validate'])->name('validate');
        Route::get('/history/{service?}', [App\Http\Controllers\Admin\ApiKeyRotationController::class, 'history'])->name('history');
    });
    Route::resource('notifications', NotificationController::class)->except(['show']);
    
    // Additional notification routes
    Route::post('/notifications/test-email', [NotificationController::class, 'testEmail'])->name('notifications.test');
});

require __DIR__.'/auth.php';
