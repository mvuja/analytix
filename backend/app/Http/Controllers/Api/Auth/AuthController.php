<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Create a dashboard user and immediately attach the Sanctum session.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::query()->create($request->validated());

        // Register behaves like login so the frontend can go straight to Overview
        Auth::login($user);

        return response()->json([
            'user' => UserResource::make($user),
        ], 201);
    }

    /**
     * Authenticate an existing user through Laravel's session guard.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        if (! Auth::attempt($request->validated())) {
            return response()->json([
                'message' => 'The provided credentials are invalid.',
            ], 422);
        }

        // Regenerate the session after login to keep Sanctum cookie auth clean
        $request->session()->regenerate();

        return response()->json([
            'user' => UserResource::make($request->user()),
        ]);
    }

    /**
     * Return the current user for frontend auth bootstrapping.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => UserResource::make($request->user()),
        ]);
    }

    /**
     * End the browser session and rotate the CSRF token.
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out.']);
    }
}
