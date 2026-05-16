<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Account extends Model
{
    use HasApiTokens;

    protected $connection = 'account';
    protected $table = 'account';
    public $timestamps = false;

    protected $fillable = [
        'login', 'password', 'email', 'status', 'create_time',
    ];

    protected $hidden = ['password'];

    public function verifyPassword(string $plain): bool
    {
        return md5($plain) === $this->password;
    }

    public static function findByLogin(string $login): ?self
    {
        return self::where('login', $login)->first();
    }

    public static function findByEmail(string $email): ?self
    {
        return self::where('email', $email)->first();
    }

    public static function loginExists(string $login): bool
    {
        return self::where('login', $login)->exists();
    }

    public static function emailExists(string $email): bool
    {
        return self::where('email', $email)->exists();
    }
}
