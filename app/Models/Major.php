<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Major extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'group',
        'category',
        'category_id',
        'jenjang',
        'title',
        'teaser',
        'description',
        'study_activities',
        'career_prospects',
    ];

    protected function casts(): array
    {
        return [
            'study_activities' => 'array',
            'career_prospects' => 'array',
        ];
    }

    public function majorCategory(): BelongsTo
    {
        return $this->belongsTo(MajorCategory::class, 'category_id');
    }
}
