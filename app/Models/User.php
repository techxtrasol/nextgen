<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'joined_at',
        'total_contributions',
        'available_loan_limit',
        'is_active',
        'phone_number',
        'address',
        'id_number',
        'date_of_birth',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'joined_at' => 'datetime',
            'total_contributions' => 'decimal:2',
            'available_loan_limit' => 'decimal:2',
            'is_active' => 'boolean',
            'date_of_birth' => 'date',
        ];
    }

    // Relationships
    public function contributions(): HasMany
    {
        return $this->hasMany(MemberContribution::class);
    }

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }

    public function loanPayments(): HasMany
    {
        return $this->hasMany(LoanPayment::class, 'recorded_by');
    }

    public function interestDistributions(): HasMany
    {
        return $this->hasMany(InterestDistribution::class);
    }

    public function createdMilestones(): HasMany
    {
        return $this->hasMany(Milestone::class, 'created_by');
    }

    public function cicInvestments(): HasMany
    {
        return $this->hasMany(CicInvestment::class, 'recorded_by');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeMembers($query)
    {
        return $query->where('role', 'member');
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    // Helper methods
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isTreasurer(): bool
    {
        return $this->role === 'treasurer';
    }

    public function calculateLoanLimit(): float
    {
        // Users can borrow up to their total contributions
        // This means if they've saved 3000, they can borrow up to 3000
        return $this->total_contributions;
    }

    public function getLoanEligibilityInfo(): array
    {
        $totalContributions = $this->total_contributions;
        $activeLoans = $this->loans()->active()->sum('balance');
        $availableLimit = $totalContributions - $activeLoans;

        return [
            'total_contributions' => $totalContributions,
            'active_loans' => $activeLoans,
            'available_limit' => max(0, $availableLimit),
            'can_apply' => $totalContributions >= 1000, // Minimum 1000 to qualify
        ];
    }

    public function updateContributions(): void
    {
        $totalContributions = $this->contributions()
            ->where('status', 'approved')
            ->where('type', 'deposit')
            ->sum('amount');

        $this->update([
            'total_contributions' => $totalContributions,
            'available_loan_limit' => $totalContributions,
        ]);
    }
}
