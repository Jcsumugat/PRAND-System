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
        // Calculate statistics for dashboard cards
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
            'totalRenewals' => RenewalRecord::count(),
            'activeRenewals' => RenewalRecord::where('status', 'active')->count(),
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
        ]);
    }
}