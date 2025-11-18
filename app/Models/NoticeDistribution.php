<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NoticeDistribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'deceased_record_id',
        'recipient_name',
        'recipient_number',
        'message',
        'notice_type',
        'status',
        'sent_at',
        'delivered_at',
        'error_message',
        'retry_count',
        'sent_by',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function deceasedRecord()
    {
        return $this->belongsTo(DeceasedRecord::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sent_by');
    }
}
