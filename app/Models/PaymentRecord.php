<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class PaymentRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'deceased_record_id',
        'amount',
        'payment_date',
        'payment_type',
        'payment_for',
        'coverage_status',
        'coverage_start_date',
        'coverage_end_date',
        'previous_balance',
        'remaining_balance',
        'payment_method',
        'receipt_number',
        'official_receipt_number',
        'remarks',
        'received_by',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'coverage_start_date' => 'date',
        'coverage_end_date' => 'date',
    ];

    public function deceased_record()
    {
        return $this->belongsTo(DeceasedRecord::class);
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    /**
     * Check if coverage has expired (5 years passed)
     */
    public function isCoverageExpired()
    {
        if (!$this->coverage_end_date) {
            return false;
        }
        return Carbon::parse($this->coverage_end_date)->isPast();
    }

    /**
     * Get days until coverage expires
     */
    public function daysUntilCoverageExpires()
    {
        if (!$this->coverage_end_date) {
            return null;
        }
        return Carbon::now()->diffInDays(Carbon::parse($this->coverage_end_date), false);
    }

    /**
     * Check if coverage is expiring soon (within 2 months)
     */
    public function isCoverageExpiringSoon()
    {
        if (!$this->coverage_end_date) {
            return false;
        }
        $daysUntil = $this->daysUntilCoverageExpires();
        return $daysUntil !== null && $daysUntil <= 60 && $daysUntil > 0;
    }
}