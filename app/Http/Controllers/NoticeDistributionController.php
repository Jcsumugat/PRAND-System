<?php

namespace App\Http\Controllers;

use App\Models\NoticeDistribution;
use App\Models\DeceasedRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class NoticeDistributionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = NoticeDistribution::with(['deceasedRecord', 'sender'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        // Filter by notice type
        if ($request->has('type') && $request->type != '') {
            $query->where('notice_type', $request->type);
        }

        // Search
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('recipient_name', 'like', "%{$search}%")
                  ->orWhere('recipient_number', 'like', "%{$search}%")
                  ->orWhereHas('deceasedRecord', function($q) use ($search) {
                      $q->where('fullname', 'like', "%{$search}%");
                  });
            });
        }

        $notices = $query->paginate(10)->withQueryString();

        return Inertia::render('NoticeDistributions/Index', [
            'notices' => $notices,
            'filters' => $request->only(['search', 'status', 'type'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $deceasedRecords = DeceasedRecord::with('noticeDistributions')->orderBy('fullname')->get();
        $selectedDeceased = null;

        if ($request->has('deceased_id')) {
            $selectedDeceased = DeceasedRecord::find($request->deceased_id);
        }

        return Inertia::render('NoticeDistributions/Create', [
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
            'recipient_name' => 'required|string|max:255',
            'recipient_number' => 'required|string|max:20',
            'message' => 'required|string',
            'notice_type' => 'required|in:payment_reminder,renewal_notice,overdue_notice,general',
        ]);

        $validated['status'] = 'pending';
        $validated['sent_by'] = Auth::id();

        $notice = NoticeDistribution::create($validated);

        // TODO: Integrate SMS API here
        // For now, we'll just mark it as sent
        $notice->update([
            'status' => 'sent',
            'sent_at' => now()
        ]);

        return redirect()->route('notices.index')
            ->with('success', 'Notice created and sent successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(NoticeDistribution $notice)
    {
        $notice->load(['deceasedRecord', 'sender']);

        return Inertia::render('NoticeDistributions/Show', [
            'notice' => $notice
        ]);
    }

    /**
     * Resend a failed notice.
     */
    public function resend(NoticeDistribution $notice)
    {
        if ($notice->status !== 'failed') {
            return back()->with('error', 'Only failed notices can be resent.');
        }

        // TODO: Integrate SMS API here
        $notice->update([
            'status' => 'sent',
            'sent_at' => now(),
            'retry_count' => $notice->retry_count + 1
        ]);

        return back()->with('success', 'Notice resent successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NoticeDistribution $notice)
    {
        $notice->delete();

        return redirect()->route('notices.index')
            ->with('success', 'Notice deleted successfully.');
    }
}
