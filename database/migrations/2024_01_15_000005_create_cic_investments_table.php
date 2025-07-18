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
        Schema::create('cic_investments', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 15, 2);
            $table->date('investment_date');
            $table->decimal('interest_rate', 5, 2)->default(9.75); // 9.75% monthly
            $table->decimal('current_value', 15, 2);
            $table->date('maturity_date')->nullable();
            $table->enum('status', ['active', 'matured', 'withdrawn'])->default('active');
            $table->string('investment_reference')->unique();
            $table->text('notes')->nullable();
            $table->foreignId('recorded_by')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cic_investments');
    }
};