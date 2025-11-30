<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PaymentRecord;
use App\Models\DeceasedRecord;
use Carbon\Carbon;

class UpdateCoverageStatus extends Command
{
    protected $signature = 'coverage:update-status';
    protected $description = 'Update coverage status from initial to renewal after 5 years from burial date';

    public function handle()
    {
        $this->info('Updating coverage statuses based on burial dates...');

        // Find all deceased records with initial payments that are fully paid
        $deceasedRecords = DeceasedRecord::where('is_fully_paid', true)
            ->whereNotNull('date_of_burial')
            ->get();

        $count = 0;
        foreach ($deceasedRecords as $deceased) {
            // Calculate 5 years from burial date
            $burialDate = Carbon::parse($deceased->date_of_burial);
            $coverageEndDate = $burialDate->copy()->addYears(5);

            // Check if coverage has expired
            if ($coverageEndDate->isPast()) {
                // Find the initial payment for this deceased record
                $initialPayment = PaymentRecord::where('deceased_record_id', $deceased->id)
                    ->where('coverage_status', 'initial')
                    ->where('payment_for', 'initial')
                    ->first();

                if ($initialPayment) {
                    // Update payment record status to renewal
                    $initialPayment->update([
                        'coverage_status' => 'renewal',
                        'coverage_end_date' => $coverageEndDate,
                    ]);

                    // Update deceased record to require renewal
                    $deceased->update([
                        'payment_due_date' => $coverageEndDate,
                        'payment_status' => 'overdue',
                        'is_fully_paid' => false,
                        'balance' => 5000.00, // Reset balance for renewal
                    ]);

                    $this->info("Updated record for: {$deceased->fullname} (Burial: {$burialDate->format('Y-m-d')}, Expired: {$coverageEndDate->format('Y-m-d')})");
                    $count++;
                }
            }
        }

        $this->info("Updated {$count} records to renewal status.");

        return Command::SUCCESS;
    }
}