<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudyProgram extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'status',
        'icon',
        'academic_degree',
        'short_description',
        'detailed_description',
        'career_prospects',
    ];

    protected function casts(): array
    {
        return [
            'career_prospects' => 'array',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(StudyProgramCategory::class, 'category_id');
    }
}
