<?php

namespace App\Console\Commands;

use App\Services\SecureGoogleDriveService;
use Illuminate\Console\Command;

class CleanupExpiredFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'files:cleanup-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleanup expired secure files from Google Drive and database';

    protected $secureGoogleDriveService;

    /**
     * Create a new command instance.
     */
    public function __construct(SecureGoogleDriveService $secureGoogleDriveService)
    {
        parent::__construct();
        $this->secureGoogleDriveService = $secureGoogleDriveService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting cleanup of expired secure files...');

        try {
            $deletedCount = $this->secureGoogleDriveService->cleanupExpiredFiles();
            
            $this->info("✅ Cleanup completed. Deleted {$deletedCount} expired files.");
            
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error("❌ Cleanup failed: " . $e->getMessage());
            
            return Command::FAILURE;
        }
    }
}
