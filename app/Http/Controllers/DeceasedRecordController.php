<?php

namespace App\Http\Controllers;

use App\Models\DeceasedRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class DeceasedRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DeceasedRecord::with(['creator', 'paymentRecords', 'renewalRecords'])
            ->orderBy('created_at', 'desc');

        // Search functionality
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('fullname', 'like', "%{$search}%")
                    ->orWhere('next_of_kin_name', 'like', "%{$search}%")
                    ->orWhere('tomb_number', 'like', "%{$search}%")
                    ->orWhere('tomb_location', 'like', "%{$search}%");
            });
        }

        // Filter by payment status
        if ($request->has('status') && $request->status != '') {
            $query->where('payment_status', $request->status);
        }

        $deceased = $query->paginate(10)->withQueryString();

        return Inertia::render('DeceasedRecords/Index', [
            'deceased' => $deceased,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Get tomb availability data for all locations
     */
    private function getTombAvailability()
    {
        $locations = [
            'North East A',
            'North East B',
            'North West A',
            'North West B',
            'South East A',
            'South East B',
            'South West A',
            'South West B',
            'Central Area'
        ];

        $tombData = [];

        foreach ($locations as $location) {
            // Get taken tomb numbers for this location
            $takenTombs = DeceasedRecord::where('tomb_location', $location)
                ->whereNull('deleted_at')
                ->pluck('tomb_number')
                ->toArray();

            // Generate all possible tomb numbers (1-100)
            $allTombs = range(1, 100);

            // Convert taken tombs to integers for comparison
            $takenTombsInt = array_map('intval', $takenTombs);

            // Calculate available tombs
            $availableTombs = array_diff($allTombs, $takenTombsInt);

            $tombData[$location] = [
                'taken' => $takenTombsInt,
                'available' => array_values($availableTombs),
                'total' => 100,
                'taken_count' => count($takenTombsInt),
                'available_count' => count($availableTombs)
            ];
        }

        return $tombData;
    }

    /**
     * Show the form for creating a new resource.
     * Note: Registration now requires payment first - redirect to payment page
     */
    public function create()
    {
        return Inertia::render('DeceasedRecords/Create', [
            'requiresPayment' => true,
            'standardAmount' => 5000.00,
            'renewalYears' => 5,
            'tombAvailability' => $this->getTombAvailability()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
            'birthday' => 'required|date|before:today',
            'date_of_death' => 'required|date|after_or_equal:birthday|before_or_equal:today',
            'date_of_burial' => 'required|date|after_or_equal:date_of_death|before_or_equal:today',
            'tomb_location' => 'required|string|max:255',
            'tomb_number' => [
                'required',
                'string',
                Rule::unique('deceased_records', 'tomb_number')
                    ->where('tomb_location', $request->tomb_location)
                    ->whereNull('deleted_at')
            ],
            'next_of_kin_name' => 'required|string|max:255',
            'next_of_kin_relationship' => 'nullable|string|max:100',
            'contact_number' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
        ], [
            'tomb_number.unique' => 'This tomb number is already taken in the selected location.'
        ]);

        $validated['payment_status'] = 'pending';
        $validated['total_amount_due'] = 5000.00;
        $validated['amount_paid'] = 0;
        $validated['balance'] = 5000.00;
        $validated['is_fully_paid'] = false;
        $validated['created_by'] = Auth::id();

        $validated['payment_due_date'] = date('Y-m-d', strtotime($validated['date_of_burial'] . ' +5 years'));

        $deceased = DeceasedRecord::create($validated);

        return redirect()->route('payments.create', ['deceased_id' => $deceased->id])
            ->with('info', 'Deceased registered. Please make a payment. Minimum: ₱2,500.00, Full amount: ₱5,000.00 for 5 years coverage.');
    }

    public function update(Request $request, DeceasedRecord $deceased)
    {
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
            'birthday' => 'required|date|before:today',
            'date_of_death' => 'required|date|after_or_equal:birthday|before_or_equal:today',
            'date_of_burial' => 'required|date|after_or_equal:date_of_death|before_or_equal:today',
            'tomb_location' => 'required|string|max:255',
            'tomb_number' => [
                'required',
                'string',
                Rule::unique('deceased_records', 'tomb_number')
                    ->where('tomb_location', $request->tomb_location)
                    ->whereNull('deleted_at')
                    ->ignore($deceased->id)
            ],
            'next_of_kin_name' => 'required|string|max:255',
            'next_of_kin_relationship' => 'nullable|string|max:100',
            'contact_number' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'payment_due_date' => 'nullable|date',
        ], [
            'tomb_number.unique' => 'This tomb number is already taken in the selected location.'
        ]);

        $validated['updated_by'] = Auth::id();

        $deceased->update($validated);

        return redirect()->route('deceased.index')
            ->with('success', 'Deceased record updated successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(DeceasedRecord $deceased)
    {
        $deceased->load(['creator', 'updater', 'paymentRecords.receiver', 'renewalRecords.processor', 'noticeDistributions']);

        return Inertia::render('DeceasedRecords/Show', [
            'deceased' => $deceased
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DeceasedRecord $deceased)
    {
        return Inertia::render('DeceasedRecords/Edit', [
            'deceased' => $deceased
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeceasedRecord $deceased)
    {
        $deceased->delete();

        return redirect()->route('deceased.index')
            ->with('success', 'Deceased record deleted successfully.');
    }
}