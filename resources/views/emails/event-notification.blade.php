<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Event Baru - CSIRT Bea Cukai</title>
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
            background-color: #059669;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f0fdf4;
            padding: 20px;
            border: 1px solid #bbf7d0;
            border-top: none;
            border-radius: 0 0 8px 8px;
        }
        .detail-item {
            margin-bottom: 15px;
            padding: 10px;
            background-color: white;
            border-radius: 4px;
            border-left: 4px solid #059669;
        }
        .label {
            font-weight: bold;
            color: #059669;
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
            background-color: #059669;
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
        <h2>📅 Event Baru Ditambahkan</h2>
        <p>CSIRT Bea Cukai - Sistem Informasi</p>
    </div>
    
    <div class="content">
        <p>Halo {{ $recipient['name'] ?? 'Admin' }},</p>
        
        <p>Event baru telah ditambahkan ke sistem CSIRT Bea Cukai. Berikut detail event:</p>
        
        <div class="detail-item">
            <span class="label">Judul Event:</span> {{ $event['title'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Deskripsi:</span><br>
            {{ $event['description'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Tanggal Event:</span> {{ $event['event_date'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Waktu:</span> {{ $event['event_time'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Lokasi:</span> {{ $event['location'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Kategori:</span> {{ $event['category'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Status:</span> {{ $event['status'] ?? 'Active' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Dibuat pada:</span> {{ $event['created_at'] ?? date('Y-m-d H:i:s') }}
        </div>
        
        <p style="text-align: center; margin-top: 20px;">
            <a href="{{ config('app.url') }}/admin/events" class="button">
                Lihat di Admin Panel
            </a>
        </p>
        
        <p><strong>Tindakan yang mungkin diperlukan:</strong></p>
        <ul>
            <li>Review detail event</li>
            <li>Verifikasi informasi</li>
            <li>Promosikan event jika perlu</li>
            <li>Koordinasi dengan tim terkait</li>
        </ul>
    </div>
    
    <div class="footer">
        <p>Email ini dikirim secara otomatis oleh sistem CSIRT Bea Cukai</p>
        <p>Jangan balas email ini. Untuk pertanyaan, hubungi administrator sistem.</p>
    </div>
</body>
</html>
