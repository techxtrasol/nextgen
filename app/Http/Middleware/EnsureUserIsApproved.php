<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsApproved
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();

            // Allow admins to access everything
            if ($user->isAdmin()) {
                return $next($request);
            }

            // Check if user is fully approved
            if (!$user->isFullyApproved()) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Your account is pending approval. Please wait for admin approval.',
                        'approval_status' => $user->approval_status,
                        'email_verified' => $user->email_verified,
                        'admin_approved' => $user->admin_approved,
                    ], 403);
                }

                // Redirect to appropriate page based on approval status
                if (!$user->email_verified) {
                    return redirect()->route('verification.notice');
                }

                if ($user->isPendingApproval()) {
                    return redirect()->route('approval.pending');
                }

                if ($user->isRejected()) {
                    return redirect()->route('approval.rejected');
                }
            }
        }

        return $next($request);
    }
}
