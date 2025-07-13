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
     * Read data from CSV file or Google Sheets
     */
    public function read(string $filename): Collection
    {
        // Try to read from Google Sheets first
        try {
            $sheetsData = $this->readFromGoogleSheets($filename);        if ($sheetsData->isNotEmpty()) {
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
            return $mappedData;
        }
        } catch (Exception $e) {
            \Log::warning("Failed to read from Google Sheets, falling back to local: " . $e->getMessage());
        }
        
        // Fallback to local CSV
        $filePath = $this->basePath . '/' . $filename . '.csv';
        
        if (!Storage::exists($filePath)) {
            return collect();
        }

        $content = Storage::get($filePath);
        $lines = explode("\n", trim($content));
        
        if (empty($lines)) {
            return collect();
        }

        $headers = str_getcsv(array_shift($lines));
        $data = [];

        foreach ($lines as $line) {
            if (trim($line)) {
                $row = str_getcsv($line);
                $data[] = array_combine($headers, $row);
            }
        }

        return collect($data);
    }

    /**
     * Write data to CSV file
     */
    public function write(string $filename, Collection $data): bool
    {
        if ($data->isEmpty()) {
            return false;
        }

        $filePath = $this->basePath . '/' . $filename . '.csv';
        $headers = array_keys($data->first());
        
        $csv = $this->arrayToCsv($headers) . "\n";
        
        foreach ($data as $row) {
            $csv .= $this->arrayToCsv(array_values($row)) . "\n";
        }

        return Storage::put($filePath, trim($csv));
    }

    /**
     * Add new row to existing CSV
     */
    public function append(string $filename, array $data): bool
    {
        $existing = $this->read($filename);
        
        // Add ID if not exists
        if (!isset($data['id'])) {
            $data['id'] = time(); // Use timestamp as ID
        }
        
        // Add timestamps
        $data['created_at'] = now()->toDateTimeString();
        $data['updated_at'] = now()->toDateTimeString();
        
        $existing->push($data);
        
        // Update local backup first
        $this->write($filename, $existing);
        
        // Send to Google Sheets
        try {
            $this->sendToGoogleSheets($filename, 'create', $data);
        } catch (Exception $e) {
            \Log::warning("Failed to send to Google Sheets, but local backup updated: " . $e->getMessage());
        }
        
        return true;
    }

    /**
     * Update row by ID
     */
    public function update(string $filename, int $id, array $data): bool
    {
        $existing = $this->read($filename);
        
        $updated = $existing->map(function ($row) use ($id, $data) {
            if ($row['id'] == $id) {
                return array_merge($row, $data, ['updated_at' => now()->toDateTimeString()]);
            }
            return $row;
        });

        // Update local backup first
        $this->write($filename, $updated);
        
        // Send update to Google Sheets
        try {
            $updatedRow = $updated->firstWhere('id', $id);
            if ($updatedRow) {
                $this->sendToGoogleSheets($filename, 'update', $updatedRow);
            }
        } catch (Exception $e) {
            \Log::warning("Failed to update Google Sheets, but local backup updated: " . $e->getMessage());
        }

        return true;
    }

    /**
     * Delete row by ID
     */
    public function delete(string $filename, int $id): bool
    {
        $existing = $this->read($filename);
        $filtered = $existing->reject(function ($row) use ($id) {
            return $row['id'] == $id;
        });

        // Update local backup first
        $this->write($filename, $filtered);
        
        // Send delete to Google Sheets
        try {
            $this->sendToGoogleSheets($filename, 'delete', ['id' => $id]);
        } catch (Exception $e) {
            \Log::warning("Failed to delete from Google Sheets, but local backup updated: " . $e->getMessage());
        }

        return true;
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
            'complaints' => 'contact'  // atau sesuai dengan tipe di Google Sheets
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
}
