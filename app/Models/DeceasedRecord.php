<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeceasedRecord extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'fullname',
        'birthday',
        'date_of_death',
        'date_of_burial',
        'tomb_number',
        'tomb_location',
        'next_of_kin_name',
        'next_of_kin_relationship',
        'contact_number',
        'email',
        'address',
        'payment_due_date',
        'payment_status',
        'created_by',
        'updated_by',
        'total_amount_due',
        'amount_paid',
        'balance',
        'is_fully_paid',
        'last_payment_date',
    ];

    protected $casts = [
        'birthday' => 'date',
        'date_of_death' => 'date',
        'date_of_burial' => 'date',
        'payment_due_date' => 'date',
    ];

    public function renewalRecords()
    {
        return $this->hasMany(RenewalRecord::class);
    }

    public function noticeDistributions()
    {
        return $this->hasMany(NoticeDistribution::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function paymentRecords()
    {
        return $this->hasMany(PaymentRecord::class, 'deceased_record_id');
    }

    public function isRenewalApproaching()
    {
        if (!$this->payment_due_date || !$this->is_fully_paid) {
            return false;
        }
        
        $twoMonthsBefore = date('Y-m-d', strtotime($this->payment_due_date . ' -2 months'));
        $today = date('Y-m-d');
        
        return $today >= $twoMonthsBefore && $today <= $this->payment_due_date;
    }

    public function daysUntilRenewal()
    {
        if (!$this->payment_due_date) {
            return null;
        }
        
        $today = new \DateTime();
        $dueDate = new \DateTime($this->payment_due_date);
        $diff = $today->diff($dueDate);
        
        return $diff->days * ($diff->invert ? -1 : 1);
    }

    public function isOverdue()
    {
        if (!$this->payment_due_date) {
            return false;
        }
        
        return date('Y-m-d') > $this->payment_due_date;
    }
}