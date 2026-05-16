<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Language extends Model
{
    protected $fillable = ['code', 'name', 'flag', 'is_default', 'is_active', 'sort_order'];

    protected $casts = [
        'is_default' => 'boolean',
        'is_active'  => 'boolean',
    ];

    public static function active(): Collection
    {
        return Cache::remember('languages.active', 60, fn () =>
            self::where('is_active', true)->orderBy('sort_order')->get()
        );
    }

    public static function clearCache(): void
    {
        Cache::forget('languages.active');
    }

    protected static function booted(): void
    {
        static::saved(fn () => self::clearCache());
        static::deleted(fn () => self::clearCache());
    }
}
