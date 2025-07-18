<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class SecurifyContactFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'security:migrate-contact-files 
                            {--dry-run : Show what would be migrated without actually moving files}
                            {--force : Force migration even if files already exist}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'LEVEL 3 ENTERPRISE SECURITY - Migrate contact files from public to secure storage';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔐 LEVEL 3 ENTERPRISE SECURITY - FILE MIGRATION');
        $this->info('================================================');
        
        $dryRun = $this->option('dry-run');
        $force = $this->option('force');
        
        if ($dryRun) {
            $this->warn('🧪 DRY RUN MODE - No files will be moved');
        }
        
        $publicContactsPath = public_path('storage/contacts');
        $secureContactsPath = storage_path('app/secure_contacts');
        
        // Create secure directory if it doesn't exist
        if (!File::exists($secureContactsPath)) {
            if (!$dryRun) {
                File::makeDirectory($secureContactsPath, 0755, true);
            }
            $this->info("✅ Would create secure directory: {$secureContactsPath}");
        }
        
        // Check if public contacts directory exists
        if (!File::exists($publicContactsPath)) {
            $this->warn("⚠️ No public contacts directory found at: {$publicContactsPath}");
            return 0;
        }
        
        // Get all files in public contacts directory
        $files = File::files($publicContactsPath);
        $this->info("📁 Found " . count($files) . " files to migrate");
        
        if (count($files) === 0) {
            $this->info("✅ No files to migrate");
            return 0;
        }
        
        $this->newLine();
        
        $movedCount = 0;
        $errorCount = 0;
        $skippedCount = 0;
        
        foreach ($files as $file) {
            $filename = $file->getBasename();
            $sourcePath = $file->getPathname();
            $destinationPath = $secureContactsPath . DIRECTORY_SEPARATOR . $filename;
            
            // Skip if file already exists and not forced
            if (File::exists($destinationPath) && !$force) {
                $this->warn("⚠️ SKIP: {$filename} (already exists in secure location)");
                $skippedCount++;
                continue;
            }
            
            if ($dryRun) {
                $this->info("📄 WOULD MIGRATE: {$filename}");
                $movedCount++;
                continue;
            }
            
            try {
                // Move file to secure location
                if (File::copy($sourcePath, $destinationPath)) {
                    // Verify file was copied successfully
                    if (File::exists($destinationPath) && filesize($sourcePath) === filesize($destinationPath)) {
                        // Delete original file
                        File::delete($sourcePath);
                        $movedCount++;
                        
                        $this->info("✅ MIGRATED: {$filename}");
                        
                        // Log the migration for audit trail
                        Log::info('LEVEL 3 SECURITY - File migrated to secure storage', [
                            'security_level' => 'Level-3-Enterprise',
                            'filename' => $filename,
                            'from' => $sourcePath,
                            'to' => $destinationPath,
                            'file_size' => filesize($destinationPath),
                            'migration_timestamp' => now(),
                            'operation' => 'secure_migration_command'
                        ]);
                        
                    } else {
                        $this->error("❌ VERIFICATION FAILED: {$filename}");
                        $errorCount++;
                    }
                } else {
                    $this->error("❌ COPY FAILED: {$filename}");
                    $errorCount++;
                }
                
            } catch (\Exception $e) {
                $this->error("❌ ERROR: {$filename} - " . $e->getMessage());
                $errorCount++;
                
                Log::error('LEVEL 3 SECURITY - File migration error', [
                    'filename' => $filename,
                    'error' => $e->getMessage(),
                    'timestamp' => now()
                ]);
            }
        }
        
        // Create .htaccess in old location if not dry run
        if (!$dryRun && $movedCount > 0) {
            $htaccessContent = "# LEVEL 3 ENTERPRISE SECURITY - ALL ACCESS BLOCKED\n";
            $htaccessContent .= "Order deny,allow\n";
            $htaccessContent .= "Deny from all\n";
            $htaccessContent .= "ErrorDocument 403 \"LEVEL 3 SECURITY: Access Denied - Files migrated to secure storage\"\n";
            
            File::put($publicContactsPath . '/.htaccess', $htaccessContent);
            $this->info("🛡️ Created security .htaccess in old location");
        }
        
        $this->newLine();
        $this->info('================================================');
        $this->info('🔐 LEVEL 3 SECURITY MIGRATION COMPLETED');
        $this->info("✅ Files migrated: {$movedCount}");
        $this->info("⚠️ Files skipped: {$skippedCount}");
        $this->info("❌ Errors: {$errorCount}");
        $this->info("📍 Secure location: {$secureContactsPath}");
        $this->info('================================================');
        
        if (!$dryRun && $movedCount > 0) {
            $this->newLine();
            $this->info('🚨 SECURITY REMINDER:');
            $this->info('- All files are now in secure storage (not web accessible)');
            $this->info('- Use route: /secure-contact-file/{filename} for access');
            $this->info('- Authentication required for all file access');
            $this->info('- All access attempts are logged for audit');
        }
        
        return 0;
    }
}
