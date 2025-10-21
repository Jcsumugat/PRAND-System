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
        'status',
        'processed_by',
        'remarks',
    ];

    protected $casts = [
        'renewal_date' => 'date',
        'next_renewal_date' => 'date',
        'renewal_fee' => 'decimal:2',
    ];

    public function deceasedRecord()
    {
        return $this->belongsTo(DeceasedRecord::class);
    }

    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
