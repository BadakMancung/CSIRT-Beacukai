<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    protected $spreadsheetService;

    public function __construct(SpreadsheetService $spreadsheetService)
    {
        $this->spreadsheetService = $spreadsheetService;
    }

    /**
     * Send notification when new contact form is submitted
     */
    public function sendContactNotification($contact)
    {
        try {
            $recipients = $this->getNotificationRecipients('contacts');
            
            Log::info('Sending contact notification', [
                'recipients_count' => count($recipients),
                'contact_id' => $contact['id'] ?? 'new'
            ]);
            
            if (empty($recipients)) {
                Log::warning('No email recipients found for contact notifications');
                return;
            }
            
            foreach ($recipients as $recipient) {
                Log::info('Sending email to recipient', ['email' => $recipient['email']]);
                
                Mail::send('emails.contact-notification', [
                    'contact' => $contact,
                    'recipient' => $recipient
                ], function ($message) use ($recipient, $contact) {
                    $message->to($recipient['email'], $recipient['name'])
                           ->subject('Pesan Kontak Baru - ' . ($contact['name'] ?? 'Unknown'))
                           ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
                });
            }

            Log::info('Contact notification sent successfully', ['contact_id' => $contact['id'] ?? 'new']);
        } catch (\Exception $e) {
            Log::error('Failed to send contact notification: ' . $e->getMessage(), [
                'contact_id' => $contact['id'] ?? 'new',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Send notification when new event is created
     */
    public function sendEventNotification($event)
    {
        try {
            $recipients = $this->getNotificationRecipients('events');
            
            foreach ($recipients as $recipient) {
                Mail::send('emails.event-notification', [
                    'event' => $event,
                    'recipient' => $recipient
                ], function ($message) use ($recipient, $event) {
                    $message->to($recipient['email'], $recipient['name'])
                           ->subject('Event Baru - ' . $event['title']);
                });
            }

            Log::info('Event notification sent', ['event_id' => $event['id'] ?? 'new']);
        } catch (\Exception $e) {
            Log::error('Failed to send event notification: ' . $e->getMessage());
        }
    }

    /**
     * Send notification when new article is published
     */
    public function sendArticleNotification($article)
    {
        try {
            $recipients = $this->getNotificationRecipients('articles');
            
            foreach ($recipients as $recipient) {
                Mail::send('emails.article-notification', [
                    'article' => $article,
                    'recipient' => $recipient
                ], function ($message) use ($recipient, $article) {
                    $message->to($recipient['email'], $recipient['name'])
                           ->subject('Artikel Baru - ' . $article['title']);
                });
            }

            Log::info('Article notification sent', ['article_id' => $article['id'] ?? 'new']);
        } catch (\Exception $e) {
            Log::error('Failed to send article notification: ' . $e->getMessage());
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
}
