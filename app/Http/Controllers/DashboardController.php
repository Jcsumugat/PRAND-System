<?php

namespace App\Http\Controllers;

use App\Models\DeceasedRecord;
use App\Models\PaymentRecord;
use App\Models\RenewalRecord;
use App\Models\NoticeDistribution;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Get statistics
        $totalRecords = DeceasedRecord::count();

        $paidThisMonth = PaymentRecord::whereMonth('payment_date', now()->month)
            ->whereYear('payment_date', now()->year)
            ->count();

        $pendingRenewals = DeceasedRecord::where('payment_status', 'pending')->count();

        $overduePayments = DeceasedRecord::where('payment_status', 'overdue')->count();

        // Monthly statistics for bar chart (last 6 months)
        $monthlyStats = DeceasedRecord::select(
                DB::raw('MONTH(date_of_death) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->whereYear('date_of_death', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Trend data for line chart (old vs new deceased)
        $trendData = DeceasedRecord::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalRecords' => $totalRecords,
                'paidThisMonth' => $paidThisMonth,
                'pendingRenewals' => $pendingRenewals,
                'overduePayments' => $overduePayments,
            ],
            'monthlyStats' => $monthlyStats,
            'trendData' => $trendData,
        ]);
    }
}
