<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PmbQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'question_text',
        'options',
        'correct_answer',
    ];

    protected $casts = [
        'options' => 'array',
        'correct_answer' => 'integer',
    ];
}
