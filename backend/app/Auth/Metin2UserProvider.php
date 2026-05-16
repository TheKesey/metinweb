<?php

namespace App\Auth;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Custom user provider that authenticates against the Metin2 account table.
 *
 * The Metin2 account table uses MD5 password hashing by default.
 * Adjust METIN2_PASSWORD_HASH in .env to 'bcrypt' or 'sha1' if your server uses those.
 */
class Metin2UserProvider implements UserProvider
{
    public function __construct(
        private readonly string $connection,
        private readonly string $table,
        private readonly string $hashAlgo,
    ) {}

    public function retrieveById($identifier): ?Authenticatable
    {
        $record = DB::connection($this->connection)
            ->table($this->table)
            ->where('id', $identifier)
            ->first();

        return $record ? $this->makeUser((array) $record) : null;
    }

    public function retrieveByToken($identifier, $token): ?Authenticatable
    {
        return null;
    }

    public function updateRememberToken(Authenticatable $user, $token): void {}

    public function retrieveByCredentials(array $credentials): ?Authenticatable
    {
        $record = DB::connection($this->connection)
            ->table($this->table)
            ->where('login', $credentials['login'])
            ->first();

        return $record ? $this->makeUser((array) $record) : null;
    }

    public function validateCredentials(Authenticatable $user, array $credentials): bool
    {
        $plain = $credentials['password'];
        $stored = $user->getAuthPassword();

        return match ($this->hashAlgo) {
            'bcrypt'          => password_verify($plain, $stored),
            'sha1'            => sha1($plain) === strtolower($stored),
            'mysql_password'  => ('*' . strtoupper(sha1(sha1($plain, true)))) === $stored,
            default           => md5($plain) === strtolower($stored),
        };
    }

    public function rehashPasswordIfRequired(Authenticatable $user, array $credentials, bool $force = false): void {}

    private function makeUser(array $attributes): Metin2User
    {
        return new Metin2User($attributes);
    }
}
