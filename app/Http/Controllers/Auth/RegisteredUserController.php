<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Check if this is the first user (make them admin and auto-approve)
        $isFirstUser = User::count() === 0;

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $isFirstUser ? 'admin' : 'member',
            'joined_at' => now(),
            'is_active' => $isFirstUser, // Only first user is active by default
            'email_verified' => $isFirstUser, // Only first user is email verified by default
            'admin_approved' => $isFirstUser, // Only first user is admin approved by default
            'approval_status' => $isFirstUser ? 'approved' : 'pending',
        ]);

        event(new Registered($user));

        // Only auto-login the first user (admin)
        if ($isFirstUser) {
            Auth::login($user);
            return redirect()->intended(route('dashboard', absolute: false));
        }

        // For other users, redirect to email verification notice
        return redirect()->route('verification.notice')
            ->with('status', 'Registration successful! Please check your email to verify your account, then wait for admin approval.');
    }
}
