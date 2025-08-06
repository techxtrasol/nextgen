<?php

use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\WelfareController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\ContributionController;
use App\Http\Controllers\CicInvestmentController;
use App\Http\Controllers\MilestoneController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Home route
Route::get('/home', function () {
    return Inertia::render('Home');
})->name('home');

// Approval routes (accessible to unapproved users)
Route::middleware(['auth'])->group(function () {
    Route::get('/approval/pending', [App\Http\Controllers\ApprovalController::class, 'pending'])->name('approval.pending');
    Route::get('/approval/rejected', [App\Http\Controllers\ApprovalController::class, 'rejected'])->name('approval.rejected');
    Route::post('/approval/resubmit', [App\Http\Controllers\ApprovalController::class, 'resubmit'])->name('approval.resubmit');
});

// Authenticated and approved routes
Route::middleware(['auth', 'verified', 'approved'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [WelfareController::class, 'dashboard'])->name('dashboard');

    // Settings routes
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('/password', [PasswordController::class, 'edit'])->name('password.edit');
        Route::put('/password', [PasswordController::class, 'update'])->name('password.update');

        Route::get('/appearance', function () {
            return Inertia::render('settings/appearance');
        })->name('appearance');
    });

    // Member Contributions routes
    Route::prefix('contributions')->name('contributions.')->group(function () {
        Route::get('/', [ContributionController::class, 'index'])->name('index');
        Route::get('/create', [ContributionController::class, 'create'])->name('create');
        Route::post('/', [ContributionController::class, 'store'])->name('store');
        Route::get('/{contribution}', [ContributionController::class, 'show'])->name('show');

        // Admin/Treasurer only routes
        Route::middleware('role:admin,treasurer')->group(function () {
            Route::patch('/{contribution}/approve', [ContributionController::class, 'approve'])->name('approve');
            Route::patch('/{contribution}/reject', [ContributionController::class, 'reject'])->name('reject');
        });
    });

    // Loan routes
    Route::prefix('loans')->name('loans.')->group(function () {
        Route::get('/', [LoanController::class, 'index'])->name('index');
        Route::get('/apply', [LoanController::class, 'apply'])->name('apply');
        Route::get('/create', [LoanController::class, 'create'])->name('create');
        Route::post('/', [LoanController::class, 'store'])->name('store');
        Route::get('/{loan}', [LoanController::class, 'show'])->name('show');

        // Admin/Treasurer only routes
        Route::middleware('role:admin,treasurer')->group(function () {
            Route::patch('/{loan}/approve', [LoanController::class, 'approve'])->name('approve');
            Route::patch('/{loan}/reject', [LoanController::class, 'reject'])->name('reject');
            Route::post('/{loan}/payments', [LoanController::class, 'recordPayment'])->name('record-payment');
        });
    });

    // CIC Investment routes (Admin/Treasurer only)
    Route::prefix('cic-investments')->name('cic-investments.')->middleware('role:admin,treasurer')->group(function () {
        Route::get('/', [CicInvestmentController::class, 'index'])->name('index');
        Route::get('/create', [CicInvestmentController::class, 'create'])->name('create');
        Route::post('/', [CicInvestmentController::class, 'store'])->name('store');
        Route::get('/{cicInvestment}', [CicInvestmentController::class, 'show'])->name('show');
        Route::patch('/{cicInvestment}/update-value', [CicInvestmentController::class, 'updateValue'])->name('update-value');
        Route::post('/{cicInvestment}/distribute-interest', [CicInvestmentController::class, 'distributeInterest'])->name('distribute-interest');
    });

    // Milestone routes
    Route::prefix('milestones')->name('milestones.')->group(function () {
        Route::get('/', [MilestoneController::class, 'index'])->name('index');
        Route::get('/{milestone}', [MilestoneController::class, 'show'])->name('show');

        // Admin/Treasurer only routes
        Route::middleware('role:admin,treasurer')->group(function () {
            Route::get('/create', [MilestoneController::class, 'create'])->name('create');
            Route::post('/', [MilestoneController::class, 'store'])->name('store');
            Route::get('/{milestone}/edit', [MilestoneController::class, 'edit'])->name('edit');
            Route::patch('/{milestone}', [MilestoneController::class, 'update'])->name('update');
            Route::patch('/{milestone}/progress', [MilestoneController::class, 'updateProgress'])->name('update-progress');
            Route::delete('/{milestone}', [MilestoneController::class, 'destroy'])->name('destroy');
        });
    });

    // User reports route (for members to see their own data)
    Route::get('/my-contributions', [WelfareController::class, 'myContributions'])->name('my-contributions');

    // Reports routes (Admin/Treasurer only)
    Route::prefix('reports')->name('reports.')->middleware('role:admin,treasurer')->group(function () {
        Route::get('/', [WelfareController::class, 'reportsIndex'])->name('index');
        Route::get('/members', [WelfareController::class, 'membersReport'])->name('members');
        Route::get('/financial-summary', [WelfareController::class, 'financialSummary'])->name('financial-summary');
        Route::get('/investments', [WelfareController::class, 'investmentsReport'])->name('investments');
        Route::get('/cic-interest', [WelfareController::class, 'calculateCicInterest'])->name('cic-interest');
    });
});

require __DIR__ . '/auth.php';
