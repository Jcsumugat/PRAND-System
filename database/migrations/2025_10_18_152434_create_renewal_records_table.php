<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('renewal_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deceased_record_id')->constrained()->onDelete('cascade');
            $table->date('renewal_date');
            $table->date('next_renewal_date');
            $table->decimal('renewal_fee', 10, 2);
            $table->enum('status', ['active', 'expired', 'pending'])->default('pending');
            $table->foreignId('processed_by')->constrained('users');
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('renewal_records');
    }
};
