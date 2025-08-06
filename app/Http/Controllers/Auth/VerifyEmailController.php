<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            // Check if user is fully approved
            if ($request->user()->isFullyApproved()) {
                return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
            } else {
                return redirect()->route('approval.pending');
            }
        }

        if ($request->user()->markEmailAsVerified()) {
            /** @var \Illuminate\Contracts\Auth\MustVerifyEmail $user */
            $user = $request->user();

            // Update the email_verified field in our custom table
            $user->update(['email_verified' => true]);

            event(new Verified($user));
        }

        // After email verification, check if user is fully approved
        if ($request->user()->isFullyApproved()) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        } else {
            return redirect()->route('approval.pending')
                ->with('status', 'Email verified successfully! Please wait for admin approval.');
        }
    }
}
