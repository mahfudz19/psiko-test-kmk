<?php

namespace App\Models;

use Carbon\Carbon;
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

    public static function rejectExpiredPendingBookings(): void
    {
        $nowWita = Carbon::now('Asia/Makassar');

        static::where('status', 'pending')
            ->whereDate('booking_date', '<=', $nowWita->toDateString())
            ->get()
            ->each(function (self $booking) use ($nowWita) {
                $dateStr = $booking->booking_date instanceof Carbon
                    ? $booking->booking_date->format('Y-m-d')
                    : substr((string) $booking->booking_date, 0, 10);
                $timeStr = substr((string) $booking->booking_time, 0, 5);

                try {
                    $bookingAt = Carbon::createFromFormat('Y-m-d H:i', "{$dateStr} {$timeStr}", 'Asia/Makassar');
                    if ($bookingAt->lt($nowWita)) {
                        $booking->update(['status' => 'rejected']);
                    }
                } catch (\Throwable $e) {
                }
            });
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(Mentor::class);
    }
}
