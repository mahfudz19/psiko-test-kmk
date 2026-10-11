<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'registration_id',
        'name',
        'email',
        'personal_email',
        'password',
        'google_id',
        'role',
        'school',
        'phone',
        'npsn',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function riasecAssessments(): HasMany
    {
        return $this->hasMany(RiasecAssessment::class);
    }

    public function mentorBookings(): HasMany
    {
        return $this->hasMany(MentorBooking::class, 'student_id');
    }

    public function mentor(): HasOne
    {
        return $this->hasOne(Mentor::class);
    }
}
