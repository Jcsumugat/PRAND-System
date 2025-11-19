<?php

namespace App\Http\Controllers;

use App\Models\PaymentRecord;
use App\Models\DeceasedRecord;
use App\Models\RenewalRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PaymentRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = PaymentRecord::with(['deceasedRecord', 'receiver'])
            ->orderBy('payment_date', 'desc');

        // Filter by payment type
        if ($request->has('type') && $request->type != '') {
            $query->where('payment_type', $request->type);
        }

        // Filter by payment method
        if ($request->has('method') && $request->method != '') {
            $query->where('payment_method', $request->method);
        }

        // Search by deceased name or receipt number
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('receipt_number', 'like', "%{$search}%")
                  ->orWhere('official_receipt_number', 'like', "%{$search}%")
                  ->orWhereHas('deceasedRecord', function($q) use ($search) {
                      $q->where('fullname', 'like', "%{$search}%");
                  });
            });
        }

        $payments = $query->paginate(10)->withQueryString();

        // Calculate statistics
        $stats = [
            'total_payments' => PaymentRecord::count(),
            'total_amount' => PaymentRecord::sum('amount'),
            'initial_payments' => PaymentRecord::where('payment_type', 'initial')->count(),
            'renewal_payments' => PaymentRecord::where('payment_type', 'renewal')->count(),
            'pending_renewals' => DeceasedRecord::where('payment_status', 'pending')
                ->whereNotNull('payment_due_date')
                ->count(),
        ];

        return Inertia::render('PaymentRecords/Index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'type', 'method']),
            'stats' => $stats
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // Only get deceased records that don't have initial payment yet
        $deceasedRecords = DeceasedRecord::orderBy('fullname')->get();
        $selectedDeceased = null;

        if ($request->has('deceased_id')) {
            $selectedDeceased = DeceasedRecord::find($request->deceased_id);
        }

        return Inertia::render('PaymentRecords/Create', [
            'deceasedRecords' => $deceasedRecords,
            'selectedDeceased' => $selectedDeceased,
            'standardAmount' => 5000.00,
            'renewalYears' => 5
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'deceased_record_id' => 'required|exists:deceased_records,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_type' => 'required|in:initial,renewal,penalty',
            'payment_method' => 'required|in:cash,gcash,bank_transfer,check',
            'official_receipt_number' => 'nullable|string|max:255',
            'remarks' => 'nullable|string',
        ]);

        DB::beginTransaction();
        
        try {
            // Generate unique receipt number
            $validated['receipt_number'] = 'RCP-' . date('Ymd') . '-' . strtoupper(Str::random(6));
            $validated['received_by'] = Auth::id();

            // Create payment record
            $paymentRecord = PaymentRecord::create($validated);

            // Get deceased record
            $deceased = DeceasedRecord::find($validated['deceased_record_id']);

            // Handle payment logic based on type
            if ($validated['payment_type'] === 'initial') {
                // For initial payment, set due date to 5 years from date of death
                $deceased->update([
                    'payment_status' => 'paid',
                    'payment_due_date' => date('Y-m-d', strtotime($deceased->date_of_death . ' +5 years'))
                ]);
            } 
            elseif ($validated['payment_type'] === 'renewal') {
                // For renewal payment, extend due date by 5 years from current due date
                $currentDueDate = $deceased->payment_due_date;
                $newDueDate = date('Y-m-d', strtotime($currentDueDate . ' +5 years'));
                
                $deceased->update([
                    'payment_status' => 'paid',
                    'payment_due_date' => $newDueDate
                ]);

                // Create renewal record
                RenewalRecord::create([
                    'deceased_record_id' => $validated['deceased_record_id'],
                    'renewal_date' => $validated['payment_date'],
                    'next_renewal_date' => $newDueDate,
                    'renewal_fee' => $validated['amount'],
                    'status' => 'active',
                    'processed_by' => Auth::id(),
                    'remarks' => $validated['remarks']
                ]);
            }

            DB::commit();

            return redirect()->route('payments.index')
                ->with('success', 'Payment recorded successfully. Receipt #: ' . $paymentRecord->receipt_number);
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to record payment: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentRecord $payment)
    {
        $payment->load(['deceasedRecord', 'receiver']);

        return Inertia::render('PaymentRecords/Show', [
            'payment' => $payment
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentRecord $payment)
    {
        $deceasedRecords = DeceasedRecord::orderBy('fullname')->get();

        return Inertia::render('PaymentRecords/Edit', [
            'payment' => $payment,
            'deceasedRecords' => $deceasedRecords,
            'standardAmount' => 5000.00,
            'renewalYears' => 5
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PaymentRecord $payment)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_type' => 'required|in:initial,renewal,penalty',
            'payment_method' => 'required|in:cash,gcash,bank_transfer,check',
            'official_receipt_number' => 'nullable|string|max:255',
            'remarks' => 'nullable|string',
        ]);

        $payment->update($validated);

        return redirect()->route('payments.index')
            ->with('success', 'Payment record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentRecord $payment)
    {
        DB::beginTransaction();
        
        try {
            // If this is a renewal payment, also delete the corresponding renewal record
            if ($payment->payment_type === 'renewal') {
                RenewalRecord::where('deceased_record_id', $payment->deceased_record_id)
                    ->where('renewal_date', $payment->payment_date)
                    ->delete();
            }
            
            $payment->delete();
            
            DB::commit();

            return redirect()->route('payments.index')
                ->with('success', 'Payment record deleted successfully.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to delete payment: ' . $e->getMessage()]);
        }
    }
}