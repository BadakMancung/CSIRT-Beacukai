<?php

namespace App\Models;

use App\Services\SpreadsheetService;
use Illuminate\Database\Eloquent\Model as EloquentModel;
use Illuminate\Support\Collection;
use Carbon\Carbon;

abstract class BaseModel
{
    protected $fillable = [];
    protected $casts = [];
    protected $filename;
    protected $spreadsheetService;
    
    public function __construct()
    {
        if ($this->useSpreadsheet()) {
            $this->spreadsheetService = new SpreadsheetService();
            $this->initializeSpreadsheet();
        }
    }

    protected function useSpreadsheet(): bool
    {
        return config('app.storage_driver') === 'spreadsheet';
    }

    protected function initializeSpreadsheet(): void
    {
        if ($this->filename && $this->spreadsheetService) {
            $headers = array_merge(['id'], $this->fillable, ['created_at', 'updated_at']);
            $this->spreadsheetService->initializeFile($this->filename, $headers);
        }
    }

    public static function all(): Collection
    {
        $instance = new static();
        
        if ($instance->useSpreadsheet()) {
            return $instance->spreadsheetService->read($instance->filename)->map(function ($row) use ($instance) {
                return $instance->castAttributes($row);
            });
        } else {
            // Use Eloquent
            return collect(static::getEloquentModel()::all()->toArray());
        }
    }

    public static function find($id)
    {
        $instance = new static();
        
        if ($instance->useSpreadsheet()) {
            $data = $instance->spreadsheetService->find($instance->filename, $id);
            return $data ? $instance->castAttributes($data) : null;
        } else {
            return static::getEloquentModel()::find($id);
        }
    }

    public static function create(array $attributes)
    {
        $instance = new static();
        
        if ($instance->useSpreadsheet()) {
            // Add timestamps
            $attributes['created_at'] = now()->toDateTimeString();
            $attributes['updated_at'] = now()->toDateTimeString();
            
            // Convert boolean to string for CSV
            foreach ($instance->casts as $key => $type) {
                if ($type === 'boolean' && isset($attributes[$key])) {
                    $attributes[$key] = $attributes[$key] ? '1' : '0';
                }
            }
            
            if ($instance->spreadsheetService->append($instance->filename, $attributes)) {
                return $instance->castAttributes($attributes);
            }
            
            return false;
        } else {
            return static::getEloquentModel()::create($attributes);
        }
    }

    public function update(array $attributes)
    {
        if ($this->useSpreadsheet()) {
            $attributes['updated_at'] = now()->toDateTimeString();
            
            // Convert boolean to string for CSV
            foreach ($this->casts as $key => $type) {
                if ($type === 'boolean' && isset($attributes[$key])) {
                    $attributes[$key] = $attributes[$key] ? '1' : '0';
                }
            }
            
            return $this->spreadsheetService->update($this->filename, $this->id, $attributes);
        } else {
            return static::getEloquentModel()::find($this->id)->update($attributes);
        }
    }

    public function delete()
    {
        if ($this->useSpreadsheet()) {
            return $this->spreadsheetService->delete($this->filename, $this->id);
        } else {
            return static::getEloquentModel()::find($this->id)->delete();
        }
    }

    public static function latest($column = 'created_at'): Collection
    {
        $instance = new static();
        
        if ($instance->useSpreadsheet()) {
            return static::all()->sortByDesc($column)->values();
        } else {
            return collect(static::getEloquentModel()::latest($column)->get()->toArray());
        }
    }

    public static function where($column, $operator, $value = null): Collection
    {
        $instance = new static();
        
        if (func_num_args() == 2) {
            $value = $operator;
            $operator = '=';
        }
        
        if ($instance->useSpreadsheet()) {
            return static::all()->filter(function ($item) use ($column, $operator, $value) {
                $itemValue = $item[$column] ?? null;
                
                switch ($operator) {
                    case '=':
                    case '==':
                        return $itemValue == $value;
                    case '!=':
                    case '<>':
                        return $itemValue != $value;
                    case '>':
                        return $itemValue > $value;
                    case '>=':
                        return $itemValue >= $value;
                    case '<':
                        return $itemValue < $value;
                    case '<=':
                        return $itemValue <= $value;
                    case 'like':
                        return str_contains(strtolower($itemValue), strtolower($value));
                    default:
                        return false;
                }
            })->values();
        } else {
            return collect(static::getEloquentModel()::where($column, $operator, $value)->get()->toArray());
        }
    }

    protected function castAttributes(array $attributes): array
    {
        foreach ($this->casts as $key => $type) {
            if (isset($attributes[$key])) {
                switch ($type) {
                    case 'boolean':
                        $attributes[$key] = (bool) $attributes[$key];
                        break;
                    case 'datetime':
                        if ($attributes[$key]) {
                            $attributes[$key] = Carbon::parse($attributes[$key]);
                        }
                        break;
                }
            }
        }
        
        // Cast standard timestamps
        if (isset($attributes['created_at'])) {
            $attributes['created_at'] = Carbon::parse($attributes['created_at']);
        }
        
        if (isset($attributes['updated_at'])) {
            $attributes['updated_at'] = Carbon::parse($attributes['updated_at']);
        }
        
        return $attributes;
    }

    // Abstract method that each model must implement
    abstract protected static function getEloquentModel(): string;
}
