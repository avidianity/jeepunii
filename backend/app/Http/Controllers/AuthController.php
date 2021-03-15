<?php

namespace App\Http\Controllers;

use App\Models\Cooperative;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['password', 'string', 'max:255'],
        ]);

        $user = User::whereEmail($data['email'])->first();

        if (!$user) {
            return response(['message' => 'Email does not exist.'], 404);
        }

        if (!$user->approved) {
            return response(['message' => 'Your account is not approved yet.'], 403);
        }

        if (!Hash::check($data['password'], $user->password)) {
            return response(['message' => 'Password is incorrect.'], 401);
        }

        $token = $user->createToken(Str::random());

        return [
            'user' => $user,
            'token' => $token->plainTextToken,
        ];
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'password' => ['password', 'string', 'min:6', 'max:30'],
            'role' => ['required', 'string', Rule::in([User::COOPERATIVE_OWNER, User::DRIVER])],
            'cooperative_id' => ['required', 'numeric', Rule::exists(Cooperative::class, 'id')],
        ]);

        $user = User::make($data);

        $user->role = $data['role'];

        $user->save();

        return $user;
    }
}
