<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'deceased_record_id',
        'amount',
        'payment_date',
        'payment_type',
        'payment_method',
        'receipt_number',
        'official_receipt_number',
        'remarks',
        'received_by',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function deceasedRecord()
    {
        return $this->belongsTo(DeceasedRecord::class);
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'received_by');
    }
}
