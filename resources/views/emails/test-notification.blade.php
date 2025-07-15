<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Test Email - CSIRT Bea Cukai</title>
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
            background-color: #10b981;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #ecfdf5;
            padding: 20px;
            border: 1px solid #a7f3d0;
            border-top: none;
            border-radius: 0 0 8px 8px;
        }
        .info-box {
            background-color: white;
            padding: 15px;
            border-radius: 4px;
            border-left: 4px solid #10b981;
            margin: 15px 0;
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
    </style>
</head>
<body>
    <div class="header">
        <h2>✅ Test Email Berhasil</h2>
        <p>CSIRT Bea Cukai - Sistem Notifikasi</p>
    </div>
    
    <div class="content">
        <p><strong>Selamat!</strong></p>
        
        <p>Email ini adalah test notification untuk memastikan sistem email CSIRT Bea Cukai berfungsi dengan baik.</p>
        
        <div class="info-box">
            <strong>Detail Test:</strong><br>
            📧 Sistem Email: Berfungsi Normal<br>
            ⏰ Waktu Test: {{ $timestamp }}<br>
            🔧 Status: Konfigurasi email berhasil
        </div>
        
        <p><strong>Sistem Notifikasi Aktif Untuk:</strong></p>
        <ul>
            <li>🚨 Pengaduan baru dari masyarakat</li>
            <li>📅 Event baru yang ditambahkan</li>
            <li>📰 Artikel baru yang dipublikasikan</li>
        </ul>
        
        <p>Jika Anda menerima email ini, berarti sistem notifikasi sudah berjalan dengan baik.</p>
    </div>
    
    <div class="footer">
        <p>Email test dikirim secara otomatis oleh sistem CSIRT Bea Cukai</p>
        <p>Untuk konfigurasi lebih lanjut, hubungi administrator sistem.</p>
    </div>
</body>
</html>
