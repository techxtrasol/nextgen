<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoanPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'loan_id',
        'amount',
        'payment_date',
        'payment_method',
        'reference_number',
        'notes',
        'recorded_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
    ];

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class);
    }

    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    protected static function boot()
    {
        parent::boot();

        static::created(function ($payment) {
            $loan = $payment->loan;
            $loan->amount_paid += $payment->amount;
            $loan->balance = $loan->total_amount - $loan->amount_paid;
            
            if ($loan->balance <= 0) {
                $loan->status = 'completed';
                $loan->completion_date = $payment->payment_date;
            }
            
            $loan->save();
        });
    }
}