<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'principal_amount',
        'duration_weeks',
        'interest_rate',
        'total_amount',
        'amount_paid',
        'balance',
        'status',
        'application_date',
        'approval_date',
        'due_date',
        'completion_date',
        'purpose',
        'approved_by',
        'penalty_days',
        'penalty_amount',
        'notes',
    ];

    protected $casts = [
        'principal_amount' => 'decimal:2',
        'interest_rate' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'balance' => 'decimal:2',
        'penalty_amount' => 'decimal:2',
        'application_date' => 'date',
        'approval_date' => 'date',
        'due_date' => 'date',
        'completion_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(LoanPayment::class);
    }

    public function calculateInterestRate(): float
    {
        return match ($this->duration_weeks) {
            1 => 5.0,
            2 => 10.0,
            3 => 15.0,
            4 => 20.0,
            default => 20.0,
        };
    }

    public function calculateTotalAmount(): float
    {
        $interest = ($this->principal_amount * $this->interest_rate) / 100;
        return $this->principal_amount + $interest;
    }

    public function calculatePenalty(): float
    {
        if ($this->status !== 'defaulted' || !$this->due_date) {
            return 0;
        }

        $daysOverdue = Carbon::now()->diffInDays($this->due_date, false);
        if ($daysOverdue <= 0) {
            return 0;
        }

        // 1% penalty per day overdue
        return ($this->balance * 0.01) * $daysOverdue;
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeDefaulted($query)
    {
        return $query->where('status', 'defaulted');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function isOverdue(): bool
    {
        return $this->due_date && Carbon::now()->gt($this->due_date) && $this->status === 'active';
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($loan) {
            $loan->interest_rate = $loan->calculateInterestRate();
            $loan->total_amount = $loan->calculateTotalAmount();
            $loan->balance = $loan->total_amount;
        });
    }
}