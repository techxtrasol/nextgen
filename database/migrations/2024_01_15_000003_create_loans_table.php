<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('principal_amount', 15, 2);
            $table->integer('duration_weeks');
            $table->decimal('interest_rate', 5, 2); // 5%, 10%, 15%, 20%
            $table->decimal('total_amount', 15, 2); // Principal + Interest
            $table->decimal('amount_paid', 15, 2)->default(0);
            $table->decimal('balance', 15, 2);
            $table->enum('status', ['pending', 'approved', 'active', 'completed', 'defaulted', 'rejected'])->default('pending');
            $table->date('application_date');
            $table->date('approval_date')->nullable();
            $table->date('due_date')->nullable();
            $table->date('completion_date')->nullable();
            $table->text('purpose')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->integer('penalty_days')->default(0);
            $table->decimal('penalty_amount', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};