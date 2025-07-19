<?php

namespace App\Providers;

use App\Models\Loan;
use App\Models\MemberContribution;
use App\Models\User;
use App\Policies\LoanPolicy;
use App\Policies\MemberContributionPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        User::class => UserPolicy::class,
        MemberContribution::class => MemberContributionPolicy::class,
        Loan::class => LoanPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
