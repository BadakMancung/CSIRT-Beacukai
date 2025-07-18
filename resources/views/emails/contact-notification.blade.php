<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pesan Kontak Baru - CSIRT Bea Cukai</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #1e40af;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f8fafc;
            padding: 20px;
            border: 1px solid #e2e8f0;
            border-top: none;
            border-radius: 0 0 8px 8px;
        }
        .detail-item {
            margin-bottom: 15px;
            padding: 10px;
            background-color: white;
            border-radius: 4px;
            border-left: 4px solid #1e40af;
        }
        .label {
            font-weight: bold;
            color: #1e40af;
            display: inline-block;
            min-width: 120px;
        }
        .footer {
            margin-top: 20px;
            padding: 15px;
            background-color: #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-radius: 4px;
        }
        .button {
            display: inline-block;
            background-color: #1e40af;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>💬 Pesan Kontak Baru Diterima</h2>
        <p>CSIRT Bea Cukai - Sistem Informasi</p>
    </div>
    
    <div class="content">
        <p>Halo {{ $recipient['name'] ?? 'Admin' }},</p>
        
        <p>Pesan baru telah diterima melalui formulir kontak website CSIRT Bea Cukai. Berikut detail pesan:</p>
        
        <div class="detail-item">
            <span class="label">Nomor Aduan:</span> {{ $contact['id'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Nama:</span> {{ $contact['nama'] ?? $contact['name'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Email:</span> {{ $contact['email'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Nomor Telepon:</span> {{ $contact['telepon'] ?? $contact['phone'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Jenis Pengaduan:</span> {{ $contact['incident_type'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Subjek:</span> {{ $contact['subjek'] ?? $contact['subject'] ?? 'N/A' }}
        </div>
         
        <div class="detail-item">
            <span class="label">Pesan:</span><br>
            {{ $contact['deskripsi'] ?? $contact['message'] ?? $contact['description'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Waktu Pesan:</span> {{ $contact['created_at'] ?? date('Y-m-d H:i:s') }}
        </div>
        
        @if(isset($contact['attachment']) && $contact['attachment'])
        <div class="detail-item">
            <span class="label">Lampiran:</span> 
            @if(isset($contact['attachment_type']) && $contact['attachment_type'] === 'google_drive')
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <a href="{{ $contact['attachment'] }}" target="_blank" style="color: #1e40af; text-decoration: none; background-color: #eff6ff; padding: 8px 12px; border-radius: 6px; display: inline-block;">
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
                </div>
                @if(isset($contact['attachment_original_name']))
                <div style="font-size: 12px; color: #374151; margin-top: 5px; padding: 4px 8px; background-color: #f8fafc; border-radius: 3px;">
                    📄 <strong>File Asli:</strong> {{ $contact['attachment_original_name'] }}
                </div>
                @endif
                @if(isset($contact['attachment_secure_filename']))
                <div style="font-size: 12px; color: #6b7280; margin-top: 3px; padding: 4px 8px; background-color: #f8fafc; border-radius: 3px;">
                    🏷️ <strong>ID Aman:</strong> {{ $contact['attachment_secure_filename'] }}
                </div>
                @endif
                @if(isset($contact['attachment_upload_time']))
                <div style="font-size: 12px; color: #059669; margin-top: 3px; padding: 4px 8px; background-color: #ecfdf5; border-radius: 3px;">
                    ⏰ <strong>Upload:</strong> {{ \Carbon\Carbon::parse($contact['attachment_upload_time'])->format('d M Y H:i:s') }}
                </div>
                @endif
            @else
                <div style="color: #ef4444; font-size: 12px;">
                    ⚠️ Attachment menggunakan storage lama (tidak aman)
                </div>
                <a href="{{ $contact['attachment_url'] ?? asset('storage/' . $contact['attachment']) }}" target="_blank" style="color: #1e40af; text-decoration: underline;">
                    📎 Lihat Lampiran (Legacy)
                </a>
            @endif
        </div>
        @endif
        
        <p style="text-align: center; margin-top: 20px;">
            <a href="{{ config('app.url') }}/admin/contacts" class="button">
                Lihat di Admin Panel
            </a>
        </p>
        
        <p><strong>Tindakan yang diperlukan:</strong></p>
        <ul>
            <li>Review detail pesan kontak</li>
            <li>Tentukan prioritas penanganan</li>
            <li>Assign ke tim yang tepat</li>
            <li>Berikan respon ke pengirim</li>
            <li>Update status penanganan</li>
        </ul>
    </div>
    
    <div class="footer">
        <p>Email ini dikirim secara otomatis oleh sistem CSIRT Bea Cukai</p>
        <p>Jangan balas email ini. Untuk pertanyaan, hubungi administrator sistem.</p>
    </div>
</body>
</html>