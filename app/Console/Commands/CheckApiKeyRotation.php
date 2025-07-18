<?php

namespace App\Console\Commands;

use App\Services\ApiKeyManager;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckApiKeyRotation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'security:check-api-rotation 
                            {--alert : Send alerts for keys needing rotation}
                            {--auto-rotate : Automatically rotate overdue keys}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check which API keys need rotation and optionally rotate them';

    protected $apiKeyManager;

    public function __construct(ApiKeyManager $apiKeyManager)
    {
        parent::__construct();
        $this->apiKeyManager = $apiKeyManager;
    }

    public function handle()
    {
        $this->info('🔍 CSIRT - Checking API Key Rotation Status');
        $this->newLine();

        $needsRotation = $this->apiKeyManager->checkRotationNeeded();

        if (empty($needsRotation)) {
            $this->info('✅ All API keys are up to date!');
            return 0;
        }

        $this->warn('⚠️ The following API keys need rotation:');
        $this->newLine();

        foreach ($needsRotation as $item) {
            $this->displayRotationStatus($item);
        }

        if ($this->option('alert')) {
            $this->sendRotationAlerts($needsRotation);
        }

        if ($this->option('auto-rotate')) {
            $this->performAutoRotation($needsRotation);
        }

        return 0;
    }

    protected function displayRotationStatus(array $item): void
    {
        $priority = $item['priority'];
        $icon = match($priority) {
            'CRITICAL' => '🚨',
            'HIGH' => '⚠️',
            'MEDIUM' => '🟡',
            default => 'ℹ️'
        };

        $this->line("{$icon} Service: {$item['service']}");
        $this->line("   Priority: {$priority}");
        $this->line("   Last Rotation: " . ($item['last_rotation'] ? $item['last_rotation']->format('Y-m-d H:i:s') : 'Never'));
        $this->line("   Days Overdue: {$item['days_overdue']}");
        $this->newLine();
    }

    protected function sendRotationAlerts(array $needsRotation): void
    {
        $this->info('📨 Sending rotation alerts...');

        foreach ($needsRotation as $item) {
            $this->apiKeyManager->sendRotationNotification(
                $item['service'],
                'ROTATION_NEEDED',
                [
                    'priority' => $item['priority'],
                    'days_overdue' => $item['days_overdue'],
                    'last_rotation' => $item['last_rotation'] ? $item['last_rotation']->toDateString() : 'Never'
                ]
            );
        }

        $this->info('✅ Rotation alerts sent successfully');
    }

    protected function performAutoRotation(array $needsRotation): void
    {
        $this->info('🔄 Performing automatic rotation...');

        foreach ($needsRotation as $item) {
            if ($item['priority'] === 'CRITICAL') {
                $this->call('security:rotate-api-keys', [
                    '--service' => $item['service'],
                    '--force' => true,
                    '--backup' => true
                ]);
            }
        }
    }
}
