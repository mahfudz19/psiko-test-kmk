<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ScholarshipCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'badge_color',
    ];

    public function scholarships(): HasMany
    {
        return $this->hasMany(Scholarship::class, 'category_id');
    }
}
