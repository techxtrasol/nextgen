<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Milestone extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'target_amount',
        'current_amount',
        'target_date',
        'achieved_date',
        'status',
        'priority',
        'created_by',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'target_date' => 'date',
        'achieved_date' => 'date',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getProgressPercentageAttribute(): float
    {
        if ($this->target_amount <= 0) {
            return 0;
        }
        
        return min(100, ($this->current_amount / $this->target_amount) * 100);
    }

    public function getRemainingAmountAttribute(): float
    {
        return max(0, $this->target_amount - $this->current_amount);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeAchieved($query)
    {
        return $query->where('status', 'achieved');
    }

    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'high');
    }

    public function checkIfAchieved(): bool
    {
        if ($this->current_amount >= $this->target_amount && $this->status !== 'achieved') {
            $this->update([
                'status' => 'achieved',
                'achieved_date' => now(),
            ]);
            return true;
        }
        
        return false;
    }

    public function addProgress(float $amount): void
    {
        $this->increment('current_amount', $amount);
        $this->checkIfAchieved();
    }
}