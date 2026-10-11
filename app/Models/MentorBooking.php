<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MentorBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'mentor_id',
        'booking_date',
        'booking_time',
        'topic',
        'status',
    ];

    protected $casts = [
        'booking_date' => 'date:Y-m-d',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(Mentor::class);
    }
}
