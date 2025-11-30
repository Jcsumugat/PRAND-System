<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PaymentRecord;
use App\Models\DeceasedRecord;
use Carbon\Carbon;

class UpdateCoverageStatus extends Command
{
    protected $signature = 'coverage:update-status';
    protected $description = 'Update coverage status from initial to renewal after 5 years';

    public function handle()
    {
        $this->info('Updating coverage statuses...');

        // Find all initial payments where coverage has expired (5 years passed)
        $expiredCoverages = PaymentRecord::where('coverage_status', 'initial')
            ->where('payment_for', 'initial')
            ->whereNotNull('coverage_end_date')
            ->where('coverage_end_date', '<=', Carbon::now())
            ->get();

        $count = 0;
        foreach ($expiredCoverages as $payment) {
            // Update payment record status
            $payment->update(['coverage_status' => 'renewal']);

            // Update deceased record to require renewal
            $deceased = $payment->deceased_record;
            if ($deceased) {
                $deceased->update([
                    'payment_due_date' => Carbon::now(),
                    'payment_status' => 'overdue',
                ]);
            }

            $count++;
        }

        $this->info("Updated {$count} payment records to renewal status.");

        return Command::SUCCESS;
    }
}