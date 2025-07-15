<?php

namespace App\Http\Controllers;

use App\Services\SpreadsheetService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TestController extends Controller
{
    public function testGoogleSheets(SpreadsheetService $spreadsheetService)
    {
        try {
            // Test basic connection
            $response = $spreadsheetService->makeRequest([
                'action' => 'read',
                'sheet' => 'email_notifications'
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Google Sheets connection successful',
                'response' => $response
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Google Sheets connection failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function testNotificationService(NotificationService $notificationService)
    {
        try {
            // Test getting recipients
            $recipients = $notificationService->getNotificationRecipients('all');
            
            return response()->json([
                'success' => true,
                'message' => 'NotificationService working',
                'recipients' => $recipients
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'NotificationService failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function testEmailNotification(NotificationService $notificationService, Request $request)
    {
        try {
            $email = $request->input('email') ?: env('NOTIFICATION_EMAILS');
            if (str_contains($email, ',')) {
                $email = explode(',', $email)[0]; // Use first email if multiple
            }
            
            $success = $notificationService->sendTestEmail($email);
            
            return response()->json([
                'success' => $success,
                'message' => $success ? 'Test email sent successfully' : 'Failed to send test email',
                'email' => $email,
                'mail_config' => [
                    'host' => env('MAIL_HOST'),
                    'port' => env('MAIL_PORT'),
                    'username' => env('MAIL_USERNAME'),
                    'from_address' => env('MAIL_FROM_ADDRESS')
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Test email failed',
                'error' => $e->getMessage(),
                'mail_config' => [
                    'host' => env('MAIL_HOST'),
                    'port' => env('MAIL_PORT'),
                    'username' => env('MAIL_USERNAME'),
                    'from_address' => env('MAIL_FROM_ADDRESS')
                ]
            ], 500);
        }
    }
}
