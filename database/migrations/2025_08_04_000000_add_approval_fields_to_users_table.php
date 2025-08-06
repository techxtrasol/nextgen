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
            $table->boolean('email_verified')->default(false);
            $table->boolean('admin_approved')->default(false);
            $table->timestamp('admin_approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->text('approval_notes')->nullable();
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropColumn([
                'email_verified',
                'admin_approved',
                'admin_approved_at',
                'approved_by',
                'approval_notes',
                'approval_status'
            ]);
        });
    }
};
