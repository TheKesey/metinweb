<?php

namespace App\Providers;

use App\Auth\Metin2UserProvider;
use App\Models\News;
use App\Models\PersonalAccessToken;
use App\Observers\NewsObserver;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // Sanctum tokens tárolása a web (mysql) adatbázisban,
        // akkor is ha a tokenable model (Account) más connection-t használ
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
        News::observe(NewsObserver::class);

        // Metin2 session-alapú auth provider (Filament admin fallback)
        Auth::provider('metin2', function ($app, array $config) {
            return new Metin2UserProvider(
                connection: $config['connection'] ?? 'account',
                table: $config['table'] ?? 'account',
                hashAlgo: $config['hash'] ?? 'mysql_password',
            );
        });
    }
}
