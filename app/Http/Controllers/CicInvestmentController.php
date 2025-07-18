<?php

namespace App\Http\Controllers;

use App\Models\CicInvestment;
use App\Models\InterestDistribution;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CicInvestmentController extends Controller
{
    public function index()
    {
        $investments = CicInvestment::with('recordedBy')
            ->latest()
            ->paginate(20);
            
        $totalInvested = CicInvestment::active()->sum('amount');
        $totalCurrentValue = CicInvestment::active()->sum('current_value');
        $totalInterestEarned = $totalCurrentValue - $totalInvested;
        
        return view('cic-investments.index', compact('investments', 'totalInvested', 'totalCurrentValue', 'totalInterestEarned'));
    }
    
    public function create()
    {
        $this->authorize('create', CicInvestment::class);
        
        return view('cic-investments.create');
    }
    
    public function store(Request $request)
    {
        $this->authorize('create', CicInvestment::class);
        
        $request->validate([
            'amount' => 'required|numeric|min:10000',
            'investment_date' => 'required|date',
            'interest_rate' => 'required|numeric|min:0|max:50',
            'maturity_date' => 'nullable|date|after:investment_date',
            'notes' => 'nullable|string',
        ]);
        
        $referenceNumber = 'CIC-' . strtoupper(uniqid());
        
        $investment = CicInvestment::create([
            'amount' => $request->amount,
            'investment_date' => $request->investment_date,
            'interest_rate' => $request->interest_rate ?? 9.75,
            'current_value' => $request->amount,
            'maturity_date' => $request->maturity_date,
            'investment_reference' => $referenceNumber,
            'notes' => $request->notes,
            'recorded_by' => Auth::id(),
        ]);
        
        return redirect()->route('cic-investments.index')
            ->with('success', 'CIC Investment recorded successfully. Reference: ' . $referenceNumber);
    }
    
    public function show(CicInvestment $cicInvestment)
    {
        $cicInvestment->load(['recordedBy', 'interestDistributions.user']);
        
        return view('cic-investments.show', compact('cicInvestment'));
    }
    
    public function distributeInterest(CicInvestment $cicInvestment, Request $request)
    {
        $this->authorize('update', $cicInvestment);
        
        $request->validate([
            'interest_amount' => 'required|numeric|min:0',
            'distribution_date' => 'required|date',
        ]);
        
        DB::transaction(function () use ($cicInvestment, $request) {
            $totalInterest = $request->interest_amount;
            $activeMembers = User::active()->get();
            $memberCount = $activeMembers->count();
            
            if ($memberCount === 0) {
                throw new \Exception('No active members found for interest distribution.');
            }
            
            $interestPerMember = $totalInterest / $memberCount;
            $sharePercentage = 100 / $memberCount;
            
            foreach ($activeMembers as $member) {
                InterestDistribution::create([
                    'user_id' => $member->id,
                    'cic_investment_id' => $cicInvestment->id,
                    'total_interest' => $totalInterest,
                    'member_share' => $interestPerMember,
                    'share_percentage' => $sharePercentage,
                    'distribution_date' => $request->distribution_date,
                    'distribution_month' => date('Y-m', strtotime($request->distribution_date)),
                    'processed_by' => Auth::id(),
                ]);
                
                // Add to member's contributions as interest
                $member->memberContributions()->create([
                    'amount' => $interestPerMember,
                    'type' => 'interest',
                    'description' => 'CIC Interest Distribution for ' . date('F Y', strtotime($request->distribution_date)),
                    'reference_number' => 'INT-' . strtoupper(uniqid()),
                    'status' => 'approved',
                    'transaction_date' => $request->distribution_date,
                    'approved_by' => Auth::id(),
                    'approved_at' => now(),
                ]);
                
                // Update member's total contributions
                $member->increment('total_contributions', $interestPerMember);
                $member->increment('available_loan_limit', $interestPerMember);
            }
            
            // Update investment current value
            $cicInvestment->increment('current_value', $totalInterest);
        });
        
        return redirect()->back()
            ->with('success', 'Interest distributed successfully to all active members.');
    }
    
    public function updateValue(CicInvestment $cicInvestment, Request $request)
    {
        $this->authorize('update', $cicInvestment);
        
        $request->validate([
            'current_value' => 'required|numeric|min:0',
        ]);
        
        $cicInvestment->update([
            'current_value' => $request->current_value,
        ]);
        
        return redirect()->back()
            ->with('success', 'Investment value updated successfully.');
    }
}