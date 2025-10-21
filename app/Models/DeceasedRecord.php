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
    ];

    protected $casts = [
        'birthday' => 'date',
        'date_of_death' => 'date',
        'payment_due_date' => 'date',
    ];

    public function paymentRecords()
    {
        return $this->hasMany(PaymentRecord::class);
    }

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
}
