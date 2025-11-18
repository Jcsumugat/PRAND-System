<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deceased_records', function (Blueprint $table) {
            $table->id();

            // Deceased Information
            $table->string('fullname');
            $table->date('birthday');
            $table->date('date_of_death');
            $table->string('tomb_number')->unique();
            $table->string('tomb_location');

            // Next of Kin Information
            $table->string('next_of_kin_name');
            $table->string('next_of_kin_relationship')->nullable();
            $table->string('contact_number');
            $table->string('email')->nullable();
            $table->text('address')->nullable();

            // Payment Status
            $table->date('payment_due_date')->nullable();
            $table->enum('payment_status', ['paid', 'pending', 'overdue'])->default('pending');

            // System fields
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deceased_records');
    }
};
