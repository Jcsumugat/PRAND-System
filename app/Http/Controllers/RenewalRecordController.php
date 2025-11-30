<?php

namespace App\Http\Controllers;

use App\Models\DeceasedRecord;
use App\Models\PaymentRecord;
use App\Models\RenewalRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

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
        ];

        // Get records that need renewal
        $needsRenewal = DeceasedRecord::where('is_fully_paid', true)
            ->whereNotNull('payment_due_date')
            ->where('payment_due_date', '<=', date('Y-m-d', strtotime('+2 months')))
            ->orderBy('payment_due_date', 'asc')
            ->get()
            ->map(function($record) {
                $daysUntil = Carbon::parse($record->payment_due_date)->diffInDays(Carbon::now(), false);
                return [
                    'id' => $record->id,
                    'fullname' => $record->fullname,
                    'tomb_number' => $record->tomb_number,
                    'tomb_location' => $record->tomb_location,
                    'next_of_kin_name' => $record->next_of_kin_name,
                    'contact_number' => $record->contact_number,
                    'payment_due_date' => $record->payment_due_date,
                    'last_payment_date' => $record->last_payment_date,
                    'days_until_due' => abs($daysUntil),
                    'is_overdue' => $daysUntil > 0,
                ];
            });

        return Inertia::render('RenewalRecords/Index', [ 
            'renewals' => $renewals,
            'filters' => $request->only(['search', 'status', 'payment_status']),
            'stats' => $stats,
            'needsRenewal' => $needsRenewal,
        ]);
    }
}