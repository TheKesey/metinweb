<?php

namespace App\Providers;

use App\Auth\Metin2UserProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Auth::provider('metin2', function ($app, array $config) {
            return new Metin2UserProvider(
                connection: $config['connection'] ?? 'metin2',
                table: $config['table'] ?? 'account',
                hashAlgo: $config['hash'] ?? 'md5',
            );
        });
    }
}
