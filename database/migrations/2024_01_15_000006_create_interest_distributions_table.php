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
        Schema::create('interest_distributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('cic_investment_id')->constrained()->onDelete('cascade');
            $table->decimal('total_interest', 15, 2);
            $table->decimal('member_share', 15, 2);
            $table->decimal('share_percentage', 5, 2);
            $table->date('distribution_date');
            $table->string('distribution_month'); // e.g., "2024-01"
            $table->enum('status', ['pending', 'distributed'])->default('pending');
            $table->text('notes')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interest_distributions');
    }
};