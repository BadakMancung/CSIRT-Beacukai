<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Exception;

class SpreadsheetService
{
    public function __construct()
    {
        // No CSV backup needed anymore
    }

    /**
     * Read data directly from Google Sheets only
     */
    public function read(string $filename): Collection
    {
        return $this->readFromGoogleSheets($filename);
    }

    /**
     * Add new row directly to Google Sheets
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
     * Update row by ID - Direct to Google Sheets
     */
    public function update(string $filename, int $id, array $data): bool
    {
        // Prepare update data with timestamp
        $updateData = array_merge($data, [
            'id' => $id,
            'updated_at' => now()->toDateTimeString()
        ]);
        
        // Send directly to Google Sheets
        return $this->sendToGoogleSheets($filename, 'update', $updateData);
    }

    /**
     * Delete row by ID - Direct to Google Sheets
     */
    public function delete(string $filename, int $id): bool
    {
        // Send directly to Google Sheets
        return $this->sendToGoogleSheets($filename, 'delete', ['id' => $id]);
    }

    /**
     * Find specific record by ID
     */
    public function find(string $filename, $id)
    {
        $data = $this->read($filename);
        return $data->firstWhere('id', $id);
    }

    /**
     * Initialize file - For backward compatibility (does nothing since we're pure Google Sheets)
     */
    public function initializeFile(string $filename, array $headers): void
    {
        // No-op for pure Google Sheets implementation
        // This method exists for backward compatibility only
        \Log::info("initializeFile called for $filename - no action needed for pure Google Sheets");
    }

    /**
     * Read data from Google Sheets
     */
    private function readFromGoogleSheets(string $filename): Collection
    {
        $url = config('services.google_sheets.web_app_url');
        
        if (!$url) {
            throw new Exception('Google Sheets URL not configured');
        }
        
        // Map filename to correct sheet name for Google Sheets
        $sheetMap = [
            'articles' => 'articles',
            'events' => 'events',
            'contacts' => 'contacts',
            'email_notifications' => 'email_notifications'
        ];
        
        $sheetName = $sheetMap[$filename] ?? $filename;
        
        $postData = json_encode([
            'sheet' => $sheetName,  // Use 'sheet' parameter for V5 script
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
        
        $results = collect($data['data'] ?? []);
        
        // Map field names for compatibility
        return $results->map(function($row) {
            // Map image_url to image for backward compatibility
            if (isset($row['image_url']) && !isset($row['image'])) {
                $row['image'] = $row['image_url'];
            }
            return $row;
        });
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
        
        // Map filename to correct sheet name for Google Sheets
        $sheetMap = [
            'articles' => 'articles',
            'events' => 'events',
            'contacts' => 'contacts',
            'email_notifications' => 'email_notifications'
        ];
        
        $sheetName = $sheetMap[$filename] ?? $filename;
        
        $postData = json_encode(array_merge($data, [
            'sheet' => $sheetName,  // Use 'sheet' parameter for V5 script
            'action' => $action
        ]));
        
        \Log::info("📤 Sending to Google Sheets", [
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
            throw new Exception('Failed to send to Google Sheets');
        }
        
        $result = json_decode($response, true);
        
        if (!$result || !isset($result['success'])) {
            throw new Exception('Invalid response from Google Sheets: ' . $response);
        }
        
        return $result['success'];
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
        
        \Log::info("📤 Making direct request to Google Sheets", [
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
        
        if ($response === false) {
            throw new Exception('Failed to make request to Google Sheets');
        }
        
        $result = json_decode($response, true);
        
        if (!$result) {
            throw new Exception('Invalid JSON response from Google Sheets');
        }
        
        return $result;
    }
}
