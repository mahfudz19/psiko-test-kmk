<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'type',
        'title',
        'slug',
        'excerpt',
        'content',
        'image',
        'author',
        'read_time',
        'event_date',
        'event_time',
        'event_link',
        'badge_label',
        'status',
        'published_at',
    ];

    protected $appends = [
        'image_url',
        'formatted_date',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(PostCategory::class, 'category_id');
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

    protected function formattedDate(): Attribute
    {
        return Attribute::make(
            get: function () {
                $target = $this->published_at ?: $this->created_at;
                if (!$target) return '';
                $months = [
                    1 => 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
                ];
                $d = \Carbon\Carbon::parse($target);
                return $d->day . ' ' . ($months[$d->month] ?? $d->format('M')) . ' ' . $d->year;
            }
        );
    }
}
