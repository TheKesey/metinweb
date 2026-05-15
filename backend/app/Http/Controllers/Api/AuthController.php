<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login with Metin2 account credentials.
     * Returns a Sanctum token on success.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'login'    => 'required|string',
            'password' => 'required|string',
        ]);

        $user = Auth::guard('sanctum')->getProvider()->retrieveByCredentials([
            'login'    => $request->login,
            'password' => $request->password,
        ]);

        if (! $user || ! Auth::guard('sanctum')->getProvider()->validateCredentials($user, $request->only('password'))) {
            throw ValidationException::withMessages([
                'login' => ['Hibás felhasználónév vagy jelszó.'],
            ]);
        }

        $token = $user->createToken('frontend', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'       => $user->getAuthIdentifier(),
                'username' => $user->attributes['login'],
                'email'    => $user->attributes['email'] ?? '',
            ],
        ]);
    }

    /**
     * Return the authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        return response()->json([
            'id'       => $user->getAuthIdentifier(),
            'username' => $user->attributes['login'],
            'email'    => $user->attributes['email'] ?? '',
        ]);
    }

    /**
     * Revoke the current token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Kijelentkezve.']);
    }
}
