<?php

namespace App\Http\Controllers;

use App\Models\DeceasedRecord;
use App\Models\PaymentRecord;
use App\Models\RenewalRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalRecords' => DeceasedRecord::count(),
            'fullyPaidRecords' => DeceasedRecord::where('is_fully_paid', true)->count(),
            'partialPayments' => DeceasedRecord::where('amount_paid', '>', 0)
                ->where('is_fully_paid', false)
                ->count(),
            'noPayment' => DeceasedRecord::where('amount_paid', 0)->count(),
            'totalCollected' => (float) PaymentRecord::sum('amount'),
            'totalBalance' => (float) DeceasedRecord::where('balance', '>', 0)->sum('balance'),
            'paidThisMonth' => PaymentRecord::whereMonth('payment_date', date('m'))
                ->whereYear('payment_date', date('Y'))
                ->count(),
            'upcomingRenewals' => DeceasedRecord::where('is_fully_paid', true)
                ->whereNotNull('payment_due_date')
                ->where('payment_due_date', '>=', date('Y-m-d'))
                ->where('payment_due_date', '<=', date('Y-m-d', strtotime('+2 months')))
                ->count(),
            'overduePayments' => DeceasedRecord::where('is_fully_paid', true)
                ->whereNotNull('payment_due_date')
                ->where('payment_due_date', '<', date('Y-m-d'))
                ->count(),
            'totalRenewals' => RenewalRecord::count(),
            'activeRenewals' => RenewalRecord::where('status', 'active')->count(),
        ];

        $upcomingRenewalsList = DeceasedRecord::where('is_fully_paid', true)
            ->whereNotNull('payment_due_date')
            ->where('payment_due_date', '>=', date('Y-m-d'))
            ->where('payment_due_date', '<=', date('Y-m-d', strtotime('+2 months')))
            ->orderBy('payment_due_date', 'asc')
            ->take(5)
            ->get()
            ->map(function($deceased) {
                $daysUntil = $deceased->daysUntilRenewal();
                return [
                    'id' => $deceased->id,
                    'fullname' => $deceased->fullname,
                    'tomb_number' => $deceased->tomb_number,
                    'payment_due_date' => $deceased->payment_due_date,
                    'days_until_renewal' => $daysUntil,
                    'alert_level' => $daysUntil <= 7 ? 'critical' : ($daysUntil <= 30 ? 'warning' : 'info')
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'upcomingRenewals' => $upcomingRenewalsList,
        ]);
    }
}