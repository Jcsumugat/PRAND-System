<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notice_distributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deceased_record_id')->constrained()->onDelete('cascade');
            $table->string('recipient_name');
            $table->string('recipient_number');
            $table->text('message');
            $table->enum('notice_type', ['payment_reminder', 'renewal_notice', 'overdue_notice', 'general']);
            $table->enum('status', ['pending', 'sent', 'failed', 'delivered']);
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->text('error_message')->nullable();
            $table->integer('retry_count')->default(0);
            $table->foreignId('sent_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notice_distributions');
    }
};
