<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Artikel Baru - CSIRT Bea Cukai</title>
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
            background-color: #7c3aed;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #faf5ff;
            padding: 20px;
            border: 1px solid #d8b4fe;
            border-top: none;
            border-radius: 0 0 8px 8px;
        }
        .detail-item {
            margin-bottom: 15px;
            padding: 10px;
            background-color: white;
            border-radius: 4px;
            border-left: 4px solid #7c3aed;
        }
        .label {
            font-weight: bold;
            color: #7c3aed;
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
            background-color: #7c3aed;
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
        <h2>📰 Artikel Baru Dipublikasikan</h2>
        <p>CSIRT Bea Cukai - Sistem Informasi</p>
    </div>
    
    <div class="content">
        <p>Halo {{ $recipient['name'] ?? 'Admin' }},</p>
        
        <p>Artikel baru telah dipublikasikan di sistem CSIRT Bea Cukai. Berikut detail artikel:</p>
        
        <div class="detail-item">
            <span class="label">Judul Artikel:</span> {{ $article['title'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Penulis:</span> {{ $article['author'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Kategori:</span> {{ $article['category'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Tag:</span> {{ $article['tags'] ?? 'N/A' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Status:</span> {{ $article['status'] ?? 'Published' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Ringkasan:</span><br>
            {{ $article['excerpt'] ?? substr($article['content'] ?? '', 0, 200) . '...' }}
        </div>
        
        <div class="detail-item">
            <span class="label">Dipublikasikan:</span> {{ $article['published_at'] ?? $article['created_at'] ?? date('Y-m-d H:i:s') }}
        </div>
        
        <p style="text-align: center; margin-top: 20px;">
            <a href="{{ config('app.url') }}/admin/articles" class="button">
                Lihat di Admin Panel
            </a>
        </p>
        
        <p><strong>Tindakan yang mungkin diperlukan:</strong></p>
        <ul>
            <li>Review konten artikel</li>
            <li>Verifikasi format dan gambar</li>
            <li>Share ke media sosial jika perlu</li>
            <li>Monitor engagement dan feedback</li>
        </ul>
    </div>
    
    <div class="footer">
        <p>Email ini dikirim secara otomatis oleh sistem CSIRT Bea Cukai</p>
        <p>Jangan balas email ini. Untuk pertanyaan, hubungi administrator sistem.</p>
    </div>
</body>
</html>
