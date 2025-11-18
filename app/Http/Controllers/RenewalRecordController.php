<?php

namespace App\Http\Controllers;

use App\Models\RenewalRecord;
use App\Models\DeceasedRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RenewalRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = RenewalRecord::with(['deceasedRecord', 'processor'])
            ->orderBy('renewal_date', 'desc');

        // Filter by status
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        // Search by deceased name
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->whereHas('deceasedRecord', function($q) use ($search) {
                $q->where('fullname', 'like', "%{$search}%")
                  ->orWhere('tomb_number', 'like', "%{$search}%");
            });
        }

        $renewals = $query->paginate(10)->withQueryString();

        return Inertia::render('RenewalRecords/Index', [
            'renewals' => $renewals,
            'filters' => $request->only(['search', 'status'])
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

        return Inertia::render('RenewalRecords/Create', [
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
            'renewal_date' => 'required|date',
            'next_renewal_date' => 'required|date|after:renewal_date',
            'renewal_fee' => 'required|numeric|min:0',
            'status' => 'required|in:active,expired,pending',
            'remarks' => 'nullable|string',
        ]);

        $validated['processed_by'] = Auth::id();

        RenewalRecord::create($validated);

        return redirect()->route('renewals.index')
            ->with('success', 'Renewal record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(RenewalRecord $renewal)
    {
        $renewal->load(['deceasedRecord', 'processor']);

        return Inertia::render('RenewalRecords/Show', [
            'renewal' => $renewal
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RenewalRecord $renewal)
    {
        $deceasedRecords = DeceasedRecord::orderBy('fullname')->get();

        return Inertia::render('RenewalRecords/Edit', [
            'renewal' => $renewal,
            'deceasedRecords' => $deceasedRecords
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RenewalRecord $renewal)
    {
        $validated = $request->validate([
            'renewal_date' => 'required|date',
            'next_renewal_date' => 'required|date|after:renewal_date',
            'renewal_fee' => 'required|numeric|min:0',
            'status' => 'required|in:active,expired,pending',
            'remarks' => 'nullable|string',
        ]);

        $renewal->update($validated);

        return redirect()->route('renewals.index')
            ->with('success', 'Renewal record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RenewalRecord $renewal)
    {
        $renewal->delete();

        return redirect()->route('renewals.index')
            ->with('success', 'Renewal record deleted successfully.');
    }
}
