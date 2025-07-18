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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'member', 'treasurer'])->default('member');
            $table->timestamp('joined_at')->nullable();
            $table->decimal('total_contributions', 15, 2)->default(0);
            $table->decimal('available_loan_limit', 15, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('phone_number')->nullable();
            $table->text('address')->nullable();
            $table->string('id_number')->unique()->nullable();
            $table->date('date_of_birth')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'joined_at',
                'total_contributions',
                'available_loan_limit',
                'is_active',
                'phone_number',
                'address',
                'id_number',
                'date_of_birth'
            ]);
        });
    }
};