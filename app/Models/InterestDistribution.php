<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InterestDistribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'cic_investment_id',
        'user_id',
        'distribution_date',
        'interest_rate',
        'interest_amount',
        'management_fee',
        'withholding_tax',
        'net_amount',
        'distributed_by',
        'notes',
        'status',
    ];

    protected $casts = [
        'distribution_date' => 'datetime',
        'interest_rate' => 'decimal:4',
        'interest_amount' => 'decimal:2',
        'management_fee' => 'decimal:2',
        'withholding_tax' => 'decimal:2',
        'net_amount' => 'decimal:2',
    ];

    public function cicInvestment(): BelongsTo
    {
        return $this->belongsTo(CicInvestment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function distributedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'distributed_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeDistributed($query)
    {
        return $query->where('status', 'distributed');
    }

    public function scopeForMonth($query, $year, $month)
    {
        return $query->whereYear('distribution_date', $year)
                    ->whereMonth('distribution_date', $month);
    }

    public function calculateNetAmount()
    {
        $managementFee = $this->interest_amount * 0.02; // 2% management fee
        $withholdingTax = ($this->interest_amount - $managementFee) * 0.15; // 15% withholding tax
        $netAmount = $this->interest_amount - $managementFee - $withholdingTax;

        $this->update([
            'management_fee' => $managementFee,
            'withholding_tax' => $withholdingTax,
            'net_amount' => $netAmount,
        ]);

        return $netAmount;
    }
}
