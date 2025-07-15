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

    /**
     * Override castAttributes to handle date parsing errors
     */
    protected function castAttributes(array $attributes): array
    {
        foreach ($this->casts as $key => $type) {
            if (isset($attributes[$key])) {
                try {
                    if ($type === 'datetime') {
                        // Handle datetime casting with better error handling
                        if (empty($attributes[$key]) || is_null($attributes[$key])) {
                            $attributes[$key] = null;
                        } else {
                            // Check if it's not a valid date string before parsing
                            $dateValue = $attributes[$key];
                            
                            // Skip if it looks like location or other non-date string
                            if (is_string($dateValue) && 
                                (strlen($dateValue) > 30 || 
                                 preg_match('/[a-zA-Z]{4,}/', $dateValue) && 
                                 !preg_match('/\d{4}-\d{2}-\d{2}/', $dateValue))) {
                                \Log::warning("Skipping invalid date value for $key: " . $dateValue);
                                $attributes[$key] = null;
                                continue;
                            }
                            
                            $attributes[$key] = Carbon::parse($dateValue);
                        }
                    } elseif ($type === 'boolean') {
                        $attributes[$key] = filter_var($attributes[$key], FILTER_VALIDATE_BOOLEAN);
                    }
                } catch (\Exception $e) {
                    \Log::warning("Failed to cast attribute $key with value: " . $attributes[$key] . " - " . $e->getMessage());
                    // Set to null or default value on casting error
                    if ($type === 'datetime') {
                        $attributes[$key] = null;
                    } elseif ($type === 'boolean') {
                        $attributes[$key] = false;
                    }
                }
            }
        }

        return $attributes;
    }

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
