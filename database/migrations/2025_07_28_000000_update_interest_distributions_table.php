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
        Schema::table('interest_distributions', function (Blueprint $table) {
            // Example: add a new column if needed
            // $table->decimal('new_column', 15, 2)->nullable();
            // Add or modify columns as per your new schema requirements
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('interest_distributions', function (Blueprint $table) {
            // Example: drop the new column if it was added
            // $table->dropColumn('new_column');
            // Reverse any changes made in up()
        });
    }
};
