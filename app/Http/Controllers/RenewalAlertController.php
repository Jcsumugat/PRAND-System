<?php

namespace App\Http\Controllers;

use App\Models\DeceasedRecord;
use Illuminate\Http\Request;

class RenewalAlertController extends Controller
{
    public function getUpcomingRenewals()
    {
        $twoMonthsFromNow = date('Y-m-d', strtotime('+2 months'));
        $today = date('Y-m-d');
        
        $upcomingRenewals = DeceasedRecord::where('is_fully_paid', true)
            ->whereNotNull('payment_due_date')
            ->where('payment_due_date', '>=', $today)
            ->where('payment_due_date', '<=', $twoMonthsFromNow)
            ->with(['creator'])
            ->orderBy('payment_due_date', 'asc')
            ->get()
            ->map(function($deceased) {
                $daysUntil = $deceased->daysUntilRenewal();
                return [
                    'id' => $deceased->id,
                    'fullname' => $deceased->fullname,
                    'tomb_number' => $deceased->tomb_number,
                    'tomb_location' => $deceased->tomb_location,
                    'next_of_kin_name' => $deceased->next_of_kin_name,
                    'contact_number' => $deceased->contact_number,
                    'payment_due_date' => $deceased->payment_due_date,
                    'days_until_renewal' => $daysUntil,
                    'date_of_burial' => $deceased->date_of_burial,
                    'alert_level' => $daysUntil <= 7 ? 'critical' : ($daysUntil <= 30 ? 'warning' : 'info')
                ];
            });
        
        return response()->json([
            'upcoming_renewals' => $upcomingRenewals,
            'total_count' => $upcomingRenewals->count()
        ]);
    }
    
    public function getOverdueRenewals()
    {
        $today = date('Y-m-d');
        
        $overdueRenewals = DeceasedRecord::where('is_fully_paid', true)
            ->whereNotNull('payment_due_date')
            ->where('payment_due_date', '<', $today)
            ->with(['creator'])
            ->orderBy('payment_due_date', 'asc')
            ->get()
            ->map(function($deceased) {
                $daysOverdue = abs($deceased->daysUntilRenewal());
                return [
                    'id' => $deceased->id,
                    'fullname' => $deceased->fullname,
                    'tomb_number' => $deceased->tomb_number,
                    'tomb_location' => $deceased->tomb_location,
                    'next_of_kin_name' => $deceased->next_of_kin_name,
                    'contact_number' => $deceased->contact_number,
                    'payment_due_date' => $deceased->payment_due_date,
                    'days_overdue' => $daysOverdue,
                    'date_of_burial' => $deceased->date_of_burial,
                ];
            });
        
        return response()->json([
            'overdue_renewals' => $overdueRenewals,
            'total_count' => $overdueRenewals->count()
        ]);
    }
}