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
            $table->decimal('interest_rate', 6, 4)->default(0.0975); // 9.75% default
            $table->decimal('interest_amount', 12, 2)->default(0);
            $table->decimal('management_fee', 12, 2)->default(0);
            $table->decimal('withholding_tax', 12, 2)->default(0);
            $table->decimal('net_amount', 12, 2)->default(0);
            $table->datetime('distribution_date');
            $table->enum('status', ['pending', 'distributed'])->default('pending');
            $table->text('notes')->nullable();
            $table->foreignId('distributed_by')->nullable()->constrained('users')->onDelete('set null');
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
