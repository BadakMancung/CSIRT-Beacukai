<?php

namespace App\Models;

use Carbon\Carbon;

class Article extends BaseModel
{
    protected $filename = 'articles';
    
    protected $fillable = [
        'title',
        'excerpt',
        'content',
        'image',
        'image_url',
        'author',
        'is_published',
        'published_at'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_published' => 'boolean'
    ];

    // Accessor to handle both image and image_url fields
    public function getImageAttribute($value)
    {
        // If image field exists, use it. Otherwise fallback to image_url
        return $value ?: ($this->attributes['image_url'] ?? null);
    }

    public static function published()
    {
        $instance = new static();
        
        if ($instance->useSpreadsheet()) {
            return static::all()->filter(function ($article) {
                return $article['is_published'] === true;
            });
        } else {
            return collect(static::getEloquentModel()::published()->get()->toArray());
        }
    }

    protected static function getEloquentModel(): string
    {
        return \App\Models\Eloquent\Article::class;
    }
}
