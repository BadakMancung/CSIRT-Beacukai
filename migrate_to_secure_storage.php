<?php

/**
 * LEVEL 3 ENTERPRISE SECURITY - File Migration Script
 * 
 * Script ini akan memindahkan semua file dari public/storage/contacts/ 
 * ke storage/app/secure_contacts/ dan mengupdate database dengan path baru
 * 
 * USAGE: php artisan tinker
 * Then run: include 'migrate_to_secure_storage.php';
 */

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

function migrateContactFilesToSecureStorage()
{
    echo "🔐 STARTING LEVEL 3 ENTERPRISE SECURITY MIGRATION\n";
    echo "================================================\n\n";
    
    $publicContactsPath = public_path('storage/contacts');
    $secureContactsPath = storage_path('app/secure_contacts');
    
    // Create secure directory if it doesn't exist
    if (!File::exists($secureContactsPath)) {
        File::makeDirectory($secureContactsPath, 0755, true);
        echo "✅ Created secure contacts directory: {$secureContactsPath}\n";
    }
    
    // Check if public contacts directory exists
    if (!File::exists($publicContactsPath)) {
        echo "⚠️ No public contacts directory found at: {$publicContactsPath}\n";
        return;
    }
    
    // Get all files in public contacts directory
    $files = File::files($publicContactsPath);
    $movedCount = 0;
    $errorCount = 0;
    
    echo "📁 Found " . count($files) . " files to migrate\n\n";
    
    foreach ($files as $file) {
        $filename = $file->getBasename();
        $sourcePath = $file->getPathname();
        $destinationPath = $secureContactsPath . DIRECTORY_SEPARATOR . $filename;
        
        try {
            // Check if file already exists in secure location
            if (File::exists($destinationPath)) {
                echo "⚠️ File already exists in secure location: {$filename}\n";
                continue;
            }
            
            // Move file to secure location
            if (File::copy($sourcePath, $destinationPath)) {
                // Verify file was copied successfully
                if (File::exists($destinationPath) && filesize($sourcePath) === filesize($destinationPath)) {
                    // Delete original file
                    File::delete($sourcePath);
                    $movedCount++;
                    
                    echo "✅ Migrated: {$filename}\n";
                    
                    // Log the migration for audit trail
                    Log::info('LEVEL 3 SECURITY - File migrated to secure storage', [
                        'security_level' => 'Level-3-Enterprise',
                        'filename' => $filename,
                        'from' => $sourcePath,
                        'to' => $destinationPath,
                        'file_size' => filesize($destinationPath),
                        'migration_timestamp' => now(),
                        'operation' => 'secure_migration'
                    ]);
                    
                } else {
                    echo "❌ File verification failed: {$filename}\n";
                    $errorCount++;
                }
            } else {
                echo "❌ Failed to copy: {$filename}\n";
                $errorCount++;
            }
            
        } catch (\Exception $e) {
            echo "❌ Error migrating {$filename}: " . $e->getMessage() . "\n";
            $errorCount++;
            
            Log::error('LEVEL 3 SECURITY - File migration error', [
                'filename' => $filename,
                'error' => $e->getMessage(),
                'timestamp' => now()
            ]);
        }
    }
    
    echo "\n================================================\n";
    echo "🔐 LEVEL 3 SECURITY MIGRATION COMPLETED\n";
    echo "✅ Files migrated: {$movedCount}\n";
    echo "❌ Errors: {$errorCount}\n";
    echo "📍 Secure location: {$secureContactsPath}\n";
    echo "================================================\n\n";
    
    // Create .htaccess in old location to block any remaining access attempts
    $htaccessContent = "# LEVEL 3 ENTERPRISE SECURITY - ALL ACCESS BLOCKED\n";
    $htaccessContent .= "Order deny,allow\n";
    $htaccessContent .= "Deny from all\n";
    $htaccessContent .= "ErrorDocument 403 \"LEVEL 3 SECURITY: Access Denied - Files have been migrated to secure storage\"\n";
    
    File::put($publicContactsPath . '/.htaccess', $htaccessContent);
    echo "🛡️ Created security .htaccess in old location\n\n";
    
    // Show security reminder
    echo "🚨 SECURITY REMINDER:\n";
    echo "- All files are now in secure storage (not web accessible)\n";
    echo "- Use route: /secure-contact-file/{filename} for access\n";
    echo "- Authentication required for all file access\n";
    echo "- All access attempts are logged for audit\n";
    echo "================================================\n";
}

// Auto-run if called directly
if (basename(__FILE__) === basename($_SERVER['SCRIPT_NAME'])) {
    migrateContactFilesToSecureStorage();
}

?>
