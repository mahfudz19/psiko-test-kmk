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
        'test_type',
        'score_r',
        'score_i',
        'score_a',
        'score_s',
        'score_e',
        'score_c',
        'dominant_code',
        'primary_result',
        'dimension_scores',
        'status',
        'mentor_name',
        'answers',
        'raw_answers',
        'interpretation',
        'completed_at',
    ];

    protected $casts = [
        'answers' => 'array',
        'raw_answers' => 'array',
        'dimension_scores' => 'array',
        'interpretation' => 'array',
        'completed_at' => 'datetime',
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
