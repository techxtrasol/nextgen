<?php

namespace App\Policies;

use App\Models\MemberContribution;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MemberContributionPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view contributions
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, MemberContribution $model): bool
    {
        return $user->isAdmin() || $user->isTreasurer() || $user->id === $model->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // All authenticated users can create contributions
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, MemberContribution $model): bool
    {
        return $user->isAdmin() || $user->isTreasurer();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, MemberContribution $model): bool
    {
        return $user->isAdmin() || $user->isTreasurer();
    }

    /**
     * Determine whether the user can approve the model.
     */
    public function approve(User $user, MemberContribution $model): bool
    {
        return $user->isAdmin() || $user->isTreasurer();
    }

    /**
     * Determine whether the user can reject the model.
     */
    public function reject(User $user, MemberContribution $model): bool
    {
        return $user->isAdmin() || $user->isTreasurer();
    }
}
