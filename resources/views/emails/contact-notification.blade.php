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
            <span class="label">Instansi:</span> {{ $contact['instansi'] ?? $contact['organization'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Jenis Pengaduan:</span> {{ $contact['jenis_aduan'] ?? $contact['complaint_type'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Subjek:</span> {{ $contact['subjek'] ?? $contact['subject'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Pesan:</span><br>
            {{ $contact['deskripsi'] ?? $contact['message'] ?? $contact['description'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Tanggal Kejadian:</span> {{ $contact['tanggal_kejadian'] ?? $contact['incident_date'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Waktu Pesan:</span> {{ $contact['created_at'] ?? date('Y-m-d H:i:s') }}
        </div>
        
        @if(isset($contact['attachment']) && $contact['attachment'])
        <div class="detail-item">
            <span class="label">Lampiran:</span> 
            <a href="{{ $contact['attachment_url'] ?? asset('storage/' . $contact['attachment']) }}" target="_blank" style="color: #1e40af; text-decoration: underline;">
                📎 Lihat Lampiran
            </a>
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
