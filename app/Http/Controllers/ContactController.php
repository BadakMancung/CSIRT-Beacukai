<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        // Validate form data sesuai dengan form field yang ada
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'incident_type' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();

        // Add timestamp dan status
        $data = array_merge($validated, [
            'type' => 'contact', // Important: specify type for multi-sheet Google Sheets
            'submitted_at' => now()->toDateTimeString(),
            'status' => 'new'
        ]);

        // Kirim ke Google Sheets dengan sistem backup
        $result = $this->sendToGoogleSheets($data);

        if ($result['success']) {
            Log::info('Contact form successfully processed', ['method' => $result['method']]);
            return back()->with('success', 'Pesan berhasil dikirim! Tim CSIRT akan segera menghubungi Anda.');
        } else {
            Log::error('Contact form failed to process', ['error' => $result['error']]);
            return back()->with('success', 'Pesan berhasil dikirim! Tim CSIRT akan segera menghubungi Anda.');
        }
    }

    private function sendToGoogleSheets($data)
    {
        $webAppUrl = env('GOOGLE_SHEETS_WEB_APP_URL');
        
        if (!$webAppUrl) {
            Log::info('Google Sheets URL not configured, saving to local backup');
            return $this->saveToLocalBackup($data);
        }

        try {
            // Gunakan file_get_contents karena cURL bermasalah dengan HTTP/2
            $context = stream_context_create([
                'http' => [
                    'method' => 'POST',
                    'header' => 'Content-Type: application/json',
                    'content' => json_encode($data),
                    'timeout' => 30
                ],
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false
                ]
            ]);

            $response = file_get_contents($webAppUrl, false, $context);
            
            if ($response !== false) {
                $responseData = json_decode($response, true);
                if (isset($responseData['success']) && $responseData['success']) {
                    Log::info('Successfully sent to Google Sheets', [
                        'data' => $data,
                        'response' => $responseData
                    ]);
                    return ['success' => true, 'method' => 'google_sheets'];
                } else {
                    Log::error('Google Sheets returned error', [
                        'response' => $responseData,
                        'data' => $data
                    ]);
                    return $this->saveToLocalBackup($data);
                }
            } else {
                Log::error('Failed to send to Google Sheets - no response');
                return $this->saveToLocalBackup($data);
            }
            
        } catch (\Exception $e) {
            Log::error('Exception when sending to Google Sheets', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            return $this->saveToLocalBackup($data);
        }
    }

    private function saveToLocalBackup($data)
    {
        try {
            // Buat directory jika belum ada
            $directory = 'contact_forms';
            if (!Storage::exists($directory)) {
                Storage::makeDirectory($directory);
            }

            // Nama file backup
            $filename = $directory . '/contact_forms_backup.csv';
            
            // Header CSV
            $headers = ['name', 'email', 'phone', 'subject', 'message', 'incident_type', 'submitted_at', 'status'];
            
            // Cek apakah file sudah ada
            $fileExists = Storage::exists($filename);
            
            // Siapkan data dalam format CSV
            $csvData = [];
            foreach ($headers as $header) {
                $csvData[] = $data[$header] ?? '';
            }
            
            // Konversi ke string CSV
            $csvLine = '"' . implode('","', $csvData) . '"' . PHP_EOL;
            
            // Jika file belum ada, tambahkan header
            if (!$fileExists) {
                $headerLine = '"' . implode('","', $headers) . '"' . PHP_EOL;
                Storage::put($filename, $headerLine . $csvLine);
            } else {
                Storage::append($filename, $csvLine);
            }
            
            Log::info('Contact form saved to local backup', [
                'file' => $filename,
                'data' => $data
            ]);
            
            return ['success' => true, 'method' => 'local_backup'];
            
        } catch (\Exception $e) {
            Log::error('Failed to save to local backup', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            
            return ['success' => false, 'method' => 'none', 'error' => $e->getMessage()];
        }
    }
}
