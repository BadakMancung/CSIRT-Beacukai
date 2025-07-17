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

        // Generate unique ID untuk contact
        $contactId = 'CONTACT_' . time() . '_' . uniqid();

        // Handle file upload ke Google Drive
        $secureFileData = null;
        if ($request->hasFile('attachment')) {
            try {
                // Upload file ke Google Drive via Google Apps Script
                $file = $request->file('attachment');
                $uploadResult = $this->uploadFileToGoogleDrive($file, $contactId);
                
                if ($uploadResult['success']) {
                    // Store Google Drive link data for email notification
                    $validated['attachment'] = $uploadResult['file_url'];
                    $validated['attachment_drive_id'] = $uploadResult['file_id'];
                    $validated['attachment_type'] = 'google_drive';
                    $validated['attachment_original_name'] = $uploadResult['original_name'];
                    $validated['attachment_secure_filename'] = $uploadResult['secure_filename'];
                    $validated['attachment_upload_time'] = $uploadResult['upload_time'];
                    
                    Log::info('File uploaded to Google Drive successfully', [
                        'contact_id' => $contactId,
                        'drive_file_id' => $uploadResult['file_id'],
                        'original_name' => $uploadResult['original_name'],
                        'secure_filename' => $uploadResult['secure_filename'],
                        'drive_link' => $uploadResult['file_url']
                    ]);
                } else {
                    throw new \Exception('Failed to upload to Google Drive: ' . ($uploadResult['error'] ?? 'Unknown error'));
                }
            } catch (\Exception $e) {
                Log::error('Google Drive upload failed', [
                    'contact_id' => $contactId,
                    'error' => $e->getMessage()
                ]);
                
                // Fallback: Don't store file, just log the attempt
                $validated['attachment'] = null;
                $validated['attachment_error'] = 'Upload failed - file not stored for security';
                
                Log::warning('File upload failed - no file stored for security', [
                    'contact_id' => $contactId,
                    'filename' => $request->file('attachment')->getClientOriginalName()
                ]);
            }
        }

        // Add timestamp dan status
        $data = array_merge($validated, [
            'id' => $contactId,
            'submitted_at' => now()->toDateTimeString(),
            'status' => 'new',
            'created_at' => now()->toDateTimeString(),
            'updated_at' => now()->toDateTimeString()
        ]);

        // Kirim ke Google Sheets dengan sistem backup
        $result = $this->sendToGoogleSheets($data);

        // Send notification to admins
        $this->notificationService->sendContactNotification($data);

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

    /**
     * Download secure attachment (Admin only)
     */
    public function downloadSecureAttachment($fileId)
    {
        try {
            // Check if user is authenticated (admin)
            if (!auth()->check()) {
                abort(401, 'Authentication required');
            }

            $result = $this->secureGoogleDriveService->downloadSecureFile(
                $fileId, 
                'Admin download by ' . auth()->user()->email
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
            Log::error('Failed to download secure attachment', [
                'file_id' => $fileId,
                'admin' => auth()->user()->email ?? 'unknown',
                'error' => $e->getMessage()
            ]);
            
            abort(500, 'Failed to download file');
        }
    }

    /**
     * View attachment info (Admin only)
     */
    public function viewAttachmentInfo($fileId)
    {
        try {
            if (!auth()->check()) {
                abort(401, 'Authentication required');
            }

            $metadata = $this->secureGoogleDriveService->getFileMetadata($fileId);
            
            if ($metadata['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $metadata['data']
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found'
                ], 404);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get file info'
            ], 500);
        }
    }

    /**
     * Generate temporary access token (Admin only)
     */
    public function generateTempAccess($fileId, Request $request)
    {
        try {
            if (!auth()->check()) {
                abort(401, 'Authentication required');
            }

            $expiresInMinutes = $request->input('expires_in_minutes', 60);
            
            $result = $this->secureGoogleDriveService->generateTemporaryAccess($fileId, $expiresInMinutes);
            
            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $result
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to generate temporary access'
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate temporary access'
            ], 500);
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
     * Expire attachment manually (Admin only)
     */
    public function expireAttachment($fileId, Request $request)
    {
        try {
            if (!auth()->check()) {
                abort(401, 'Authentication required');
            }

            $reason = $request->input('reason', 'Manual expiration by admin');
            
            $result = $this->secureGoogleDriveService->expireFile($fileId, $reason);
            
            return response()->json([
                'success' => $result,
                'message' => $result ? 'File expired successfully' : 'Failed to expire file'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to expire file'
            ], 500);
        }
    }

    /**
     * Get file access logs (Admin only)
     */
    public function getAccessLogs($fileId)
    {
        try {
            if (!auth()->check()) {
                abort(401, 'Authentication required');
            }

            $logs = $this->secureGoogleDriveService->getAccessLogs($fileId);
            
            return response()->json([
                'success' => true,
                'data' => $logs
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get access logs'
            ], 500);
        }
    }

    /**
     * Download secure attachment from local storage (Admin only)
     */
    public function downloadSecureLocalAttachment($filename)
    {
        try {
            // Check if user is authenticated (admin)
            if (!auth()->check()) {
                abort(401, 'Authentication required');
            }

            $filePath = storage_path('app/secure_contacts/' . $filename);
            
            if (!file_exists($filePath)) {
                abort(404, 'File not found');
            }

            // Log access untuk audit
            Log::info('Secure local attachment accessed', [
                'filename' => $filename,
                'admin_user' => auth()->user()->email ?? 'system',
                'ip' => request()->ip()
            ]);

            return response()->download($filePath);

        } catch (\Exception $e) {
            Log::error('Failed to download secure local attachment', [
                'filename' => $filename,
                'admin' => auth()->user()->email ?? 'unknown',
                'error' => $e->getMessage()
            ]);
            
            abort(500, 'Failed to download file');
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

            return $responseData;

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
