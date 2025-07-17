<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class SecureGoogleDriveService
{
    private $webAppUrl;
    private $encryptionKey;

    public function __construct()
    {
        $this->webAppUrl = env('GOOGLE_SHEETS_WEB_APP_URL');
        $this->encryptionKey = env('FILE_ENCRYPTION_KEY', config('app.key'));
    }

    /**
     * Upload secure file to Google Drive with encryption and access tracking
     */
    public function uploadSecureFile(UploadedFile $file, string $contactId): array
    {
        try {
            // Generate secure filename
            $secureFilename = $this->generateSecureFilename($file);
            
            // Encrypt file content
            $encryptedContent = $this->encryptFileContent($file);
            
            // Create metadata for tracking
            $fileMetadata = [
                'contact_id' => $contactId,
                'original_name' => $file->getClientOriginalName(),
                'secure_filename' => $secureFilename,
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'encryption_algorithm' => 'AES-256-CBC',
                'access_count' => 0,
                'upload_ip' => request()->ip(),
                'expires_at' => now()->addDays(30)->toISOString(), // Expire in 30 days
                'created_at' => now()->toISOString(),
                'is_active' => true
            ];

            // Send to Google Apps Script for Drive upload
            $uploadResult = $this->sendSecureFileToGoogleDrive($encryptedContent, $fileMetadata);

            if ($uploadResult['success']) {
                // Log successful upload
                $this->logFileAccess($uploadResult['file_id'], 'upload', true, 'File uploaded successfully');
                
                Log::info('Secure file uploaded to Google Drive', [
                    'contact_id' => $contactId,
                    'file_id' => $uploadResult['file_id'],
                    'original_name' => $file->getClientOriginalName(),
                    'secure_filename' => $secureFilename
                ]);

                return [
                    'success' => true,
                    'file_id' => $uploadResult['file_id'],
                    'drive_url' => $uploadResult['drive_url'],
                    'access_url' => route('admin.secure-attachment.view', $uploadResult['file_id']),
                    'expires_at' => $fileMetadata['expires_at'],
                    'metadata' => $fileMetadata
                ];
            } else {
                $errorMessage = $uploadResult['error'] ?? 'Unknown error during upload';
                throw new \Exception('Failed to upload to Google Drive: ' . $errorMessage);
            }

        } catch (\Exception $e) {
            Log::error('Failed to upload secure file', [
                'contact_id' => $contactId,
                'file_name' => $file->getClientOriginalName(),
                'error' => $e->getMessage()
            ]);
            
            throw $e;
        }
    }

    /**
     * Download secure file with access control
     */
    public function downloadSecureFile(string $fileId, string $accessReason = 'Admin download'): array
    {
        try {
            // Get file metadata first
            $metadata = $this->getFileMetadata($fileId);
            
            if (!$metadata['success']) {
                throw new \Exception('File not found or inaccessible');
            }

            $fileData = $metadata['data'];

            // Check if file is still accessible
            if (!$fileData['is_active'] || now() > $fileData['expires_at']) {
                $this->logFileAccess($fileId, 'download', false, 'File expired or inactive');
                throw new \Exception('File has expired or is no longer accessible');
            }

            // Download encrypted content from Google Drive
            $downloadResult = $this->downloadFromGoogleDrive($fileId);
            
            if (!$downloadResult['success']) {
                $this->logFileAccess($fileId, 'download', false, 'Failed to download from Drive');
                throw new \Exception('Failed to download file from Google Drive');
            }

            // Decrypt content
            $decryptedContent = $this->decryptFileContent($downloadResult['content']);

            // Update access count and log
            $this->updateAccessCount($fileId);
            $this->logFileAccess($fileId, 'download', true, $accessReason);

            Log::info('Secure file downloaded', [
                'file_id' => $fileId,
                'admin' => auth()->user()->email ?? 'system',
                'access_count' => $fileData['access_count'] + 1
            ]);

            return [
                'success' => true,
                'content' => $decryptedContent,
                'filename' => $fileData['original_name'],
                'mime_type' => $fileData['mime_type'],
                'file_size' => $fileData['file_size']
            ];

        } catch (\Exception $e) {
            $this->logFileAccess($fileId, 'download', false, 'Error: ' . $e->getMessage());
            
            Log::error('Failed to download secure file', [
                'file_id' => $fileId,
                'error' => $e->getMessage()
            ]);
            
            throw $e;
        }
    }

    /**
     * Generate temporary access token for secure file
     */
    public function generateTemporaryAccess(string $fileId, int $expiresInMinutes = 60): array
    {
        try {
            $token = Str::random(64);
            $expiresAt = now()->addMinutes($expiresInMinutes);
            
            // Store in Google Sheets for tracking
            $tokenData = [
                'token' => $token,
                'file_id' => $fileId,
                'expires_at' => $expiresAt->toISOString(),
                'created_by' => auth()->user()->email ?? 'system',
                'created_at' => now()->toISOString(),
                'used' => false
            ];

            $this->storeTemporaryToken($tokenData);
            $this->logFileAccess($fileId, 'temp_token_generated', true, "Temporary access token generated (expires in {$expiresInMinutes} minutes)");

            return [
                'success' => true,
                'token' => $token,
                'access_url' => route('secure-file.temp', $token),
                'expires_at' => $expiresAt->toISOString()
            ];

        } catch (\Exception $e) {
            Log::error('Failed to generate temporary access', [
                'file_id' => $fileId,
                'error' => $e->getMessage()
            ]);
            
            throw $e;
        }
    }

    /**
     * Expire file manually
     */
    public function expireFile(string $fileId, string $reason = 'Manual expiration'): bool
    {
        try {
            $updateData = [
                'file_id' => $fileId,
                'is_active' => false,
                'expired_at' => now()->toISOString(),
                'expired_reason' => $reason
            ];

            $result = $this->updateFileMetadata($fileId, $updateData);
            
            if ($result['success']) {
                $this->logFileAccess($fileId, 'expire', true, $reason);
                
                Log::info('File expired', [
                    'file_id' => $fileId,
                    'reason' => $reason,
                    'admin' => auth()->user()->email ?? 'system'
                ]);
                
                return true;
            }
            
            return false;

        } catch (\Exception $e) {
            Log::error('Failed to expire file', [
                'file_id' => $fileId,
                'error' => $e->getMessage()
            ]);
            
            return false;
        }
    }

    /**
     * Get file access logs
     */
    public function getAccessLogs(string $fileId): array
    {
        try {
            $requestData = [
                'action' => 'get_access_logs',
                'file_id' => $fileId
            ];

            $response = $this->sendToGoogleAppsScript($requestData);
            
            return $response;

        } catch (\Exception $e) {
            Log::error('Failed to get access logs', [
                'file_id' => $fileId,
                'error' => $e->getMessage()
            ]);
            
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Cleanup expired files
     */
    public function cleanupExpiredFiles(): int
    {
        try {
            $requestData = [
                'action' => 'cleanup_expired_files'
            ];

            $response = $this->sendToGoogleAppsScript($requestData);
            
            if ($response['success']) {
                Log::info('Expired files cleanup completed', [
                    'deleted_count' => $response['deleted_count']
                ]);
                
                return $response['deleted_count'];
            }
            
            return 0;

        } catch (\Exception $e) {
            Log::error('Failed to cleanup expired files', [
                'error' => $e->getMessage()
            ]);
            
            return 0;
        }
    }

    /**
     * Generate secure filename
     */
    private function generateSecureFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $randomName = Str::random(64);
        $timestamp = now()->format('YmdHis');
        
        return "secure_{$timestamp}_{$randomName}.{$extension}";
    }

    /**
     * Encrypt file content
     */
    private function encryptFileContent(UploadedFile $file): string
    {
        $content = file_get_contents($file->getRealPath());
        $iv = random_bytes(16);
        $encrypted = openssl_encrypt($content, 'AES-256-CBC', $this->encryptionKey, 0, $iv);
        
        // Combine IV and encrypted content
        return base64_encode($iv . $encrypted);
    }

    /**
     * Decrypt file content
     */
    private function decryptFileContent(string $encryptedContent): string
    {
        $data = base64_decode($encryptedContent);
        $iv = substr($data, 0, 16);
        $encrypted = substr($data, 16);
        
        return openssl_decrypt($encrypted, 'AES-256-CBC', $this->encryptionKey, 0, $iv);
    }

    /**
     * Send secure file to Google Apps Script for Drive upload
     */
    private function sendSecureFileToGoogleDrive(string $encryptedContent, array $metadata): array
    {
        try {
            $requestData = [
                'action' => 'upload_secure_file',
                'encrypted_content' => $encryptedContent,
                'metadata' => $metadata
            ];

            return $this->sendToGoogleAppsScript($requestData);

        } catch (\Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Download file from Google Drive
     */
    private function downloadFromGoogleDrive(string $fileId): array
    {
        try {
            $requestData = [
                'action' => 'download_secure_file',
                'file_id' => $fileId
            ];

            return $this->sendToGoogleAppsScript($requestData);

        } catch (\Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Get file metadata
     */
    private function getFileMetadata(string $fileId): array
    {
        try {
            $requestData = [
                'action' => 'get_file_metadata',
                'file_id' => $fileId
            ];

            return $this->sendToGoogleAppsScript($requestData);

        } catch (\Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Update access count
     */
    private function updateAccessCount(string $fileId): void
    {
        try {
            $requestData = [
                'action' => 'update_access_count',
                'file_id' => $fileId
            ];

            $this->sendToGoogleAppsScript($requestData);

        } catch (\Exception $e) {
            Log::error('Failed to update access count', [
                'file_id' => $fileId,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Log file access
     */
    private function logFileAccess(string $fileId, string $accessType, bool $success, string $reason): void
    {
        try {
            $logData = [
                'file_id' => $fileId,
                'access_type' => $accessType,
                'success' => $success,
                'reason' => $reason,
                'user' => auth()->user()->email ?? 'anonymous',
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'timestamp' => now()->toISOString()
            ];

            $requestData = [
                'action' => 'log_file_access',
                'log_data' => $logData
            ];

            $this->sendToGoogleAppsScript($requestData);

        } catch (\Exception $e) {
            Log::error('Failed to log file access', [
                'file_id' => $fileId,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Store temporary token
     */
    private function storeTemporaryToken(array $tokenData): void
    {
        try {
            $requestData = [
                'action' => 'store_temp_token',
                'token_data' => $tokenData
            ];

            $this->sendToGoogleAppsScript($requestData);

        } catch (\Exception $e) {
            Log::error('Failed to store temporary token', [
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Update file metadata
     */
    private function updateFileMetadata(string $fileId, array $updateData): array
    {
        try {
            $requestData = [
                'action' => 'update_file_metadata',
                'file_id' => $fileId,
                'update_data' => $updateData
            ];

            return $this->sendToGoogleAppsScript($requestData);

        } catch (\Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Send request to Google Apps Script
     */
    private function sendToGoogleAppsScript(array $requestData): array
    {
        try {
            if (!$this->webAppUrl) {
                throw new \Exception('Google Apps Script URL not configured');
            }

            $context = stream_context_create([
                'http' => [
                    'method' => 'POST',
                    'header' => 'Content-Type: application/json',
                    'content' => json_encode($requestData),
                    'timeout' => 60 // Longer timeout for file operations
                ],
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false
                ]
            ]);

            $response = file_get_contents($this->webAppUrl, false, $context);
            
            if ($response === false) {
                throw new \Exception('Failed to connect to Google Apps Script');
            }

            $responseData = json_decode($response, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Invalid JSON response from Google Apps Script');
            }

            return $responseData;

        } catch (\Exception $e) {
            Log::error('Google Apps Script request failed', [
                'request' => $requestData,
                'error' => $e->getMessage()
            ]);
            
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
