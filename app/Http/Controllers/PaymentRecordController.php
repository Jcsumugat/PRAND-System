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
            $deceased = DeceasedRecord::find($validated['deceased_record_id']);

            if ($validated['payment_for'] === 'balance' || $validated['payment_for'] === 'initial') {
                if ($deceased->balance <= 0) {
                    return back()->withErrors(['amount' => 'This record is already fully paid.']);
                }

                if ($validated['amount'] > $deceased->balance) {
                    return back()->withErrors(['amount' => 'Payment amount cannot exceed remaining balance of ₱' . number_format($deceased->balance, 2)]);
                }

                if ($deceased->amount_paid == 0 && $validated['amount'] < 2500) {
                    return back()->withErrors(['amount' => 'Minimum down payment is ₱2,500.00 (50% of total amount)']);
                }
            }

            // Calculate coverage dates based on date_of_burial
            $coverageStartDate = null;
            $coverageEndDate = null;
            $coverageStatus = 'initial';

            $newAmountPaid = $deceased->amount_paid + $validated['amount'];
            $newBalance = $deceased->balance - $validated['amount'];
            $isFullyPaid = $newBalance <= 0;

            if (($validated['payment_for'] === 'initial' || $validated['payment_for'] === 'balance') && $isFullyPaid) {
                // Use date_of_burial as the start of coverage
                $coverageStartDate = Carbon::parse($deceased->date_of_burial);
                $coverageEndDate = $coverageStartDate->copy()->addYears(5);
                $coverageStatus = 'initial';
            } elseif ($validated['payment_for'] === 'renewal' && $isFullyPaid) {
                // For renewals, get the last coverage end date or use burial date
                $lastPayment = PaymentRecord::where('deceased_record_id', $deceased->id)
                    ->whereNotNull('coverage_end_date')
                    ->orderBy('coverage_end_date', 'desc')
                    ->first();

                if ($lastPayment) {
                    $coverageStartDate = Carbon::parse($lastPayment->coverage_end_date);
                } else {
                    $coverageStartDate = Carbon::parse($deceased->date_of_burial);
                }
                $coverageEndDate = $coverageStartDate->copy()->addYears(5);
                $coverageStatus = 'renewal';
            }

            $validated['receipt_number'] = 'RCP-' . date('Ymd') . '-' . strtoupper(Str::random(6));
            $validated['received_by'] = Auth::id();
            $validated['previous_balance'] = $deceased->balance;
            $validated['coverage_status'] = $coverageStatus;
            $validated['coverage_start_date'] = $coverageStartDate;
            $validated['coverage_end_date'] = $coverageEndDate;

            $paymentRecord = PaymentRecord::create($validated);

            if ($validated['payment_for'] === 'initial' || $validated['payment_for'] === 'balance') {
                $updateData = [
                    'amount_paid' => $newAmountPaid,
                    'balance' => max(0, $newBalance),
                    'last_payment_date' => $validated['payment_date']
                ];

                if ($newBalance <= 0) {
                    $updateData['is_fully_paid'] = true;
                    $updateData['payment_status'] = 'paid';
                    $updateData['payment_due_date'] = $coverageEndDate;
                } else {
                    $updateData['payment_status'] = 'pending';
                }

                $deceased->update($updateData);

                $paymentRecord->update([
                    'remaining_balance' => max(0, $newBalance)
                ]);
            } elseif ($validated['payment_type'] === 'renewal') {
                if (!$deceased->is_fully_paid) {
                    return back()->withErrors(['error' => 'Cannot process renewal. Initial payment must be fully paid first.']);
                }

                $deceased->update([
                    'payment_status' => 'paid',
                    'payment_due_date' => $coverageEndDate,
                    'last_payment_date' => $validated['payment_date']
                ]);

                RenewalRecord::create([
                    'deceased_record_id' => $validated['deceased_record_id'],
                    'renewal_date' => $validated['payment_date'],
                    'next_renewal_date' => $coverageEndDate,
                    'renewal_fee' => $validated['amount'],
                    'total_amount_due' => $validated['amount'],
                    'amount_paid' => $validated['amount'],
                    'balance' => 0,
                    'is_fully_paid' => true,
                    'payment_status' => 'paid',
                    'status' => 'active',
                    'processed_by' => Auth::id(),
                    'remarks' => $validated['remarks']
                ]);
            }

            DB::commit();

            $message = 'Payment recorded successfully. Receipt #: ' . $paymentRecord->receipt_number;
            if ($deceased->balance > 0) {
                $message .= ' | Remaining Balance: ₱' . number_format($deceased->balance, 2);
            } else {
                $message .= ' | FULLY PAID - Coverage active until ' . date('M d, Y', strtotime($coverageEndDate));
            }

            return redirect()->route('payments.index')->with('success', $message);
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
