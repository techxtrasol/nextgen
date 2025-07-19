<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CicInvestment extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'investment_date',
        'interest_rate',
        'current_value',
        'maturity_date',
        'status',
        'investment_reference',
        'notes',
        'recorded_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'interest_rate' => 'decimal:2',
        'current_value' => 'decimal:2',
        'investment_date' => 'date',
        'maturity_date' => 'date',
    ];

    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public function interestDistributions(): HasMany
    {
        return $this->hasMany(InterestDistribution::class);
    }

    public function calculateMonthlyInterest(): float
    {
        return ($this->current_value * $this->interest_rate) / 100;
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeMatured($query)
    {
        return $query->where('status', 'matured');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($investment) {
            $investment->current_value = $investment->amount;
            $investment->investment_reference = 'CIC-' . strtoupper(uniqid());
            // Set default interest rate to 9.75% if not provided
            if (!$investment->interest_rate) {
                $investment->interest_rate = 9.75;
            }
        });
    }
}
