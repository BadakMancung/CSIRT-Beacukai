<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class SendGridServiceAlternative
{
    protected $apiKey;
    protected $fromEmail;
    protected $fromName;

    public function __construct()
    {
        $this->apiKey = env('SENDGRID_API_KEY');
        
        if (!$this->apiKey) {
            throw new \Exception('SENDGRID_API_KEY not configured in .env file');
        }
        
        $this->fromEmail = env('SENDGRID_FROM_EMAIL', env('MAIL_FROM_ADDRESS'));
        $this->fromName = env('SENDGRID_FROM_NAME', 'CSIRT Bea Cukai');
    }

    /**
     * Send contact notification email to admin using file_get_contents
     */
    public function sendContactNotification($contactData, $adminEmails = [])
    {
        try {
            // Default admin emails jika tidak ada yang diberikan
            if (empty($adminEmails)) {
                $adminEmails = [
                    'csirt@beacukai.go.id',
                    'admin@csirt.beacukai.go.id'
                ];
            }

            $nomorAduan = $contactData['id'] ?? 'N/A';
            
            // Generate HTML and plain text content
            $htmlContent = $this->generateContactNotificationHTML($contactData);
            $plainTextContent = $this->generateContactNotificationPlainText($contactData);
            
            // Prepare recipients
            $personalizations = [];
            foreach ($adminEmails as $adminEmail) {
                $personalizations[] = [
                    'to' => [
                        ['email' => $adminEmail, 'name' => 'Admin CSIRT']
                    ],
                    'subject' => "🚨 [CSIRT] Pesan Kontak Baru - {$nomorAduan}"
                ];
            }
            
            // Prepare SendGrid API data
            $data = [
                'personalizations' => $personalizations,
                'from' => [
                    'email' => $this->fromEmail,
                    'name' => $this->fromName
                ],
                'content' => [
                    [
                        'type' => 'text/plain',
                        'value' => $plainTextContent
                    ],
                    [
                        'type' => 'text/html',
                        'value' => $htmlContent
                    ]
                ]
            ];
            
            // Send via SendGrid API using file_get_contents
            $result = $this->sendViaSendGridAPI($data);
            
            if ($result['success']) {
                Log::info('SendGrid email sent successfully via alternative method', [
                    'nomor_aduan' => $nomorAduan,
                    'recipients' => $adminEmails,
                    'status_code' => $result['status_code']
                ]);
                
                return [
                    'success' => true,
                    'message' => 'Email notification sent successfully via SendGrid (Alternative)',
                    'response_code' => $result['status_code']
                ];
            } else {
                Log::error('SendGrid email failed via alternative method', [
                    'nomor_aduan' => $nomorAduan,
                    'error' => $result['error']
                ]);
                
                return [
                    'success' => false,
                    'message' => 'Failed to send email via SendGrid (Alternative)',
                    'error' => $result['error']
                ];
            }
            
        } catch (\Exception $e) {
            Log::error('SendGrid alternative service exception', [
                'error' => $e->getMessage(),
                'contact_data' => $contactData
            ]);
            
            return [
                'success' => false,
                'message' => 'SendGrid alternative service exception: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send email via SendGrid API using file_get_contents
     */
    private function sendViaSendGridAPI($data)
    {
        try {
            $url = 'https://api.sendgrid.com/v3/mail/send';
            $headers = [
                'Authorization: Bearer ' . $this->apiKey,
                'Content-Type: application/json'
            ];
            
            $context = stream_context_create([
                'http' => [
                    'method' => 'POST',
                    'header' => implode("\r\n", $headers),
                    'content' => json_encode($data),
                    'timeout' => 30
                ],
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                ]
            ]);

            Log::info('Sending email via SendGrid API (file_get_contents)', [
                'url' => $url,
                'recipients_count' => count($data['personalizations'])
            ]);

            $response = file_get_contents($url, false, $context);
            
            // Parse response headers
            $statusCode = 0;
            $headers = $http_response_header ?? [];
            foreach ($headers as $header) {
                if (strpos($header, 'HTTP/') === 0) {
                    preg_match('/HTTP\/\d\.\d (\d{3})/', $header, $matches);
                    $statusCode = isset($matches[1]) ? (int)$matches[1] : 0;
                    break;
                }
            }
            
            Log::info('SendGrid API response', [
                'status_code' => $statusCode,
                'response_body' => $response,
                'response_headers' => $headers
            ]);
            
            if ($response !== false && $statusCode >= 200 && $statusCode < 300) {
                return [
                    'success' => true,
                    'status_code' => $statusCode,
                    'response' => $response
                ];
            } else {
                $error = error_get_last();
                return [
                    'success' => false,
                    'status_code' => $statusCode,
                    'error' => $error['message'] ?? 'Unknown error',
                    'response' => $response
                ];
            }
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Generate HTML content for contact notification
     */
    private function generateContactNotificationHTML($contact)
    {
        $nomorAduan = $contact['id'] ?? 'N/A';
        $attachmentSection = '';
        
        // Build attachment section jika ada
        if (isset($contact['attachment']) && $contact['attachment']) {
            if (isset($contact['attachment_type']) && $contact['attachment_type'] === 'google_drive') {
                $attachmentSection = '
                <div style="margin: 15px 0; padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <a href="' . htmlspecialchars($contact['attachment']) . '" target="_blank" style="color: #1e40af; text-decoration: none; background-color: #eff6ff; padding: 8px 12px; border-radius: 6px; display: inline-block;">
                            🔗 Lihat File di Google Drive (Secure)
                        </a>
                        <span style="background-color: #22c55e; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">
                            LEVEL 3 SECURITY
                        </span>
                    </div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 5px; padding: 8px; background-color: #f1f5f9; border-radius: 4px;">
                        📂 File disimpan aman di Google Drive dengan enkripsi end-to-end<br>
                        🔐 Akses terbatas hanya untuk tim CSIRT yang berwenang<br>
                        📋 Audit trail lengkap untuk semua akses file
                    </div>';
                    
                if (isset($contact['attachment_original_name'])) {
                    $attachmentSection .= '
                    <div style="font-size: 12px; color: #374151; margin-top: 5px; padding: 4px 8px; background-color: #f8fafc; border-radius: 3px;">
                        📄 <strong>File Asli:</strong> ' . htmlspecialchars($contact['attachment_original_name']) . '
                    </div>';
                }
                
                $attachmentSection .= '</div>';
            } else {
                $attachmentSection = '
                <div style="margin: 15px 0; padding: 10px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px;">
                    <div style="color: #ef4444; font-size: 12px;">⚠️ Attachment menggunakan storage lama (tidak aman)</div>
                    <a href="' . htmlspecialchars($contact['attachment']) . '" target="_blank" style="color: #1e40af; text-decoration: underline;">📎 Lihat Lampiran (Legacy)</a>
                </div>';
            }
        }

        return '
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pesan Kontak Baru - CSIRT Bea Cukai</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">💬 Pesan Kontak Baru Diterima</h2>
        <p style="margin: 5px 0 0 0;">CSIRT Bea Cukai - Sistem Informasi</p>
    </div>
    
    <div style="background-color: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <p>Halo Admin CSIRT,</p>
        
        <p>Pesan baru telah diterima melalui formulir kontak website CSIRT Bea Cukai. Berikut detail pesan:</p>
        
        <div style="margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 4px; border-left: 4px solid #dc2626;">
            <span style="font-weight: bold; color: #dc2626; display: inline-block; min-width: 120px;">Nomor Aduan:</span> ' . htmlspecialchars($nomorAduan) . '
        </div>
        
        <div style="margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 4px; border-left: 4px solid #1e40af;">
            <span style="font-weight: bold; color: #1e40af; display: inline-block; min-width: 120px;">Nama:</span> ' . htmlspecialchars($contact['name'] ?? 'N/A') . '
        </div>
        
        <div style="margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 4px; border-left: 4px solid #1e40af;">
            <span style="font-weight: bold; color: #1e40af; display: inline-block; min-width: 120px;">Email:</span> ' . htmlspecialchars($contact['email'] ?? 'N/A') . '
        </div>
        
        <div style="margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 4px; border-left: 4px solid #1e40af;">
            <span style="font-weight: bold; color: #1e40af; display: inline-block; min-width: 120px;">Telepon:</span> ' . htmlspecialchars($contact['phone'] ?? 'N/A') . '
        </div>
        
        <div style="margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 4px; border-left: 4px solid #1e40af;">
            <span style="font-weight: bold; color: #1e40af; display: inline-block; min-width: 120px;">Jenis Insiden:</span> ' . htmlspecialchars($contact['incident_type'] ?? 'N/A') . '
        </div>
        
        <div style="margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 4px; border-left: 4px solid #1e40af;">
            <span style="font-weight: bold; color: #1e40af; display: inline-block; min-width: 120px;">Subjek:</span> ' . htmlspecialchars($contact['subject'] ?? 'N/A') . '
        </div>
        
        <div style="margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 4px; border-left: 4px solid #1e40af;">
            <span style="font-weight: bold; color: #1e40af; display: inline-block; min-width: 120px;">Pesan:</span><br>
            ' . nl2br(htmlspecialchars($contact['message'] ?? 'N/A')) . '
        </div>
        
        <div style="margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 4px; border-left: 4px solid #1e40af;">
            <span style="font-weight: bold; color: #1e40af; display: inline-block; min-width: 120px;">Waktu Pesan:</span> ' . htmlspecialchars($contact['created_at'] ?? date('Y-m-d H:i:s')) . '
        </div>
        
        ' . $attachmentSection . '
        
        <div style="text-align: center; margin-top: 20px;">
            <a href="https://csirt.beacukai.go.id/admin/contacts" style="display: inline-block; background-color: #1e40af; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; margin: 10px 0;">
                Lihat di Admin Panel
            </a>
        </div>
        
        <div style="margin-top: 20px;">
            <p><strong>Tindakan yang diperlukan:</strong></p>
            <ul>
                <li>Review detail pesan kontak</li>
                <li>Tentukan prioritas penanganan</li>
                <li>Assign ke tim yang tepat</li>
                <li>Berikan respon ke pengirim</li>
                <li>Update status penanganan</li>
            </ul>
        </div>
    </div>
    
    <div style="margin-top: 20px; padding: 15px; background-color: #e2e8f0; text-align: center; font-size: 12px; color: #64748b; border-radius: 4px;">
        <p style="margin: 0;">Email ini dikirim secara otomatis oleh sistem CSIRT Bea Cukai melalui SendGrid API</p>
        <p style="margin: 5px 0 0 0;">Jangan balas email ini. Untuk pertanyaan, hubungi administrator sistem.</p>
    </div>
</body>
</html>';
    }

    /**
     * Generate plain text content for contact notification
     */
    private function generateContactNotificationPlainText($contact)
    {
        $nomorAduan = $contact['id'] ?? 'N/A';
        $attachmentText = '';
        
        if (isset($contact['attachment']) && $contact['attachment']) {
            if (isset($contact['attachment_type']) && $contact['attachment_type'] === 'google_drive') {
                $attachmentText = "\n\nLAMPIRAN (LEVEL 3 SECURITY):\n";
                $attachmentText .= "Link: " . $contact['attachment'] . "\n";
                $attachmentText .= "File disimpan aman di Google Drive dengan enkripsi end-to-end\n";
                
                if (isset($contact['attachment_original_name'])) {
                    $attachmentText .= "File Asli: " . $contact['attachment_original_name'] . "\n";
                }
            } else {
                $attachmentText = "\n\nLAMPIRAN (LEGACY STORAGE - TIDAK AMAN):\n";
                $attachmentText .= "Link: " . $contact['attachment'] . "\n";
            }
        }

        return "PESAN KONTAK BARU - CSIRT BEA CUKAI
============================================

Pesan baru telah diterima melalui formulir kontak website CSIRT Bea Cukai.

DETAIL PESAN:
Nomor Aduan: {$nomorAduan}
Nama: " . ($contact['name'] ?? 'N/A') . "
Email: " . ($contact['email'] ?? 'N/A') . "
Telepon: " . ($contact['phone'] ?? 'N/A') . "
Jenis Insiden: " . ($contact['incident_type'] ?? 'N/A') . "
Subjek: " . ($contact['subject'] ?? 'N/A') . "
Waktu Pesan: " . ($contact['created_at'] ?? date('Y-m-d H:i:s')) . "

PESAN:
" . ($contact['message'] ?? 'N/A') . "
{$attachmentText}

TINDAKAN YANG DIPERLUKAN:
- Review detail pesan kontak
- Tentukan prioritas penanganan
- Assign ke tim yang tepat
- Berikan respon ke pengirim
- Update status penanganan

Admin Panel: https://csirt.beacukai.go.id/admin/contacts

---
Email ini dikirim secara otomatis oleh sistem CSIRT Bea Cukai melalui SendGrid API.
Jangan balas email ini. Untuk pertanyaan, hubungi administrator sistem.";
    }
}
