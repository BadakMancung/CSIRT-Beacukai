<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ApiKeyManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ApiKeyRotationController extends Controller
{
    protected $apiKeyManager;

    public function __construct(ApiKeyManager $apiKeyManager)
    {
        $this->apiKeyManager = $apiKeyManager;
    }

    /**
     * Show API key rotation dashboard
     */
    public function index()
    {
        $needsRotation = $this->apiKeyManager->checkRotationNeeded();
        $rotationHistory = $this->apiKeyManager->getRotationHistory();

        return Inertia::render('Admin/ApiKeyRotation', [
            'needsRotation' => $needsRotation,
            'rotationHistory' => array_slice($rotationHistory, 0, 20), // Last 20 records
            'rotationSchedule' => [
                'sendgrid' => 90,
                'telegram' => 180,
                'file_encryption' => 365,
                'admin_password' => 90,
            ]
        ]);
    }

    /**
     * Rotate specific API key
     */
    public function rotate(Request $request)
    {
        $request->validate([
            'service' => 'required|string|in:sendgrid,telegram,file_encryption,admin_password,all',
            'backup' => 'boolean'
        ]);

        try {
            $service = $request->input('service');
            $backup = $request->input('backup', true);

            // Log the rotation request
            Log::channel('security')->info('API_KEY_ROTATION_REQUESTED', [
                'service' => $service,
                'requested_by' => auth()->user()->email,
                'backup_requested' => $backup,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            // Execute rotation command
            $exitCode = Artisan::call('security:rotate-api-keys', [
                '--service' => $service,
                '--force' => true,
                '--backup' => $backup
            ]);

            if ($exitCode === 0) {
                return response()->json([
                    'success' => true,
                    'message' => 'API key rotation completed successfully',
                    'output' => Artisan::output()
                ]);
            } else {
                throw new \Exception('Rotation command failed');
            }

        } catch (\Exception $e) {
            Log::error('API key rotation failed', [
                'service' => $request->input('service'),
                'error' => $e->getMessage(),
                'user' => auth()->user()->email
            ]);

            return response()->json([
                'success' => false,
                'message' => 'API key rotation failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Emergency rotation for compromised keys
     */
    public function emergencyRotate(Request $request)
    {
        $request->validate([
            'service' => 'required|string',
            'reason' => 'required|string|max:500'
        ]);

        try {
            $result = $this->apiKeyManager->emergencyRotation(
                $request->input('service'),
                $request->input('reason')
            );

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Emergency rotation failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Schedule future rotation
     */
    public function schedule(Request $request)
    {
        $request->validate([
            'service' => 'required|string',
            'scheduled_date' => 'required|date|after:now'
        ]);

        try {
            $scheduledTime = \Carbon\Carbon::parse($request->input('scheduled_date'));
            
            $success = $this->apiKeyManager->scheduleRotation(
                $request->input('service'),
                $scheduledTime
            );

            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Rotation scheduled successfully',
                    'scheduled_time' => $scheduledTime->toISOString()
                ]);
            } else {
                throw new \Exception('Failed to schedule rotation');
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to schedule rotation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validate new API key
     */
    public function validate(Request $request)
    {
        $request->validate([
            'service' => 'required|string',
            'api_key' => 'required|string'
        ]);

        try {
            $isValid = $this->apiKeyManager->validateApiKey(
                $request->input('service'),
                $request->input('api_key')
            );

            return response()->json([
                'valid' => $isValid,
                'message' => $isValid ? 'API key is valid' : 'API key validation failed'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'valid' => false,
                'message' => 'Validation error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get rotation history for specific service
     */
    public function history(Request $request, string $service = null)
    {
        try {
            $history = $this->apiKeyManager->getRotationHistory($service);
            
            return response()->json([
                'success' => true,
                'history' => $history
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve history: ' . $e->getMessage()
            ], 500);
        }
    }
}
