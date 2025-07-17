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
                <div style="display: flex; align-items: center; gap: 10px;">
                    <a href="{{ $contact['attachment'] }}" target="_blank" style="color: #1e40af; text-decoration: underline;">
                        🔗 Lihat File di Google Drive (Secure)
                    </a>
                    <span style="background-color: #22c55e; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
                        LEVEL 3 SECURITY
                    </span>
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">
                    📂 File disimpan aman di Google Drive dengan enkripsi
                </div>
                @if(isset($contact['attachment_original_name']))
                <div style="font-size: 12px; color: #374151; margin-top: 3px;">
                    📄 Original: {{ $contact['attachment_original_name'] }}
                </div>
                @endif
            @elseif(str_contains($contact['attachment'], 'secure-attachment'))
                <div style="display: flex; align-items: center; gap: 10px;">
                    <a href="{{ $contact['attachment'] }}" target="_blank" style="color: #1e40af; text-decoration: underline;">
                        🔐 Lihat Lampiran Aman (Login Required)
                    </a>
                    <span style="background-color: #22c55e; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
                        LEVEL 3 SECURITY
                    </span>
                </div>
                @if(isset($contact['attachment_expires']))
                <div style="font-size: 12px; color: #ef4444; margin-top: 5px;">
                    ⏰ Expires: {{ \Carbon\Carbon::parse($contact['attachment_expires'])->format('d M Y H:i') }}
                </div>
                @endif
            @elseif(isset($contact['attachment_type']) && $contact['attachment_type'] === 'secure_local')
                <div style="display: flex; align-items: center; gap: 10px;">
                    <a href="{{ route('admin.secure-local.download', $contact['attachment']) }}" target="_blank" style="color: #1e40af; text-decoration: underline;">
                        🔐 Download Secure File (Admin Login Required)
                    </a>
                    <span style="background-color: #f59e0b; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
                        SECURE LOCAL
                    </span>
                </div>
                @if(isset($contact['attachment_expires']))
                <div style="font-size: 12px; color: #ef4444; margin-top: 5px;">
                    ⏰ Expires: {{ \Carbon\Carbon::parse($contact['attachment_expires'])->format('d M Y H:i') }}
                </div>
                @endif
            @else
                <a href="{{ $contact['attachment_url'] ?? asset('storage/' . $contact['attachment']) }}" target="_blank" style="color: #1e40af; text-decoration: underline;">
                    📎 Lihat Lampiran
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
