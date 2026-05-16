<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'login'    => 'required|string',
            'password' => 'required|string',
        ]);

        $account = Account::findByLogin($request->login);

        if (!$account || !$account->verifyPassword($request->password)) {
            throw ValidationException::withMessages([
                'login' => ['Hibás felhasználónév vagy jelszó.'],
            ]);
        }

        if ($account->status !== 'OK') {
            throw ValidationException::withMessages([
                'login' => ['Ez a fiók le van tiltva.'],
            ]);
        }

        $token = $account->createToken('frontend', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $this->formatUser($account),
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'login'    => ['required', 'string', 'min:4', 'max:16', 'regex:/^[a-zA-Z0-9]+$/'],
            'email'    => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'regex:/\d/'],
        ]);

        if (Account::loginExists($request->login)) {
            throw ValidationException::withMessages([
                'login' => ['Ez a felhasználónév már foglalt.'],
            ]);
        }

        if (Account::emailExists($request->email)) {
            throw ValidationException::withMessages([
                'email' => ['Ez az email cím már regisztrálva van.'],
            ]);
        }

        DB::connection('account')->table('account')->insert([
            'login'       => $request->login,
            'password'    => '*' . strtoupper(sha1(sha1($request->password, true))),
            'email'       => $request->email,
            'status'      => 'OK',
            'create_time' => now()->format('Y-m-d H:i:s'),
        ]);

        $account = Account::findByLogin($request->login);
        $token   = $account->createToken('frontend', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $this->formatUser($account),
        ], 201);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var Account $account */
        $account = $request->user();
        return response()->json($this->formatUser($account));
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Kijelentkezve.']);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $account = Account::findByEmail($request->email);

        if ($account) {
            $token = Str::random(64);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                ['token' => hash('sha256', $token), 'created_at' => now()]
            );

            try {
                Log::info("Password reset token for {$request->email}: {$token}");
            } catch (\Exception $e) {
                Log::error('Password reset mail failed: ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Ha ez az email regisztrálva van, hamarosan megkapod a visszaállítási linket.',
        ]);
    }

    private function formatUser(Account $account): array
    {
        $createdAt = $account->create_time;

        return [
            'username'     => $account->login,
            'email'        => $account->email ?? '',
            'member_since' => is_string($createdAt) ? substr($createdAt, 0, 10) : '',
        ];
    }
}
