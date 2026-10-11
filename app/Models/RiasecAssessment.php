<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiasecAssessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'psychometric_test_id',
        'score_r',
        'score_i',
        'score_a',
        'score_s',
        'score_e',
        'score_c',
        'dominant_code',
        'status',
        'mentor_name',
        'class_name',
        'attendance_number',
        'answers',
    ];

    protected $casts = [
        'answers' => 'array',
        'score_r' => 'integer',
        'score_i' => 'integer',
        'score_a' => 'integer',
        'score_s' => 'integer',
        'score_e' => 'integer',
        'score_c' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function psychometricTest(): BelongsTo
    {
        return $this->belongsTo(PsychometricTest::class, 'psychometric_test_id');
    }
}
