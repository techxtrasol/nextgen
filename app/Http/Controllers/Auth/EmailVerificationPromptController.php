<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            // Check if user is fully approved
            if ($request->user()->isFullyApproved()) {
                return redirect()->intended(route('dashboard', absolute: false));
            } else {
                return redirect()->route('approval.pending');
            }
        }

        return Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
