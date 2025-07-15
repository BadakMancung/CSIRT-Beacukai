<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Exception;

class SpreadsheetService
{
    protected $basePath = 'spreadsheets';

    public function __construct()
    {
        // Ensure spreadsheets directory exists
        if (!Storage::exists($this->basePath)) {
            Storage::makeDirectory($this->basePath);
        }
    }

    /**
     * Read data directly from Google Sheets (No backup/CSV)
     */
    public function read(string $filename): Collection
    {
        return $this->readFromGoogleSheets($filename);
    }

    /**
     * Add new row directly to Google Sheets (No backup)
     */
    public function append(string $filename, array $data): bool
    {
        // Add ID if not exists
        if (!isset($data['id'])) {
            $data['id'] = time(); // Use timestamp as ID
        }
        
        // Add timestamps
        $data['created_at'] = now()->toDateTimeString();
        $data['updated_at'] = now()->toDateTimeString();
        
        // Send directly to Google Sheets
        return $this->sendToGoogleSheets($filename, 'create', $data);
    }

    /**
     * Update row by ID
     */
    public function update(string $filename, int $id, array $data): bool
    {
        try {
            // Prepare update data with timestamp
            $updateData = array_merge($data, [
                'id' => $id,
                'updated_at' => now()->toDateTimeString()
            ]);
            
            // Send update to Google Sheets first
            $this->sendToGoogleSheets($filename, 'update', $updateData);
            
            // After successful Google Sheets update, refresh local backup from Google Sheets
            $this->refreshLocalBackupFromGoogleSheets($filename);
            
            return true;
        } catch (Exception $e) {
            \Log::warning("Failed to update Google Sheets: " . $e->getMessage());
            
            // Fallback: update local backup only
            $existing = $this->read($filename);
            
            $updated = $existing->map(function ($row) use ($id, $data) {
                if ($row['id'] == $id) {
                    return array_merge($row, $data, ['updated_at' => now()->toDateTimeString()]);
                }
                return $row;
            });

            $this->write($filename, $updated);
            return true;
        }
    }

    /**
     * Delete row by ID
     */
    public function delete(string $filename, int $id): bool
    {
        try {
            // Send delete to Google Sheets first
            $this->sendToGoogleSheets($filename, 'delete', ['id' => $id]);
            
            // After successful Google Sheets delete, refresh local backup from Google Sheets
            $this->refreshLocalBackupFromGoogleSheets($filename);
            
            return true;
        } catch (Exception $e) {
            \Log::warning("Failed to delete from Google Sheets: " . $e->getMessage());
            
            // Fallback: delete from local backup only
            $existing = $this->read($filename);
            $filtered = $existing->reject(function ($row) use ($id) {
                return $row['id'] == $id;
            });
            
            $this->write($filename, $filtered);
            return true;
        }
    }

    /**
     * Find row by ID
     */
    public function find(string $filename, int $id): ?array
    {
        $data = $this->read($filename);
        return $data->firstWhere('id', $id);
    }

    /**
     * Convert array to CSV string
     */
    private function arrayToCsv(array $fields): string
    {
        $csv = fopen('php://temp', 'r+');
        fputcsv($csv, $fields);
        rewind($csv);
        $content = stream_get_contents($csv);
        fclose($csv);
        return trim($content);
    }

    /**
     * Initialize file with headers if not exists
     */
    public function initializeFile(string $filename, array $headers): void
    {
        $filePath = $this->basePath . '/' . $filename . '.csv';
        
        if (!Storage::exists($filePath)) {
            $csv = $this->arrayToCsv($headers);
            Storage::put($filePath, $csv);
        }
    }

    /**
     * Read data from Google Sheets directly
     */
    private function readFromGoogleSheets(string $filename): Collection
    {
        $url = config('services.google_sheets.web_app_url');
        
        if (!$url) {
            throw new Exception('Google Sheets URL not configured');
        }
        
        // Map filename to correct type for Google Sheets
        $typeMap = [
            'articles' => 'article',
            'events' => 'event',
        ];
        
        $type = $typeMap[$filename] ?? $filename;
        
        $postData = json_encode([
            'type' => $type,
            'action' => 'read'
        ]);
        
        \Log::info("🔍 Reading from Google Sheets", [
            'url' => $url,
            'data' => $postData
        ]);
        
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => 'Content-Type: application/json',
                'content' => $postData,
                'timeout' => 30
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ]);
        
        $response = file_get_contents($url, false, $context);
        
        \Log::info("📥 Google Sheets Response: " . $response);
        
        if ($response === false) {
            throw new Exception('Failed to fetch from Google Sheets');
        }
        
        $data = json_decode($response, true);
        
        if (!$data || !isset($data['success']) || !$data['success']) {
            throw new Exception('Invalid response from Google Sheets: ' . $response);
        }
        
        return collect($data['data'] ?? []);
    }

    /**
     * Send CRUD operations to Google Sheets
     */
    private function sendToGoogleSheets(string $filename, string $action, array $data): bool
    {
        $url = config('services.google_sheets.web_app_url');
        
        if (!$url) {
            throw new Exception('Google Sheets URL not configured');
        }
        
        // Map filename to correct type for Google Sheets
        $typeMap = [
            'articles' => 'article',
            'events' => 'event',
        ];
        
        $type = $typeMap[$filename] ?? $filename;
        
        $postData = json_encode(array_merge($data, [
            'type' => $type,
            'action' => $action
        ]));
        
        \Log::info("📤 Sending to Google Sheets", [
            'url' => $url,
            'action' => $action,
            'type' => $type,
            'data' => $postData
        ]);
        
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => 'Content-Type: application/json',
                'content' => $postData,
                'timeout' => 30
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ]);
        
        $response = file_get_contents($url, false, $context);
        
        \Log::info("📥 Google Sheets Response for $action: " . $response);
        
        if ($response === false) {
            throw new Exception('Failed to send to Google Sheets');
        }
        
        $responseData = json_decode($response, true);
        
        if (!$responseData || !isset($responseData['success']) || !$responseData['success']) {
            throw new Exception('Invalid response from Google Sheets: ' . $response);
        }
        
        return true;
    }

    /**
     * Refresh local backup by reading latest data from Google Sheets
     */
    private function refreshLocalBackupFromGoogleSheets(string $filename): void
    {
        try {
            $sheetsData = $this->readFromGoogleSheets($filename);
            if ($sheetsData->isNotEmpty()) {
                // Map field names for compatibility
                $mappedData = $sheetsData->map(function($row) {
                    // Map image_url to image for backward compatibility
                    if (isset($row['image_url']) && !isset($row['image'])) {
                        $row['image'] = $row['image_url'];
                    }
                    return $row;
                });
                
                // Update local backup
                $this->write($filename, $mappedData);
                \Log::info("Local backup refreshed from Google Sheets for: " . $filename);
            }
        } catch (Exception $e) {
            \Log::warning("Failed to refresh local backup from Google Sheets: " . $e->getMessage());
        }
    }

    /**
     * Make a direct request to Google Sheets (for NotificationService)
     */
    public function makeRequest(array $requestData): array
    {
        $url = config('services.google_sheets.web_app_url');
        
        if (!$url) {
            throw new Exception('Google Sheets URL not configured');
        }
        
        $postData = json_encode($requestData);
        
        \Log::info("🔗 Making request to Google Sheets", [
            'url' => $url,
            'data' => $postData
        ]);
        
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => 'Content-Type: application/json',
                'content' => $postData,
                'timeout' => 30
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ]);
        
        $response = file_get_contents($url, false, $context);
        
        \Log::info("📥 Google Sheets Response: " . $response);
        
        if ($response === false) {
            throw new Exception('Failed to fetch from Google Sheets');
        }
        
        $data = json_decode($response, true);
        
        if (!$data) {
            throw new Exception('Invalid JSON response from Google Sheets: ' . $response);
        }
        
        return $data;
    }
}
