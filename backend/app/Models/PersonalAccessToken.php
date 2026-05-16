<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumToken;

/**
 * Explicit mysql (web) connection so tokens are stored in the web database,
 * not in the account (game) database, even when the tokenable model (Account)
 * uses a different connection.
 */
class PersonalAccessToken extends SanctumToken
{
    protected $connection = 'mysql';
}
