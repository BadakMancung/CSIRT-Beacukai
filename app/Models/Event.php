<?php

namespace App\Models;

use Carbon\Carbon;

class Event extends BaseModel
{
    protected $filename = 'events';
    
    protected $fillable = [
        'title',
        'description',
        'content',
        'image',
        'location',
        'event_date',
        'event_end_date',
        'is_published'
    ];

    protected $casts = [
        'event_date' => 'datetime',
        'event_end_date' => 'datetime',
        'is_published' => 'boolean'
    ];

    public static function published()
    {
        $instance = new static();
        
        if ($instance->useSpreadsheet()) {
            return static::all()->filter(function ($event) {
                return $event['is_published'] === true;
            });
        } else {
            return collect(static::getEloquentModel()::published()->get()->toArray());
        }
    }

    public static function upcoming()
    {
        $instance = new static();
        
        if ($instance->useSpreadsheet()) {
            return static::all()->filter(function ($event) {
                return Carbon::parse($event['event_date'])->isFuture();
            });
        } else {
            return collect(static::getEloquentModel()::upcoming()->get()->toArray());
        }
    }

    public static function past()
    {
        $instance = new static();
        
        if ($instance->useSpreadsheet()) {
            return static::all()->filter(function ($event) {
                return Carbon::parse($event['event_date'])->isPast();
            });
        } else {
            return collect(static::getEloquentModel()::past()->get()->toArray());
        }
    }

    protected static function getEloquentModel(): string
    {
        return \App\Models\Eloquent\Event::class;
    }
}
