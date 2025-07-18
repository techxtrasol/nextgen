<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MilestoneController extends Controller
{
    public function index()
    {
        $milestones = Milestone::with('createdBy')
            ->latest()
            ->paginate(20);
            
        $activeMilestones = Milestone::active()->count();
        $achievedMilestones = Milestone::achieved()->count();
        $totalTargetAmount = Milestone::active()->sum('target_amount');
        $totalCurrentAmount = Milestone::active()->sum('current_amount');
        
        return view('milestones.index', compact(
            'milestones', 
            'activeMilestones', 
            'achievedMilestones', 
            'totalTargetAmount', 
            'totalCurrentAmount'
        ));
    }
    
    public function create()
    {
        $this->authorize('create', Milestone::class);
        
        return view('milestones.create');
    }
    
    public function store(Request $request)
    {
        $this->authorize('create', Milestone::class);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'target_amount' => 'required|numeric|min:1000',
            'target_date' => 'required|date|after:today',
            'priority' => 'required|in:low,medium,high,critical',
        ]);
        
        Milestone::create([
            'title' => $request->title,
            'description' => $request->description,
            'target_amount' => $request->target_amount,
            'target_date' => $request->target_date,
            'priority' => $request->priority,
            'created_by' => Auth::id(),
        ]);
        
        return redirect()->route('milestones.index')
            ->with('success', 'Milestone created successfully.');
    }
    
    public function show(Milestone $milestone)
    {
        $milestone->load('createdBy');
        
        return view('milestones.show', compact('milestone'));
    }
    
    public function edit(Milestone $milestone)
    {
        $this->authorize('update', $milestone);
        
        return view('milestones.edit', compact('milestone'));
    }
    
    public function update(Request $request, Milestone $milestone)
    {
        $this->authorize('update', $milestone);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'target_amount' => 'required|numeric|min:1000',
            'target_date' => 'required|date',
            'priority' => 'required|in:low,medium,high,critical',
            'status' => 'required|in:active,achieved,paused,cancelled',
        ]);
        
        $milestone->update($request->only([
            'title', 'description', 'target_amount', 'target_date', 'priority', 'status'
        ]));
        
        // Mark as achieved if status is changed to achieved
        if ($request->status === 'achieved' && $milestone->achieved_date === null) {
            $milestone->update(['achieved_date' => now()]);
        }
        
        return redirect()->route('milestones.index')
            ->with('success', 'Milestone updated successfully.');
    }
    
    public function updateProgress(Milestone $milestone, Request $request)
    {
        $this->authorize('update', $milestone);
        
        $request->validate([
            'current_amount' => 'required|numeric|min:0|max:' . $milestone->target_amount,
        ]);
        
        $milestone->update([
            'current_amount' => $request->current_amount,
        ]);
        
        // Check if milestone is achieved
        if ($milestone->current_amount >= $milestone->target_amount) {
            $milestone->update([
                'status' => 'achieved',
                'achieved_date' => now(),
            ]);
        }
        
        return redirect()->back()
            ->with('success', 'Milestone progress updated successfully.');
    }
    
    public function destroy(Milestone $milestone)
    {
        $this->authorize('delete', $milestone);
        
        $milestone->delete();
        
        return redirect()->route('milestones.index')
            ->with('success', 'Milestone deleted successfully.');
    }
}