<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PsychometricTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'gform_url',
        'spreadsheet_url',
        'estimated_minutes',
        'order_num',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'estimated_minutes' => 'integer',
            'order_num' => 'integer',
        ];
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(RiasecAssessment::class, 'psychometric_test_id');
    }
}
