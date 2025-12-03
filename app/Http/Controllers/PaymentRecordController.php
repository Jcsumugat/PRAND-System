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
use Carbon\Carbon;

class PaymentRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = PaymentRecord::with(['deceasedRecord', 'receiver'])
            ->where('payment_for', '!=', 'renewal')
            ->orderBy('created_at', 'desc')
            ->orderBy('payment_date', 'desc');

        if ($request->has('type') && $request->type != '') {
            $query->where('payment_type', $request->type);
        }

        if ($request->has('method') && $request->method != '') {
            $query->where('payment_method', $request->method);
        }

        if ($request->has('payment_for') && $request->payment_for != '') {
            $query->where('payment_for', $request->payment_for);
        }

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('receipt_number', 'like', "%{$search}%")
                    ->orWhere('official_receipt_number', 'like', "%{$search}%")
                    ->orWhereHas('deceasedRecord', function ($q) use ($search) {
                        $q->where('fullname', 'like', "%{$search}%");
                    });
            });
        }

        $payments = $query->paginate(10)->withQueryString();

        $stats = [
            'total_payments' => PaymentRecord::count(),
            'initial_payments' => PaymentRecord::where('payment_for', 'initial')->count(),
            'balance_payments' => PaymentRecord::where('payment_for', 'balance')->count(),
            'partial_payment_count' => DeceasedRecord::where('amount_paid', '>', 0)
                ->where('is_fully_paid', false)
                ->count(),
            'fully_paid_count' => DeceasedRecord::where('is_fully_paid', true)->count(),
            'no_payment_count' => DeceasedRecord::where('amount_paid', 0)->count(),
        ];

        return Inertia::render('PaymentRecords/Index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'type', 'method', 'payment_for']),
            'stats' => $stats
        ]);
    }

    public function create(Request $request)
    {
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'deceased_record_id' => 'required|exists:deceased_records,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'payment_type' => 'required|in:initial,renewal,penalty',
            'payment_for' => 'required|in:initial,renewal,balance,penalty',
            'payment_method' => 'required|in:cash,gcash,bank_transfer,check',
            'official_receipt_number' => 'nullable|string|max:255',
            'remarks' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $deceased = DeceasedRecord::findOrFail($validated['deceased_record_id']);

            // Initialize variables
            $coverageStartDate = null;
            $coverageEndDate = null;
            $coverageStatus = 'initial';
            $remainingBalance = null;

            // Handle RENEWAL payments
            if ($validated['payment_for'] === 'renewal') {
                // Check if initial payment is fully paid
                if (!$deceased->is_fully_paid) {
                    return back()->withErrors(['error' => 'Cannot process renewal. Initial payment must be fully paid first.']);
                }

                // Get the last coverage end date from payment records
                $lastPayment = PaymentRecord::where('deceased_record_id', $deceased->id)
                    ->whereNotNull('coverage_end_date')
                    ->orderBy('coverage_end_date', 'desc')
                    ->first();

                if ($lastPayment) {
                    // Start from the last coverage end date
                    $coverageStartDate = Carbon::parse($lastPayment->coverage_end_date);
                } else {
                    // If no previous coverage found, calculate from burial date
                    $burialDate = Carbon::parse($deceased->date_of_burial);
                    $coverageStartDate = $burialDate->copy()->addYears(5);
                }

                // Add 5 years for renewal coverage
                $coverageEndDate = $coverageStartDate->copy()->addYears(5);
                $coverageStatus = 'renewal';
                $remainingBalance = 0; // Renewals have no balance tracking
            }
            // Handle INITIAL and BALANCE payments
            elseif ($validated['payment_for'] === 'initial' || $validated['payment_for'] === 'balance') {
                // Check if already fully paid
                if ($deceased->balance <= 0 && $deceased->is_fully_paid) {
                    return back()->withErrors(['amount' => 'This record is already fully paid. Use renewal payment instead.']);
                }

                // Validate payment amount
                if ($validated['amount'] > $deceased->balance) {
                    return back()->withErrors(['amount' => 'Payment amount cannot exceed remaining balance of ₱' . number_format($deceased->balance, 2)]);
                }

                // Check minimum down payment for first payment
                if ($deceased->amount_paid == 0 && $validated['amount'] < 2500) {
                    return back()->withErrors(['amount' => 'Minimum down payment is ₱2,500.00 (50% of total amount)']);
                }

                // Calculate new balance
                $newAmountPaid = $deceased->amount_paid + $validated['amount'];
                $newBalance = $deceased->balance - $validated['amount'];
                $isFullyPaid = $newBalance <= 0;

                // Set coverage dates only if fully paid
                if ($isFullyPaid) {
                    $coverageStartDate = Carbon::parse($deceased->date_of_burial);
                    $coverageEndDate = $coverageStartDate->copy()->addYears(5);
                    $coverageStatus = 'initial';
                }

                $remainingBalance = max(0, $newBalance);
            }
            // Handle PENALTY payments
            elseif ($validated['payment_for'] === 'penalty') {
                // Penalties don't affect balance or coverage
                $remainingBalance = $deceased->balance;
            }

            // Generate receipt number
            $receiptNumber = 'RCP-' . date('Ymd') . '-' . strtoupper(Str::random(6));

            // Create payment record
            $paymentRecord = PaymentRecord::create([
                'deceased_record_id' => $validated['deceased_record_id'],
                'amount' => $validated['amount'],
                'payment_date' => $validated['payment_date'],
                'payment_type' => $validated['payment_type'],
                'payment_for' => $validated['payment_for'],
                'payment_method' => $validated['payment_method'],
                'official_receipt_number' => $validated['official_receipt_number'],
                'remarks' => $validated['remarks'],
                'receipt_number' => $receiptNumber,
                'received_by' => Auth::id(),
                'previous_balance' => $deceased->balance,
                'remaining_balance' => $remainingBalance,
                'coverage_status' => $coverageStatus,
                'coverage_start_date' => $coverageStartDate,
                'coverage_end_date' => $coverageEndDate,
            ]);

            // Update deceased record based on payment type
            if ($validated['payment_for'] === 'renewal') {
                // Update deceased record with new renewal coverage
                $deceased->update([
                    'payment_status' => 'paid',
                    'payment_due_date' => $coverageEndDate,
                    'last_payment_date' => $validated['payment_date']
                ]);

                // Calculate renewal balance and payment status
                $renewalBalance = 5000 - $validated['amount'];
                $renewalIsFullyPaid = $renewalBalance <= 0;
                $renewalPaymentStatus = $renewalIsFullyPaid ? 'paid' : 'partial';

                // Create renewal record
                RenewalRecord::create([
                    'deceased_record_id' => $validated['deceased_record_id'],
                    'renewal_date' => $validated['payment_date'],
                    'next_renewal_date' => $coverageEndDate,
                    'renewal_fee' => 5000,
                    'total_amount_due' => 5000,
                    'amount_paid' => $validated['amount'],
                    'balance' => max(0, $renewalBalance),
                    'is_fully_paid' => $renewalIsFullyPaid,
                    'payment_status' => $renewalPaymentStatus,
                    'status' => 'active',
                    'processed_by' => Auth::id(),
                    'remarks' => $validated['remarks']
                ]);

                $successMessage = 'Renewal payment recorded successfully. Receipt #: ' . $receiptNumber .
                    ' | Coverage extended until ' . $coverageEndDate->format('M d, Y');
            } elseif ($validated['payment_for'] === 'initial' || $validated['payment_for'] === 'balance') {
                $updateData = [
                    'amount_paid' => $newAmountPaid,
                    'balance' => max(0, $newBalance),
                    'last_payment_date' => $validated['payment_date']
                ];

                // If fully paid, update payment status and set due date
                if ($newBalance <= 0) {
                    $updateData['is_fully_paid'] = true;
                    $updateData['payment_status'] = 'paid';
                    $updateData['payment_due_date'] = $coverageEndDate;

                    $successMessage = 'Payment recorded successfully. Receipt #: ' . $receiptNumber .
                        ' | FULLY PAID - Coverage active until ' . $coverageEndDate->format('M d, Y');
                } else {
                    $updateData['payment_status'] = 'pending';

                    $successMessage = 'Payment recorded successfully. Receipt #: ' . $receiptNumber .
                        ' | Remaining Balance: ₱' . number_format(max(0, $newBalance), 2);
                }

                $deceased->update($updateData);
            } elseif ($validated['payment_for'] === 'penalty') {
                $deceased->update([
                    'last_payment_date' => $validated['payment_date']
                ]);

                $successMessage = 'Penalty payment recorded successfully. Receipt #: ' . $receiptNumber;
            }

            DB::commit();

            return redirect()->route('payments.index')->with('success', $successMessage);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to record payment: ' . $e->getMessage()]);
        }
    }

    public function show(PaymentRecord $payment)
    {
        $payment->load(['deceasedRecord', 'receiver']);

        return Inertia::render('PaymentRecords/Show', [
            'payment' => $payment
        ]);
    }

    public function paymentHistory($deceasedId)
    {
        $deceased = DeceasedRecord::with(['paymentRecords.receiver'])
            ->findOrFail($deceasedId);

        $paymentHistory = $deceased->paymentRecords()
            ->with('receiver')
            ->orderBy('payment_date', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('PaymentRecords/PaymentHistory', [
            'deceased' => $deceased,
            'paymentHistory' => $paymentHistory
        ]);
    }

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

    public function destroy(PaymentRecord $payment)
    {
        DB::beginTransaction();

        try {
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
