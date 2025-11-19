<?php

namespace App\Http\Controllers;

use App\Models\DeceasedRecord;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class PaymentExpiryController extends Controller
{
    /**
     * Get count of records expiring within 2 months
     * (Payment expires 2 months before the 5-year due date)
     */
    public function getExpiringPayments(): JsonResponse
    {
        try {
            // Calculate the threshold date: 2 months from today
            $twoMonthsFromNow = Carbon::now()->addMonths(2);
            $today = Carbon::now();
            $expiringRecords = DeceasedRecord::where('payment_status', 'paid')
                ->whereNotNull('payment_due_date')
                ->whereDate('payment_due_date', '<=', $twoMonthsFromNow)
                ->whereDate('payment_due_date', '>', $today)
                ->count();

            // Also count overdue payments (payment due date has passed)
            $overdueRecords = DeceasedRecord::where('payment_status', 'paid')
                ->whereNotNull('payment_due_date')
                ->whereDate('payment_due_date', '<=', $today)
                ->count();

            // Total count = expiring + overdue
            $totalCount = $expiringRecords + $overdueRecords;

            return response()->json([
                'count' => $totalCount,
                'expiring_soon' => $expiringRecords,
                'overdue' => $overdueRecords,
                'message' => $totalCount > 0 
                    ? "There are {$totalCount} records requiring payment renewal attention"
                    : "No records requiring immediate attention"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'count' => 0,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get detailed list of expiring payment records
     * Used for showing detailed notifications or reports
     */
    public function getExpiringRecordsList()
    {
        try {
            $twoMonthsFromNow = Carbon::now()->addMonths(2);
            $today = Carbon::now();

            // Expiring soon records
            $expiringRecords = DeceasedRecord::where('payment_status', 'paid')
                ->whereNotNull('payment_due_date')
                ->whereDate('payment_due_date', '<=', $twoMonthsFromNow)
                ->whereDate('payment_due_date', '>', $today)
                ->select('id', 'fullname', 'tomb_number', 'payment_due_date', 'payment_status')
                ->orderBy('payment_due_date', 'asc')
                ->get()
                ->map(function($record) {
                    $daysUntilExpiry = Carbon::now()->diffInDays(Carbon::parse($record->payment_due_date));
                    return [
                        ...$record->toArray(),
                        'days_until_expiry' => $daysUntilExpiry,
                        'type' => 'expiring_soon'
                    ];
                });

            // Overdue records
            $overdueRecords = DeceasedRecord::where('payment_status', 'paid')
                ->whereNotNull('payment_due_date')
                ->whereDate('payment_due_date', '<=', $today)
                ->select('id', 'fullname', 'tomb_number', 'payment_due_date', 'payment_status')
                ->orderBy('payment_due_date', 'asc')
                ->get()
                ->map(function($record) {
                    $daysOverdue = Carbon::parse($record->payment_due_date)->diffInDays(Carbon::now());
                    return [
                        ...$record->toArray(),
                        'days_overdue' => $daysOverdue,
                        'type' => 'overdue'
                    ];
                });

            return response()->json([
                'expiring_soon' => $expiringRecords,
                'overdue' => $overdueRecords,
                'total_count' => $expiringRecords->count() + $overdueRecords->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}