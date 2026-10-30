<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scholarship extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'organizer',
        'tag',
        'tag_color',
        'border_color',
        'quota',
        'image',
        'summary_benefits',
        'benefits',
        'requirements',
        'documents',
        'deadline',
        'status',
        'link_url',
    ];

    public function category()
    {
        return $this->belongsTo(ScholarshipCategory::class, 'category_id');
    }

    protected $appends = [
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'summary_benefits' => 'array',
            'benefits' => 'array',
            'requirements' => 'array',
            'documents' => 'array',
        ];
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (empty($this->image)) {
                    return null;
                }
                if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://') || str_starts_with($this->image, '/')) {
                    return $this->image;
                }
                return '/storage/' . ltrim($this->image, '/');
            }
        );
    }
}
