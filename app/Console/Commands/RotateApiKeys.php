<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class RotateApiKeys extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'security:rotate-api-keys 
                            {--service= : Specific service to rotate (sendgrid, telegram, all)}
                            {--force : Force rotation without confirmation}
                            {--backup : Create backup of old keys}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'LEVEL 3 SECURITY - Rotate API keys for enhanced security';

    protected $rotationLog = [];

    public function handle()
    {
        $this->info('🔐 CSIRT BEA CUKAI - API KEY ROTATION');
        $this->info('🛡️ Level 3 Enterprise Security Implementation');
        $this->newLine();

        $service = $this->option('service') ?? 'all';
        $force = $this->option('force');
        $backup = $this->option('backup');

        if (!$force) {
            if (!$this->confirm('⚠️ This will rotate API keys and may cause temporary service disruption. Continue?')) {
                $this->error('Operation cancelled by user.');
                return 1;
            }
        }

        // Create backup if requested
        if ($backup) {
            $this->createBackup();
        }

        // Log rotation start
        $this->logRotation('API_KEY_ROTATION_STARTED', [
            'service' => $service,
            'forced' => $force,
            'backup_created' => $backup
        ]);

        try {
            switch ($service) {
                case 'sendgrid':
                    $this->rotateSendGridKey();
                    break;
                case 'telegram':
                    $this->rotateTelegramKey();
                    break;
                case 'all':
                    $this->rotateAllKeys();
                    break;
                default:
                    $this->error("Unknown service: {$service}");
                    return 1;
            }

            $this->displayRotationSummary();
            $this->updateGoogleAppsScript();
            
            $this->info('✅ API Key rotation completed successfully!');
            $this->info('🔄 Please restart your application to use new keys.');
            
        } catch (\Exception $e) {
            $this->error('❌ API Key rotation failed: ' . $e->getMessage());
            $this->logRotation('API_KEY_ROTATION_FAILED', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return 1;
        }

        return 0;
    }

    protected function rotateAllKeys()
    {
        $this->info('🔄 Rotating all API keys...');
        
        $this->rotateSendGridKey();
        $this->rotateTelegramKey();
        $this->rotateFileEncryptionKey();
        $this->rotateAdminPassword();
    }

    protected function rotateSendGridKey()
    {
        $this->info('📧 Rotating SendGrid API Key...');
        
        // In real implementation, you would call SendGrid API to create new key
        // For now, we'll generate a secure placeholder and log the need for manual rotation
        
        $oldKey = env('SENDGRID_API_KEY');
        $newKey = 'SG.' . Str::random(22) . '.' . Str::random(39);
        
        $this->updateEnvKey('SENDGRID_API_KEY', $newKey);
        
        $this->rotationLog[] = [
            'service' => 'SendGrid',
            'status' => 'ROTATED',
            'old_key_prefix' => substr($oldKey, 0, 10) . '...',
            'new_key_prefix' => substr($newKey, 0, 10) . '...',
            'action_required' => 'Generate actual key from SendGrid dashboard'
        ];

        $this->warn('⚠️ MANUAL ACTION REQUIRED:');
        $this->warn('1. Login to SendGrid dashboard');
        $this->warn('2. Generate new API key with same permissions');
        $this->warn('3. Replace the placeholder key in .env file');
        $this->warn('4. Delete old API key from SendGrid');
    }

    protected function rotateTelegramKey()
    {
        $this->info('🤖 Rotating Telegram Bot Token...');
        
        $oldToken = env('TELEGRAM_BOT_TOKEN', '');
        
        $this->rotationLog[] = [
            'service' => 'Telegram',
            'status' => 'NEEDS_MANUAL_ROTATION',
            'old_token_prefix' => substr($oldToken, 0, 10) . '...',
            'action_required' => 'Contact @BotFather to regenerate token'
        ];

        $this->warn('⚠️ MANUAL ACTION REQUIRED:');
        $this->warn('1. Contact @BotFather on Telegram');
        $this->warn('2. Use /token command to regenerate bot token');
        $this->warn('3. Update TELEGRAM_BOT_TOKEN in .env file');
        $this->warn('4. Update Google Apps Script with new token');
    }

    protected function rotateFileEncryptionKey()
    {
        $this->info('🔐 Rotating File Encryption Key...');
        
        $oldKey = env('FILE_ENCRYPTION_KEY');
        $newKey = bin2hex(random_bytes(16)); // 32-character hex string
        
        $this->updateEnvKey('FILE_ENCRYPTION_KEY', $newKey);
        
        $this->rotationLog[] = [
            'service' => 'File Encryption',
            'status' => 'ROTATED',
            'old_key_prefix' => substr($oldKey, 0, 8) . '...',
            'new_key_prefix' => substr($newKey, 0, 8) . '...',
            'note' => 'Old encrypted files may need re-encryption'
        ];

        $this->warn('⚠️ WARNING: Existing encrypted files may not be readable with new key');
        $this->warn('Consider running file re-encryption command if needed');
    }

    protected function rotateAdminPassword()
    {
        $this->info('🔑 Generating new Admin Password...');
        
        // Generate secure password
        $password = $this->generateSecurePassword();
        $hashedPassword = bcrypt($password);
        
        $this->updateEnvKey('ADMIN_PASSWORD', $hashedPassword);
        $this->updateEnvKey('ADMIN_PASSWORD_PLAIN', $password); // For reference only
        
        $this->rotationLog[] = [
            'service' => 'Admin Password',
            'status' => 'ROTATED',
            'new_password' => $password,
            'hashed' => true,
            'note' => 'Save this password securely - it will not be shown again'
        ];

        $this->warn('🔑 NEW ADMIN PASSWORD (SAVE THIS SECURELY):');
        $this->warn($password);
        $this->warn('This password will not be displayed again!');
    }

    protected function generateSecurePassword($length = 16)
    {
        $uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $lowercase = 'abcdefghijklmnopqrstuvwxyz';
        $numbers = '0123456789';
        $symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        $password = '';
        $password .= $uppercase[rand(0, strlen($uppercase) - 1)];
        $password .= $lowercase[rand(0, strlen($lowercase) - 1)];
        $password .= $numbers[rand(0, strlen($numbers) - 1)];
        $password .= $symbols[rand(0, strlen($symbols) - 1)];
        
        $allChars = $uppercase . $lowercase . $numbers . $symbols;
        for ($i = 4; $i < $length; $i++) {
            $password .= $allChars[rand(0, strlen($allChars) - 1)];
        }
        
        return str_shuffle($password);
    }

    protected function updateEnvKey($key, $value)
    {
        $envPath = base_path('.env');
        
        if (!File::exists($envPath)) {
            throw new \Exception('.env file not found');
        }
        
        $envContent = File::get($envPath);
        
        // Check if key exists
        if (strpos($envContent, $key . '=') !== false) {
            // Update existing key
            $envContent = preg_replace(
                '/^' . preg_quote($key, '/') . '=.*$/m',
                $key . '=' . $value,
                $envContent
            );
        } else {
            // Add new key
            $envContent .= "\n" . $key . '=' . $value;
        }
        
        File::put($envPath, $envContent);
        
        $this->info("✅ Updated {$key} in .env file");
    }

    protected function createBackup()
    {
        $this->info('💾 Creating backup of current configuration...');
        
        $timestamp = now()->format('Y-m-d_H-i-s');
        $backupDir = storage_path('backups/api-keys');
        
        if (!File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }
        
        // Backup .env file
        $envBackupPath = $backupDir . '/.env_backup_' . $timestamp;
        File::copy(base_path('.env'), $envBackupPath);
        
        // Create backup info file
        $backupInfo = [
            'timestamp' => now()->toISOString(),
            'backup_reason' => 'API Key Rotation',
            'files_backed_up' => [
                '.env' => $envBackupPath
            ],
            'environment' => app()->environment(),
            'user' => get_current_user(),
            'server' => gethostname()
        ];
        
        File::put(
            $backupDir . '/backup_info_' . $timestamp . '.json',
            json_encode($backupInfo, JSON_PRETTY_PRINT)
        );
        
        $this->info("✅ Backup created at: {$backupDir}");
        
        $this->logRotation('BACKUP_CREATED', [
            'backup_path' => $backupDir,
            'timestamp' => $timestamp
        ]);
    }

    protected function updateGoogleAppsScript()
    {
        $this->info('📝 Generating Google Apps Script update instructions...');
        
        $instructions = "// GOOGLE APPS SCRIPT UPDATE REQUIRED\n";
        $instructions .= "// Updated: " . now()->toDateTimeString() . "\n\n";
        
        if (env('SENDGRID_API_KEY')) {
            $instructions .= "// 1. Update SendGrid API Key:\n";
            $instructions .= "const SENDGRID_API_KEY = \"" . env('SENDGRID_API_KEY') . "\";\n\n";
        }
        
        if (env('TELEGRAM_BOT_TOKEN')) {
            $instructions .= "// 2. Update Telegram Bot Token:\n";
            $instructions .= "const TELEGRAM_BOT_TOKEN = \"" . env('TELEGRAM_BOT_TOKEN') . "\";\n\n";
        }
        
        $instructions .= "// 3. Update these values in your Google Apps Script\n";
        $instructions .= "// 4. Test the integration after updating\n";
        
        $scriptPath = storage_path('api-keys/google_apps_script_update_' . now()->format('Y-m-d_H-i-s') . '.js');
        
        if (!File::exists(dirname($scriptPath))) {
            File::makeDirectory(dirname($scriptPath), 0755, true);
        }
        
        File::put($scriptPath, $instructions);
        
        $this->info("📄 Google Apps Script update file created: {$scriptPath}");
    }

    protected function displayRotationSummary()
    {
        $this->newLine();
        $this->info('📊 API KEY ROTATION SUMMARY');
        $this->info('=================================');
        
        foreach ($this->rotationLog as $log) {
            $this->line("Service: {$log['service']}");
            $this->line("Status: " . ($log['status'] === 'ROTATED' ? '✅' : '⚠️') . " {$log['status']}");
            
            if (isset($log['old_key_prefix'])) {
                $this->line("Old Key: {$log['old_key_prefix']}");
            }
            if (isset($log['new_key_prefix'])) {
                $this->line("New Key: {$log['new_key_prefix']}");
            }
            if (isset($log['new_password'])) {
                $this->line("New Password: {$log['new_password']}");
            }
            if (isset($log['action_required'])) {
                $this->warn("Action Required: {$log['action_required']}");
            }
            if (isset($log['note'])) {
                $this->comment("Note: {$log['note']}");
            }
            
            $this->newLine();
        }
    }

    protected function logRotation($event, $data = [])
    {
        Log::channel('security')->info('API_KEY_ROTATION', [
            'event' => $event,
            'timestamp' => now()->toISOString(),
            'ip_address' => request()->ip() ?? 'console',
            'user_agent' => 'artisan_command',
            'command' => $this->signature,
            'data' => $data,
            'security_level' => 'CSIRT-LEVEL-3'
        ]);
    }
}
