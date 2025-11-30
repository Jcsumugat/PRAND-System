<?php

namespace App\Http\Controllers;

use App\Models\DeceasedRecord;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class PaymentExpiryController extends Controller
{

    public function getExpiringPayments(): JsonResponse
    {
        try {

            $fifteenDaysFromNow = Carbon::now()->addDays(15);
            $today = Carbon::now();


            $expiringRecords = DeceasedRecord::whereNotNull('payment_due_date')
                ->whereDate('payment_due_date', '<=', $fifteenDaysFromNow)
                ->whereDate('payment_due_date', '>', $today)
                ->count();


            $overdueRecords = DeceasedRecord::whereNotNull('payment_due_date')
                ->whereDate('payment_due_date', '<=', $today)
                ->count();


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

    public function getExpiringRecordsList()
    {
        try {
            $fifteenDaysFromNow = Carbon::now()->addDays(15);
            $today = Carbon::now();

            $expiringRecords = DeceasedRecord::whereNotNull('payment_due_date')
                ->whereDate('payment_due_date', '<=', $fifteenDaysFromNow)
                ->whereDate('payment_due_date', '>', $today)
                ->select('id', 'fullname', 'tomb_number', 'tomb_location', 'payment_due_date', 'payment_status', 'balance', 'is_fully_paid')
                ->orderBy('payment_due_date', 'asc')
                ->get()
                ->map(function ($record) {
                    $daysUntilExpiry = Carbon::now()->diffInDays(Carbon::parse($record->payment_due_date));
                    return [
                        ...$record->toArray(),
                        'days_until_expiry' => $daysUntilExpiry,
                        'type' => 'expiring_soon',
                        'status_label' => $this->getPaymentStatusLabel($record)
                    ];
                });

            $overdueRecords = DeceasedRecord::whereNotNull('payment_due_date')
                ->whereDate('payment_due_date', '<=', $today)
                ->select('id', 'fullname', 'tomb_number', 'tomb_location', 'payment_due_date', 'payment_status', 'balance', 'is_fully_paid')
                ->orderBy('payment_due_date', 'asc')
                ->get()
                ->map(function ($record) {
                    $daysOverdue = Carbon::parse($record->payment_due_date)->diffInDays(Carbon::now());
                    return [
                        ...$record->toArray(),
                        'days_overdue' => $daysOverdue,
                        'type' => 'overdue',
                        'status_label' => $this->getPaymentStatusLabel($record)
                    ];
                });

            return response()->json([
                'expiring_soon' => $expiringRecords,
                'overdue' => $overdueRecords,
                'total_count' => $expiringRecords->count() + $overdueRecords->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'expiring_soon' => [],
                'overdue' => [],
                'total_count' => 0
            ], 500);
        }
    }

    private function getPaymentStatusLabel($record)
    {
        if ($record->is_fully_paid || $record->payment_status === 'paid') {
            return 'Paid - Renewal Required';
        } elseif ($record->payment_status === 'partial') {
            return 'Partial Payment - Balance: ₱' . number_format($record->balance, 2);
        } else {
            return 'Pending Payment - Balance: ₱' . number_format($record->balance, 2);
        }
    }
}
