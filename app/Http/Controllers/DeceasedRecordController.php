<?php

namespace App\Http\Controllers;

use App\Models\DeceasedRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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
            $query->where(function($q) use ($search) {
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('DeceasedRecords/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
            'birthday' => 'required|date|before:today',
            'date_of_death' => 'required|date|after_or_equal:birthday|before_or_equal:today',
            'tomb_number' => 'required|string|unique:deceased_records,tomb_number',
            'tomb_location' => 'required|string|max:255',
            'next_of_kin_name' => 'required|string|max:255',
            'next_of_kin_relationship' => 'nullable|string|max:100',
            'contact_number' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'payment_due_date' => 'nullable|date',
            'payment_status' => 'required|in:paid,pending,overdue',
        ]);

        $validated['created_by'] = Auth::id();

        DeceasedRecord::create($validated);

        return redirect()->route('deceased.index')
            ->with('success', 'Deceased record created successfully.');
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, DeceasedRecord $deceased)
    {
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
            'birthday' => 'required|date|before:today',
            'date_of_death' => 'required|date|after_or_equal:birthday|before_or_equal:today',
            'tomb_number' => 'required|string|unique:deceased_records,tomb_number,' . $deceased->id,
            'tomb_location' => 'required|string|max:255',
            'next_of_kin_name' => 'required|string|max:255',
            'next_of_kin_relationship' => 'nullable|string|max:100',
            'contact_number' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'payment_due_date' => 'nullable|date',
            'payment_status' => 'required|in:paid,pending,overdue',
        ]);

        $validated['updated_by'] = Auth::id();

        $deceased->update($validated);

        return redirect()->route('deceased.index')
            ->with('success', 'Deceased record updated successfully.');
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
