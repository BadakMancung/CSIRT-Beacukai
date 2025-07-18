<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use App\Services\SecureGoogleDriveService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    protected $notificationService;
    protected $secureGoogleDriveService;

    public function __construct(NotificationService $notificationService, SecureGoogleDriveService $secureGoogleDriveService)
    {
        $this->notificationService = $notificationService;
        $this->secureGoogleDriveService = $secureGoogleDriveService;
    }
    public function store(Request $request)
    {
        // Validate form data sesuai dengan form field yang ada + file upload
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'incident_type' => 'nullable|string',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240' // 10MB max
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();

        // Add timestamp dan status (tanpa ID dulu)
        $data = array_merge($validated, [
            'submitted_at' => now()->toDateTimeString(),
            'status' => 'new',
            'created_at' => now()->toDateTimeString(),
            'updated_at' => now()->toDateTimeString()
        ]);

        // STEP 1: Kirim ke Google Sheets dulu untuk mendapatkan nomor aduan yang benar
        $sheetsResult = $this->sendToGoogleSheets($data);
        
        if (!$sheetsResult['success']) {
            Log::error('Failed to create contact in Google Sheets', ['error' => $sheetsResult['error']]);
            return back()->with('error', 'Terjadi kesalahan sistem. Silakan coba lagi.');
        }

        // Extract nomor aduan dari response Google Sheets
        $nomorAduan = null;
        if (isset($sheetsResult['data']['id'])) {
            $nomorAduan = $sheetsResult['data']['id'];
            $data['id'] = $nomorAduan; // Update data dengan nomor aduan yang benar
        } else {
            Log::error('No ID returned from Google Sheets', ['response' => $sheetsResult]);
            return back()->with('error', 'Gagal mendapatkan nomor aduan. Silakan coba lagi.');
        }

        Log::info('Contact created in Google Sheets with ID', ['nomor_aduan' => $nomorAduan]);

        // STEP 2: Upload file dengan nomor aduan yang benar (jika ada file)
        if ($request->hasFile('attachment') && $nomorAduan) {
            try {
                $file = $request->file('attachment');
                $uploadResult = $this->uploadFileToGoogleDrive($file, $nomorAduan);
                
                if ($uploadResult['success']) {
                    // Update data dengan informasi attachment Google Drive untuk notification
                    $data['attachment'] = $uploadResult['file_url'];
                    $data['attachment_type'] = 'google_drive';
                    $data['attachment_drive_id'] = $uploadResult['file_id'];
                    $data['attachment_original_name'] = $uploadResult['original_name'];
                    $data['attachment_secure_filename'] = $uploadResult['secure_filename'];
                    $data['attachment_upload_time'] = $uploadResult['upload_time'];
                    
                    Log::info('File uploaded successfully with correct nomor aduan', [
                        'nomor_aduan' => $nomorAduan,
                        'file_id' => $uploadResult['file_id'],
                        'file_url' => $uploadResult['file_url']
                    ]);
                } else {
                    Log::warning('File upload failed but contact already created', [
                        'nomor_aduan' => $nomorAduan,
                        'error' => $uploadResult['error'] ?? 'Unknown error'
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('File upload exception but contact already created', [
                    'nomor_aduan' => $nomorAduan,
                    'error' => $e->getMessage()
                ]);
            }
        }

        // STEP 3: Send notification to admins dengan data yang sudah lengkap
        $this->notificationService->sendContactNotification($data);

        Log::info('Contact form successfully processed', [
            'nomor_aduan' => $nomorAduan,
            'method' => $sheetsResult['method']
        ]);
        
        return back()->with('success', "Pesan berhasil dikirim dengan Nomor Aduan: {$nomorAduan}. Tim CSIRT akan segera menghubungi Anda.");
    }

    private function sendToGoogleSheets($data)
    {
        $webAppUrl = env('GOOGLE_SHEETS_WEB_APP_URL');
        
        if (!$webAppUrl) {
            Log::info('Google Sheets URL not configured, saving to local backup');
            return $this->saveToLocalBackup($data);
        }

        try {
            // Format data untuk Google Apps Script V5
            $requestData = [
                'sheet' => 'contacts',
                'action' => 'create',
                'data' => $data
            ];

            // Gunakan file_get_contents karena cURL bermasalah dengan HTTP/2
            $context = stream_context_create([
                'http' => [
                    'method' => 'POST',
                    'header' => 'Content-Type: application/json',
                    'content' => json_encode($requestData),
                    'timeout' => 30
                ],
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false
                ]
            ]);

            Log::info('Sending to Google Sheets', ['data' => $requestData]);
            $response = file_get_contents($webAppUrl, false, $context);
            
            if ($response !== false) {
                $responseData = json_decode($response, true);
                Log::info('Google Sheets response', ['response' => $responseData]);
                
                if (isset($responseData['success']) && $responseData['success']) {
                    Log::info('Successfully sent to Google Sheets', [
                        'data' => $data,
                        'response' => $responseData
                    ]);
                    return [
                        'success' => true, 
                        'method' => 'google_sheets',
                        'data' => $responseData['data'] ?? null
                    ];
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
            
            // Generate backup ID jika data tidak punya ID
            $backupId = $data['id'] ?? 'BACKUP-' . date('Ymd') . '-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
            
            return [
                'success' => true, 
                'method' => 'local_backup',
                'data' => [
                    'id' => $backupId,
                    'backup_file' => $filename
                ]
            ];
            
        } catch (\Exception $e) {
            Log::error('Failed to save to local backup', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            
            return ['success' => false, 'method' => 'none', 'error' => $e->getMessage()];
        }
    }

    /**
     * Access file via temporary token (Public, but time-limited)
     */
    public function accessViaTemporaryToken($token)
    {
        try {
            // Verify token with Google Apps Script
            $requestData = [
                'action' => 'verify_temp_token',
                'token' => $token
            ];

            $webAppUrl = env('GOOGLE_SHEETS_WEB_APP_URL');
            $context = stream_context_create([
                'http' => [
                    'method' => 'POST',
                    'header' => 'Content-Type: application/json',
                    'content' => json_encode($requestData),
                    'timeout' => 30
                ],
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false
                ]
            ]);

            $response = file_get_contents($webAppUrl, false, $context);
            $responseData = json_decode($response, true);

            if (!$responseData['success']) {
                abort(404, 'Invalid or expired access token');
            }

            $fileId = $responseData['file_id'];
            
            $result = $this->secureGoogleDriveService->downloadSecureFile(
                $fileId, 
                'Temporary token access'
            );

            if ($result['success']) {
                return response($result['content'])
                    ->header('Content-Type', $result['mime_type'])
                    ->header('Content-Disposition', 'attachment; filename="' . $result['filename'] . '"')
                    ->header('Content-Length', $result['file_size']);
            } else {
                abort(404, 'File not found or expired');
            }

        } catch (\Exception $e) {
            Log::error('Failed to access via temporary token', [
                'token' => substr($token, 0, 10) . '...',
                'error' => $e->getMessage()
            ]);
            
            abort(500, 'Failed to access file');
        }
    }

    /**
     * Upload file ke Google Drive via Google Apps Script
     */
    private function uploadFileToGoogleDrive($file, $contactId)
    {
        try {
            $webAppUrl = env('GOOGLE_SHEETS_WEB_APP_URL');
            
            if (!$webAppUrl) {
                throw new \Exception('Google Apps Script URL not configured');
            }

            // Encode file to base64
            $fileContent = base64_encode(file_get_contents($file->getRealPath()));
            
            // Generate secure filename
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $secureFilename = 'CSIRT_' . time() . '_' . hash('md5', $originalName . uniqid()) . '.' . $extension;
            
            // Prepare data for Google Apps Script
            $requestData = [
                'action' => 'upload_contact_file',
                'file_data' => [
                    'content' => $fileContent,
                    'filename' => $secureFilename,
                    'original_name' => $originalName,
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'contact_id' => $contactId,
                    'uploaded_at' => now()->toISOString()
                ]
            ];

            $context = stream_context_create([
                'http' => [
                    'method' => 'POST',
                    'header' => 'Content-Type: application/json',
                    'content' => json_encode($requestData),
                    'timeout' => 120 // Longer timeout for file upload
                ],
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false
                ]
            ]);

            Log::info('Uploading file to Google Drive', [
                'contact_id' => $contactId,
                'filename' => $secureFilename,
                'original_name' => $originalName,
                'size' => $file->getSize()
            ]);

            $response = file_get_contents($webAppUrl, false, $context);
            
            if ($response === false) {
                throw new \Exception('Failed to connect to Google Apps Script');
            }

            $responseData = json_decode($response, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Invalid JSON response from Google Apps Script');
            }

            Log::info('Google Drive upload response', [
                'contact_id' => $contactId,
                'response' => $responseData
            ]);

            // Extract data dari nested response untuk compatibility
            if ($responseData['success'] && isset($responseData['data'])) {
                return [
                    'success' => true,
                    'file_id' => $responseData['data']['file_id'],
                    'file_url' => $responseData['data']['file_url'],
                    'secure_filename' => $responseData['data']['secure_filename'],
                    'original_name' => $responseData['data']['original_name'],
                    'upload_time' => $responseData['data']['upload_time'],
                    'security_level' => $responseData['data']['security_level'] ?? 'Level-3-Enterprise-Security',
                    'contact_id' => $responseData['data']['contact_id']
                ];
            } else {
                return [
                    'success' => false,
                    'error' => $responseData['message'] ?? 'Unknown upload error'
                ];
            }

        } catch (\Exception $e) {
            Log::error('Failed to upload file to Google Drive', [
                'contact_id' => $contactId,
                'error' => $e->getMessage()
            ]);
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
