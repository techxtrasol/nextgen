<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ApprovalController extends Controller
{
    /**
     * Show the pending approval page.
     */
    public function pending(): Response
    {
        $user = Auth::user();

        return Inertia::render('auth/pending-approval', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'email_verified' => $user->email_verified,
                'admin_approved' => $user->admin_approved,
                'approval_status' => $user->approval_status,
                'joined_at' => $user->joined_at,
            ]
        ]);
    }

    /**
     * Show the rejected approval page.
     */
    public function rejected(): Response
    {
        $user = Auth::user();

        return Inertia::render('auth/rejected-approval', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'approval_notes' => $user->approval_notes,
                'approval_status' => $user->approval_status,
                'joined_at' => $user->joined_at,
            ]
        ]);
    }

    /**
     * Resubmit for approval.
     */
    public function resubmit(Request $request)
    {
        $user = Auth::user();

        $user->update([
            'approval_status' => 'pending',
            'approval_notes' => null,
        ]);

        return redirect()->route('approval.pending')
            ->with('status', 'Your application has been resubmitted for approval.');
    }
}
