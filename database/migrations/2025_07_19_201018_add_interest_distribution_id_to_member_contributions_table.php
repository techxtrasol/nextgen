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
        Schema::table('member_contributions', function (Blueprint $table) {
            $table->unsignedBigInteger('interest_distribution_id')->nullable()->after('approved_at');
            $table->foreign('interest_distribution_id')->references('id')->on('interest_distributions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('member_contributions', function (Blueprint $table) {
            $table->dropForeign(['interest_distribution_id']);
            $table->dropColumn('interest_distribution_id');
        });
    }
};
