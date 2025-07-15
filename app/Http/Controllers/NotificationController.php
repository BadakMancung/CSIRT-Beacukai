<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use App\Services\SpreadsheetService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationController extends Controller
{
    protected $notificationService;
    protected $spreadsheetService;

    public function __construct(NotificationService $notificationService, SpreadsheetService $spreadsheetService)
    {
        $this->notificationService = $notificationService;
        $this->spreadsheetService = $spreadsheetService;
    }

    /**
     * Display email notification settings
     */
    public function index()
    {
        try {
            // Get recipients from spreadsheet
            $response = $this->spreadsheetService->makeRequest([
                'action' => 'read',
                'sheet' => 'email_notifications'
            ]);

            $recipients = $response['data'] ?? [];

            // Also get .env fallback emails
            $envEmails = env('NOTIFICATION_EMAILS', '');
            $envEmailList = !empty($envEmails) ? array_map('trim', explode(',', $envEmails)) : [];

            return inertia('Admin/Notifications/Index', [
                'recipients' => $recipients,
                'envEmails' => $envEmailList,
                'adminEmail' => env('ADMIN_NOTIFICATION_EMAIL', env('ADMIN_EMAIL')),
                'mailConfigured' => $this->isMailConfigured()
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading notification settings: ' . $e->getMessage());
            return back()->with('error', 'Gagal memuat pengaturan notifikasi: ' . $e->getMessage());
        }
    }

    /**
     * Add new email recipient
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'name' => 'required|string|max:255',
            'role' => 'required|string|in:admin,staff,supervisor',
            'notification_types' => 'required|string|max:255',
            'active' => 'boolean'
        ]);

        try {
            $success = $this->notificationService->addEmailRecipient([
                'email' => $validated['email'],
                'name' => $validated['name'],
                'role' => $validated['role'],
                'notification_types' => $validated['notification_types'],
                'active' => $validated['active'] ? 'yes' : 'no'
            ]);

            if ($success) {
                return back()->with('success', 'Email recipient berhasil ditambahkan!');
            } else {
                return back()->with('error', 'Gagal menambahkan email recipient.');
            }

        } catch (\Exception $e) {
            Log::error('Error adding email recipient: ' . $e->getMessage());
            return back()->with('error', 'Gagal menambahkan email recipient: ' . $e->getMessage());
        }
    }

    /**
     * Update email recipient
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'name' => 'required|string|max:255',
            'role' => 'required|string|in:admin,staff,supervisor',
            'notification_types' => 'required|string|max:255',
            'active' => 'boolean'
        ]);

        try {
            $response = $this->spreadsheetService->makeRequest([
                'action' => 'update',
                'sheet' => 'email_notifications',
                'id' => $id,
                'data' => [
                    'email' => $validated['email'],
                    'name' => $validated['name'],
                    'role' => $validated['role'],
                    'notification_types' => $validated['notification_types'],
                    'active' => $validated['active'] ? 'yes' : 'no',
                    'updated_at' => now()->toDateTimeString()
                ]
            ]);

            if ($response['success'] ?? false) {
                return back()->with('success', 'Email recipient berhasil diperbarui!');
            } else {
                return back()->with('error', 'Gagal memperbarui email recipient.');
            }

        } catch (\Exception $e) {
            Log::error('Error updating email recipient: ' . $e->getMessage());
            return back()->with('error', 'Gagal memperbarui email recipient: ' . $e->getMessage());
        }
    }

    /**
     * Delete email recipient
     */
    public function destroy($id)
    {
        try {
            $response = $this->spreadsheetService->makeRequest([
                'action' => 'delete',
                'sheet' => 'email_notifications',
                'id' => $id
            ]);

            if ($response['success'] ?? false) {
                return back()->with('success', 'Email recipient berhasil dihapus!');
            } else {
                return back()->with('error', 'Gagal menghapus email recipient.');
            }

        } catch (\Exception $e) {
            Log::error('Error deleting email recipient: ' . $e->getMessage());
            return back()->with('error', 'Gagal menghapus email recipient: ' . $e->getMessage());
        }
    }

    /**
     * Send test email
     */
    public function testEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        try {
            $success = $this->notificationService->sendTestEmail($request->email);

            if ($success) {
                return back()->with('success', 'Test email berhasil dikirim ke ' . $request->email);
            } else {
                return back()->with('error', 'Gagal mengirim test email. Periksa konfigurasi email.');
            }

        } catch (\Exception $e) {
            Log::error('Error sending test email: ' . $e->getMessage());
            return back()->with('error', 'Gagal mengirim test email: ' . $e->getMessage());
        }
    }

    /**
     * Check if mail is properly configured
     */
    private function isMailConfigured()
    {
        return !empty(env('MAIL_HOST')) && 
               !empty(env('MAIL_USERNAME')) && 
               !empty(env('MAIL_FROM_ADDRESS'));
    }
}
