<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deceased_record_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->date('payment_date');
            $table->enum('payment_type', ['initial', 'renewal', 'penalty'])->default('initial');
            $table->enum('payment_method', ['cash', 'gcash', 'bank_transfer', 'check'])->default('cash');
            $table->string('receipt_number')->unique();
            $table->string('official_receipt_number')->nullable();
            $table->text('remarks')->nullable();
            $table->foreignId('received_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_records');
    }
};
