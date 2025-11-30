<?php

namespace App\Http\Controllers;

use App\Models\NoticeDistribution;
use App\Services\SmsService;
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
            $query->where(function ($q) use ($search) {
                $q->where('recipient_name', 'like', "%{$search}%")
                    ->orWhere('recipient_number', 'like', "%{$search}%")
                    ->orWhereHas('deceasedRecord', function ($q) use ($search) {
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
        // Load deceased records with necessary payment information
        $deceasedRecords = DeceasedRecord::with('noticeDistributions')
            ->select([
                'id',
                'fullname',
                'tomb_number',
                'next_of_kin_name',
                'contact_number',
                'payment_status',
                'balance',
                'total_amount_due',
                'payment_due_date',
            ])
            ->orderBy('fullname')
            ->get();
        
        $selectedDeceased = null;

        if ($request->has('deceased_id')) {
            $selectedDeceased = DeceasedRecord::select([
                'id',
                'fullname',
                'tomb_number',
                'next_of_kin_name',
                'contact_number',
                'payment_status',
                'balance',
                'total_amount_due',
                'payment_due_date',
            ])->find($request->deceased_id);
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
            'notice_type' => 'required|in:payment_reminder,renewal_notice,overdue_notice,general',
            'message' => 'required|string|max:1000',
            'recipient_name' => 'nullable|string|max:255',
            'recipient_number' => 'nullable|string|max:20',
        ]);

        $deceased = DeceasedRecord::findOrFail($validated['deceased_record_id']);

        // Use provided recipient info or fall back to deceased record data
        $recipientName = $validated['recipient_name'] ?? $deceased->next_of_kin_name;
        $recipientNumber = $validated['recipient_number'] ?? $deceased->contact_number;

        // Validate that we have required contact information
        if (empty($recipientNumber)) {
            return back()->withErrors([
                'recipient_number' => 'Recipient phone number is required.'
            ])->withInput();
        }

        // Create the notice record
        $notice = NoticeDistribution::create([
            'deceased_record_id' => $validated['deceased_record_id'],
            'notice_type' => $validated['notice_type'],
            'message' => $validated['message'],
            'recipient_name' => $recipientName,
            'recipient_number' => $recipientNumber,
            'sent_by' => Auth::id(),
            'status' => 'pending',
        ]);

        // Send the SMS
        $smsService = new SmsService();
        $result = $smsService->send($recipientNumber, $validated['message']);

        if ($result['success']) {
            $notice->update([
                'status' => 'sent',
                'sent_at' => now()
            ]);

            return redirect()->route('notices.index')
                ->with('success', "Notice sent successfully to {$recipientName} ({$recipientNumber})");
        } else {
            $notice->update([
                'status' => 'failed',
                'error_message' => $result['error']
            ]);

            return redirect()->route('notices.index')
                ->with('error', 'Failed to send SMS: ' . $result['error']);
        }
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

        $smsService = new SmsService();
        $result = $smsService->send($notice->recipient_number, $notice->message);

        if ($result['success']) {
            $notice->update([
                'status' => 'sent',
                'sent_at' => now(),
                'retry_count' => $notice->retry_count + 1,
                'error_message' => null
            ]);

            return back()->with('success', 'Notice resent successfully.');
        } else {
            $notice->update([
                'retry_count' => $notice->retry_count + 1,
                'error_message' => $result['error']
            ]);

            return back()->with('error', 'Failed to resend notice: ' . $result['error']);
        }
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