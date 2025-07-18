<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Services\SendGridServiceAlternative;

class NotificationService
{
    protected $spreadsheetService;
    protected $sendGridService;

    public function __construct(SpreadsheetService $spreadsheetService)
    {
        $this->spreadsheetService = $spreadsheetService;
        
        // Initialize SendGrid service if API key is available
        try {
            if (env('SENDGRID_API_KEY')) {
                // Try alternative SendGrid service first (uses file_get_contents)
                $this->sendGridService = new SendGridServiceAlternative();
                Log::info('SendGrid Alternative service initialized successfully');
            }
        } catch (\Exception $e) {
            Log::warning('SendGrid service initialization failed', ['error' => $e->getMessage()]);
            $this->sendGridService = null;
        }
    }

    /**
     * Send notification when new contact form is submitted
     */
    public function sendContactNotification($contact)
    {
        try {
            // Get admin email recipients
            $recipients = $this->getNotificationRecipients('contacts');
            $adminEmails = [];
            
            if (!empty($recipients)) {
                $adminEmails = array_column($recipients, 'email');
            } else {
                // Fallback admin emails dari env
                $adminEmails = [
                    env('CSIRT_ADMIN_EMAIL', 'csirt@beacukai.go.id'),
                    env('ADMIN_EMAIL', 'admin@csirt.beacukai.go.id')
                ];
            }
            
            Log::info('Sending contact notification', [
                'recipients_count' => count($adminEmails),
                'contact_id' => $contact['id'] ?? 'new',
                'service' => $this->sendGridService ? 'SendGrid' : 'SMTP'
            ]);

            // Prioritas 1: SendGrid API (Recommended untuk production)
            if ($this->sendGridService) {
                $sendGridResult = $this->sendGridService->sendContactNotification($contact, $adminEmails);
                
                if ($sendGridResult['success']) {
                    Log::info('Contact notification sent via SendGrid successfully', [
                        'contact_id' => $contact['id'] ?? 'new',
                        'response_code' => $sendGridResult['response_code'] ?? 'N/A'
                    ]);
                    return;
                } else {
                    Log::warning('SendGrid failed, falling back to SMTP', [
                        'error' => $sendGridResult['message'] ?? 'Unknown error'
                    ]);
                }
            }

            // Fallback: Laravel SMTP (jika SendGrid gagal atau tidak dikonfigurasi)
            $this->sendViaSMTP($contact, $recipients ?: $this->createFallbackRecipients($adminEmails));
            
        } catch (\Exception $e) {
            Log::error('Failed to send contact notification: ' . $e->getMessage(), [
                'contact_id' => $contact['id'] ?? 'new',
                'error' => $e->getMessage()
            ]);
        }
    }
    /**
     * Get notification recipients from spreadsheet or .env
     */
    public function getNotificationRecipients($type = 'all')
    {
        // Try to get from spreadsheet first
        try {
            $recipients = $this->getRecipientsFromSpreadsheet($type);
            if (!empty($recipients)) {
                return $recipients;
            }
        } catch (\Exception $e) {
            Log::warning('Failed to get recipients from spreadsheet, falling back to .env: ' . $e->getMessage());
        }

        // Fallback to .env
        return $this->getRecipientsFromEnv();
    }

    /**
     * Get recipients from Google Sheets
     */
    protected function getRecipientsFromSpreadsheet($type)
    {
        try {
            $response = $this->spreadsheetService->makeRequest([
                'action' => 'read',
                'sheet' => 'email_notifications'
            ]);

            if (!isset($response['data']) || empty($response['data'])) {
                return [];
            }

            $recipients = [];
            foreach ($response['data'] as $row) {
                // Skip if not active or doesn't match notification type
                if (isset($row['active']) && strtolower($row['active']) !== 'yes') {
                    continue;
                }

                if ($type !== 'all' && isset($row['notification_types'])) {
                    $types = array_map('trim', explode(',', strtolower($row['notification_types'])));
                    if (!in_array($type, $types) && !in_array('all', $types)) {
                        continue;
                    }
                }

                $recipients[] = [
                    'email' => $row['email'] ?? '',
                    'name' => $row['name'] ?? $row['email'] ?? '',
                    'role' => $row['role'] ?? 'staff'
                ];
            }

            return $recipients;
        } catch (\Exception $e) {
            Log::error('Error reading email notifications from spreadsheet: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get recipients from .env configuration
     */
    protected function getRecipientsFromEnv()
    {
        $emails = env('NOTIFICATION_EMAILS', '');
        if (empty($emails)) {
            return [];
        }

        $emailList = array_map('trim', explode(',', $emails));
        $recipients = [];

        foreach ($emailList as $email) {
            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $recipients[] = [
                    'email' => $email,
                    'name' => $email,
                    'role' => 'staff'
                ];
            }
        }

        return $recipients;
    }

    /**
     * Add new email recipient to spreadsheet
     */
    public function addEmailRecipient($data)
    {
        try {
            $response = $this->spreadsheetService->makeRequest([
                'action' => 'create',
                'sheet' => 'email_notifications',
                'data' => [
                    'email' => $data['email'],
                    'name' => $data['name'] ?? $data['email'],
                    'role' => $data['role'] ?? 'staff',
                    'notification_types' => $data['notification_types'] ?? 'all',
                    'active' => $data['active'] ?? 'yes',
                    'created_at' => now()->toDateTimeString()
                ]
            ]);

            return $response['success'] ?? false;
        } catch (\Exception $e) {
            Log::error('Failed to add email recipient: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Test email configuration
     */
    public function sendTestEmail($toEmail = null)
    {
        try {
            $email = $toEmail ?: env('ADMIN_NOTIFICATION_EMAIL') ?: env('NOTIFICATION_EMAILS');
            
            if (str_contains($email, ',')) {
                $email = explode(',', $email)[0]; // Use first email if multiple
            }
            
            Log::info('Sending test email', ['to' => $email]);
            
            Mail::send('emails.test-notification', [
                'timestamp' => now()->toDateTimeString()
            ], function ($message) use ($email) {
                $message->to(trim($email))
                       ->subject('Test Notification - CSIRT Bea Cukai')
                       ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            });

            Log::info('Test email sent successfully', ['to' => $email]);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send test email: ' . $e->getMessage(), ['email' => $email ?? 'unknown']);
            return false;
        }
    }

    /**
     * Send notification via SMTP (fallback method)
     */
    private function sendViaSMTP($contact, $recipients)
    {
        foreach ($recipients as $recipient) {
            Log::info('Sending SMTP email to recipient', ['email' => $recipient['email']]);
            
            Mail::send('emails.contact-notification', [
                'contact' => $contact,
                'recipient' => $recipient
            ], function ($message) use ($recipient, $contact) {
                $nomorAduan = $contact['id'] ?? 'new';
                $message->to($recipient['email'], $recipient['name'])
                       ->subject("🚨 [CSIRT] Pesan Kontak Baru - {$nomorAduan}")
                       ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            });
        }
        
        Log::info('Contact notification sent via SMTP successfully', [
            'contact_id' => $contact['id'] ?? 'new'
        ]);
    }

    /**
     * Create fallback recipients from email addresses
     */
    private function createFallbackRecipients($emailAddresses)
    {
        $recipients = [];
        foreach ($emailAddresses as $email) {
            $recipients[] = [
                'name' => 'Admin CSIRT',
                'email' => $email
            ];
        }
        return $recipients;
    }

    /**
     * Utility function to validate email address
     */
    public static function validateEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    /**
     * Utility function to sanitize email address
     */
    public static function sanitizeEmail($email)
    {
        return filter_var(trim($email), FILTER_SANITIZE_EMAIL);
    }
}
