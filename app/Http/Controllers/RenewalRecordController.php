<?php

namespace App\Http\Controllers;

use App\Models\DeceasedRecord;
use App\Models\PaymentRecord;
use App\Models\RenewalRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class RenewalRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = RenewalRecord::with(['deceased_record', 'processor']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('deceased_record', function($q) use ($search) {
                $q->where('fullname', 'like', "%{$search}%")
                  ->orWhere('tomb_number', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Payment status filter
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        $renewals = $query->latest()->paginate(10);

        // Calculate statistics
        $stats = [
            'total_renewals' => RenewalRecord::count(),
            'active_renewals' => RenewalRecord::where('status', 'active')->count(),
            'due_soon' => DeceasedRecord::where('is_fully_paid', true)
                ->whereNotNull('payment_due_date')
                ->where('payment_due_date', '>=', date('Y-m-d'))
                ->where('payment_due_date', '<=', date('Y-m-d', strtotime('+2 months')))
                ->count(),
            'overdue' => DeceasedRecord::where('is_fully_paid', true)
                ->whereNotNull('payment_due_date')
                ->where('payment_due_date', '<', date('Y-m-d'))
                ->count(),
            // Financial stats
            'total_renewal_payments' => PaymentRecord::where('payment_for', 'renewal')->count(),
            'total_renewal_amount' => (float) PaymentRecord::where('payment_for', 'renewal')->sum('amount'),
            'total_balance' => (float) RenewalRecord::sum('balance'),
            'fully_paid_renewals' => RenewalRecord::where('is_fully_paid', true)->count(),
            'partial_payment_renewals' => RenewalRecord::where('payment_status', 'partial')->count(),
            'pending_renewals' => RenewalRecord::where('payment_status', 'pending')->count(),
            // Coverage stats
            'coverage_expiring_soon' => $this->getCoverageExpiringSoonCount(),
            'coverage_expired' => $this->getCoverageExpiredCount(),
        ];

        // Get records that need renewal (based on burial date + 5 years)
        $needsRenewal = $this->getNeedsRenewalRecords();

        return Inertia::render('RenewalRecords/Index', [ 
            'renewals' => $renewals,
            'filters' => $request->only(['search', 'status', 'payment_status']),
            'stats' => $stats,
            'needsRenewal' => $needsRenewal,
        ]);
    }

    private function getCoverageExpiringSoonCount()
    {
        $deceasedRecords = DeceasedRecord::where('is_fully_paid', true)
            ->whereNotNull('date_of_burial')
            ->get();

        $count = 0;
        foreach ($deceasedRecords as $deceased) {
            $burialDate = Carbon::parse($deceased->date_of_burial);
            $coverageEndDate = $burialDate->copy()->addYears(5);
            $daysUntilExpiry = Carbon::now()->diffInDays($coverageEndDate, false);

            if ($daysUntilExpiry > 0 && $daysUntilExpiry <= 60) {
                $count++;
            }
        }

        return $count;
    }

    private function getCoverageExpiredCount()
    {
        $deceasedRecords = DeceasedRecord::where('is_fully_paid', true)
            ->whereNotNull('date_of_burial')
            ->get();

        $count = 0;
        foreach ($deceasedRecords as $deceased) {
            $burialDate = Carbon::parse($deceased->date_of_burial);
            $coverageEndDate = $burialDate->copy()->addYears(5);

            if ($coverageEndDate->isPast()) {
                $count++;
            }
        }

        return $count;
    }

    private function getNeedsRenewalRecords()
    {
        $deceasedRecords = DeceasedRecord::where('is_fully_paid', true)
            ->whereNotNull('date_of_burial')
            ->get();

        $needsRenewal = collect();

        foreach ($deceasedRecords as $deceased) {
            $burialDate = Carbon::parse($deceased->date_of_burial);
            $coverageEndDate = $burialDate->copy()->addYears(5);
            $daysUntilExpiry = Carbon::now()->diffInDays($coverageEndDate, false);

            // Include if expired or expiring within 2 months (60 days)
            if ($daysUntilExpiry <= 60) {
                $needsRenewal->push([
                    'id' => $deceased->id,
                    'fullname' => $deceased->fullname,
                    'tomb_number' => $deceased->tomb_number,
                    'tomb_location' => $deceased->tomb_location,
                    'next_of_kin_name' => $deceased->next_of_kin_name,
                    'contact_number' => $deceased->contact_number,
                    'payment_due_date' => $coverageEndDate->format('Y-m-d'),
                    'last_payment_date' => $deceased->last_payment_date,
                    'days_until_due' => abs($daysUntilExpiry),
                    'is_overdue' => $daysUntilExpiry < 0,
                    'burial_date' => $deceased->date_of_burial,
                ]);
            }
        }

        return $needsRenewal->sortBy('payment_due_date')->values();
    }
}