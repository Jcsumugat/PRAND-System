<?php

namespace App\Http\Controllers;

use App\Models\PaymentRecord;
use App\Models\DeceasedRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

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

        return Inertia::render('PaymentRecords/Index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'type', 'method'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $deceasedRecords = DeceasedRecord::orderBy('fullname')->get();
        $selectedDeceased = null;

        if ($request->has('deceased_id')) {
            $selectedDeceased = DeceasedRecord::find($request->deceased_id);
        }

        return Inertia::render('PaymentRecords/Create', [
            'deceasedRecords' => $deceasedRecords,
            'selectedDeceased' => $selectedDeceased
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

        // Generate unique receipt number
        $validated['receipt_number'] = 'RCP-' . date('Ymd') . '-' . strtoupper(Str::random(6));
        $validated['received_by'] = Auth::id();

        $paymentRecord = PaymentRecord::create($validated);

        // Update deceased record payment status
        $deceased = DeceasedRecord::find($validated['deceased_record_id']);
        if ($validated['payment_type'] === 'initial' || $validated['payment_type'] === 'renewal') {
            $deceased->update([
                'payment_status' => 'paid',
                'payment_due_date' => now()->addYear()
            ]);
        }

        return redirect()->route('payments.index')
            ->with('success', 'Payment recorded successfully. Receipt #: ' . $paymentRecord->receipt_number);
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
            'deceasedRecords' => $deceasedRecords
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
        $payment->delete();

        return redirect()->route('payments.index')
            ->with('success', 'Payment record deleted successfully.');
    }
}
