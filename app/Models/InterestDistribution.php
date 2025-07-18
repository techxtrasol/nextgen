<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InterestDistribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cic_investment_id',
        'total_interest',
        'member_share',
        'share_percentage',
        'distribution_date',
        'distribution_month',
        'status',
        'notes',
        'processed_by',
    ];

    protected $casts = [
        'total_interest' => 'decimal:2',
        'member_share' => 'decimal:2',
        'share_percentage' => 'decimal:2',
        'distribution_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cicInvestment(): BelongsTo
    {
        return $this->belongsTo(CicInvestment::class);
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeDistributed($query)
    {
        return $query->where('status', 'distributed');
    }

    public function scopeForMonth($query, $month)
    {
        return $query->where('distribution_month', $month);
    }

    public static function distributeMonthlyInterest($cicInvestmentId, $month)
    {
        $cicInvestment = CicInvestment::findOrFail($cicInvestmentId);
        $totalInterest = $cicInvestment->calculateMonthlyInterest();
        
        // Get all active members
        $activeMembers = User::where('is_active', true)->get();
        $memberCount = $activeMembers->count();
        
        if ($memberCount === 0) {
            return false;
        }
        
        $sharePerMember = $totalInterest / $memberCount;
        $sharePercentage = 100 / $memberCount;
        
        foreach ($activeMembers as $member) {
            static::create([
                'user_id' => $member->id,
                'cic_investment_id' => $cicInvestmentId,
                'total_interest' => $totalInterest,
                'member_share' => $sharePerMember,
                'share_percentage' => $sharePercentage,
                'distribution_date' => now(),
                'distribution_month' => $month,
                'status' => 'pending',
            ]);
        }
        
        return true;
    }
}