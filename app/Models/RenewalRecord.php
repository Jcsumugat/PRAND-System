<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RenewalRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'deceased_record_id',
        'renewal_date',
        'next_renewal_date',
        'renewal_fee',
        'total_amount_due',
        'amount_paid',
        'balance',
        'is_fully_paid',
        'payment_status',
        'status',
        'processed_by',
        'remarks',
    ];

    protected $casts = [
        'renewal_date' => 'date',
        'next_renewal_date' => 'date',
        'renewal_fee' => 'decimal:2',
        'total_amount_due' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'balance' => 'decimal:2',
        'is_fully_paid' => 'boolean',
    ];

    public function deceased_record()
    {
        return $this->belongsTo(DeceasedRecord::class);
    }

    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}