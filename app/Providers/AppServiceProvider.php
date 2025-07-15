<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use App\Http\Controllers\Auth\Static\StaticAuthGuard;
use App\Http\Controllers\Auth\Static\StaticUserProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        // Register custom static authentication (no database required)
        Auth::provider('static', function ($app, array $config) {
            return new StaticUserProvider();
        });

        Auth::extend('static', function ($app, $name, array $config) {
            $provider = Auth::createUserProvider($config['provider']);
            return new StaticAuthGuard($provider);
        });
    }
}
