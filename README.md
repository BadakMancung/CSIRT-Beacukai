# 🛡️ CSIRT BEA CUKAI

**Computer Security Incident Response Team - Direktorat Jenderal Bea dan Cukai**

[![Laravel](https://img.shields.io/badge/Laravel-10.x-red.svg)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-1.0-purple.svg)](https://inertiajs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-teal.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Deskripsi

Website resmi CSIRT (Computer Security Incident Response Team) Bea Cukai yang berfungsi sebagai:
- **Portal Informasi** keamanan siber untuk stakeholder Bea Cukai
- **Sistem Pelaporan Insiden** keamanan siber 24/7
- **Knowledge Base** artikel dan panduan cyber security
- **Platform Komunikasi** dengan masyarakat terkait keamanan siber

## 🌟 Fitur Utama

### 🔐 **Keamanan Siber**
- **Pelaporan Insiden** - Form pelaporan insiden keamanan siber dengan file attachment
- **Monitoring 24/7** - Sistem monitoring keamanan berkelanjutan
- **Response Team** - Tim tanggap darurat cyber security

### 📰 **Manajemen Konten**
- **CMS Articles** - Sistem manajemen artikel cyber security
- **Event Management** - Pengelolaan event dan kegiatan CSIRT
- **Contact Management** - Sistem kontak dan komunikasi

### 🔧 **Admin Panel**
- **Dashboard Admin** - Interface admin untuk mengelola konten
- **File Upload** - Upload gambar dan dokumen dengan validasi
- **Google Sheets Integration** - Sinkronisasi data dengan Google Sheets
- **Email Notifications** - Sistem notifikasi email otomatis

### 📱 **User Experience**
- **Responsive Design** - Optimal di semua perangkat
- **Fast Loading** - Optimasi performa dengan caching
- **SEO Optimized** - Struktur SEO untuk pencarian "CSIRT Bea Cukai"
- **Accessibility** - Design yang mudah diakses

## 🏗️ Teknologi Stack

### **Backend**
- **Laravel 10** - PHP Framework
- **MySQL/Google Sheets** - Database (Hybrid storage)
- **Redis** - Caching & Session management
- **Google Apps Script** - API integration

### **Frontend**
- **React 18** - JavaScript Library
- **Inertia.js** - SPA Framework
- **Tailwind CSS** - Utility-first CSS
- **Vite** - Build tool

### **Infrastructure**
- **Nginx/Apache** - Web server
- **SSL/TLS** - Security encryption
- **Google Workspace** - Email & Sheets integration

## 🚀 Instalasi

### **Prerequisites**
- PHP >= 8.1
- Node.js >= 18.x
- MySQL >= 8.0
- Composer
- Git

### **Setup Development**

```bash
# 1. Clone repository
git clone https://github.com/BadakMancung/CSIRT-Beacukai.git
cd CSIRT-Beacukai

# 2. Install dependencies
composer install
npm install

# 3. Environment setup
cp .env.example .env
php artisan key:generate

# 4. Database setup
php artisan migrate
php artisan db:seed

# 5. Build assets
npm run dev

# 6. Start development server
php artisan serve
```

### **Environment Configuration**

```env
# Application
APP_NAME="CSIRT Bea Cukai"
APP_ENV=local
APP_KEY=base64:your-app-key
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=csirt_beacukai
DB_USERNAME=root
DB_PASSWORD=

# Storage (database|spreadsheet)
STORAGE_DRIVER=spreadsheet

# Google Sheets Integration
GOOGLE_SHEETS_WEB_APP_URL=your-google-apps-script-url

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD="your-app-password"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="your-email@gmail.com"
MAIL_FROM_NAME="CSIRT Bea Cukai"

# Notifications
NOTIFICATION_EMAILS="admin1@example.com,admin2@example.com"
ADMIN_NOTIFICATION_EMAIL=admin@csirt.beacukai.go.id

# Admin Authentication
ADMIN_EMAIL=admin@csirt.beacukai.go.id
ADMIN_PASSWORD=admin123
ADMIN_NAME="Admin CSIRT Bea Cukai"
AUTH_GUARD=static
```

## 🗂️ Struktur Project

```
CSIRT-Beacukai/
├── app/
│   ├── Http/Controllers/     # Controllers
│   ├── Models/              # Eloquent Models & BaseModel
│   ├── Services/            # Business Logic Services
│   └── Providers/           # Service Providers
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/            # Data seeders
├── resources/
│   ├── js/
│   │   ├── Components/      # React Components
│   │   ├── Layouts/         # Layout Components
│   │   └── Pages/          # Page Components
│   ├── views/              # Email templates
│   └── css/                # Stylesheets
├── routes/
│   ├── web.php             # Web routes
│   └── auth.php            # Authentication routes
├── storage/
│   ├── app/private/        # Private file storage
│   └── logs/               # Application logs
└── public/
    ├── storage/            # Public file storage
    └── build/              # Built assets
```

## 🔧 Konfigurasi

### **Google Sheets Integration**
1. Buat Google Apps Script dengan kode dari `COMPLETE_GOOGLE_APPS_SCRIPT_V5.js`
2. Deploy sebagai web app
3. Update `GOOGLE_SHEETS_WEB_APP_URL` di .env
4. Buat spreadsheet dengan sheets: articles, events, contacts, email_notifications

### **Email Configuration**
1. Setup Gmail App Password atau SMTP server
2. Configure environment variables
3. Test dengan: `/test/email`

### **File Upload Setup**
```bash
# Create storage link
php artisan storage:link

# Set permissions
chmod -R 755 storage/
chmod -R 755 public/storage/
```

## 📱 Penggunaan

### **Public Pages**
- **Home** (`/`) - Landing page dengan artikel terbaru
- **About** (`/tentang-kami`) - Informasi tentang CSIRT
- **Services** (`/layanan`) - Layanan yang tersedia
- **Articles** (`/artikel`) - Daftar artikel cyber security
- **Events** (`/acara`) - Event dan kegiatan CSIRT
- **Contact** (`/hubungi-kami`) - Form kontak dan pelaporan insiden

### **Admin Panel**
- **Dashboard** (`/admin`) - Overview admin
- **Articles** (`/admin/articles`) - Manajemen artikel
- **Events** (`/admin/events`) - Manajemen event
- **Login** (`/admin/login`) - Authentication

### **API Endpoints**
- **Testing** (`/test/*`) - Various test endpoints
- **Email** (`/test/email`) - Test email configuration
- **Google Sheets** (`/test/google-sheets`) - Test spreadsheet connection

## 🔒 Keamanan

### **Authentication**
- Static admin authentication (no database required)
- Session-based authentication
- CSRF protection
- Rate limiting

### **File Upload Security**
- File type validation (JPG, PNG, PDF)
- Size limitations (10MB max)
- Secure file storage
- Virus scanning (recommended for production)

### **Data Protection**
- Input validation & sanitization
- SQL injection protection
- XSS protection
- Secure headers implementation

## 🚀 Deployment

Untuk deployment ke production, ikuti panduan lengkap di:
📖 **[PRODUCTION_DEPLOYMENT_GUIDE.md](PRODUCTION_DEPLOYMENT_GUIDE.md)**

### **Quick Production Setup**
```bash
# 1. Environment
APP_ENV=production
APP_DEBUG=false

# 2. Optimize
composer install --no-dev --optimize-autoloader
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 3. Permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

## 📊 SEO & Performance

### **SEO Optimization**
- ✅ **Target Keywords**: "CSIRT Bea Cukai", "Cyber Security Bea Cukai"
- ✅ **Meta Tags**: Title, description, keywords optimized
- ✅ **Structured Data**: JSON-LD for better search results
- ✅ **Open Graph**: Social media sharing optimization
- ✅ **Sitemap**: Auto-generated XML sitemap
- ✅ **Mobile-First**: Responsive design approach

### **Performance Features**
- ✅ **Caching**: Redis caching for database queries
- ✅ **Asset Optimization**: Minified CSS/JS bundles
- ✅ **Image Optimization**: Responsive images
- ✅ **Lazy Loading**: Performance optimization
- ✅ **CDN Ready**: Static asset delivery

## 🔍 SEO & Google Search Console Setup

### **📋 Pre-Deployment Checklist**

Sebelum website live, pastikan semua hal berikut sudah siap:

#### **1. Environment Production**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://csirt.beacukai.go.id

# Google Analytics (optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

#### **2. Server Requirements**
- ✅ SSL Certificate (HTTPS)
- ✅ Domain pointing ke server
- ✅ Nginx/Apache configured
- ✅ PHP 8.1+ dengan extensions

### **🚀 Step-by-Step Google Indexing**

#### **Step 1: Deploy Website**
```bash
# Deploy ke production server
git pull origin main
composer install --no-dev --optimize-autoloader
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### **Step 2: Verify SEO Elements**
```bash
# Test sitemap
curl https://your-domain.com/sitemap.xml

# Test robots.txt
curl https://your-domain.com/robots.txt

# Verify meta tags (check source code)
curl -s https://your-domain.com | grep -i "meta\|title"
```

#### **Step 3: Google Search Console Setup**

1. **Buka Google Search Console**
   - Pergi ke: https://search.google.com/search-console/
   - Login dengan akun Google

2. **Add Property**
   - Click "Add Property"
   - Pilih "URL prefix"
   - Masukkan: `https://csirt.beacukai.go.id`

3. **Verify Ownership** (Pilih salah satu):
   
   **Method A: HTML Meta Tag**
   ```html
   <!-- Copy meta tag dari Google Console -->
   <!-- Paste ke components/SEOHead.jsx line 87 -->
   <meta name="google-site-verification" content="your-code-here" />
   ```
   
   **Method B: HTML File Upload**
   ```bash
   # Download file dari Google Console
   # Upload ke public/ folder
   mv google-verification-file.html public/
   ```

4. **Submit Sitemap**
   - Di Google Search Console → Sitemaps
   - Add new sitemap: `https://your-domain.com/sitemap.xml`
   - Click "Submit"

#### **Step 4: Monitor Indexing Progress**

```bash
# Check indexing status
site:csirt.beacukai.go.id

# Check specific pages
site:csirt.beacukai.go.id/artikel
```

### **📊 Expected SEO Timeline**

| Timeline | What Happens | Action Required |
|----------|--------------|-----------------|
| **Day 1** | Deploy + Submit to Google Console | Submit sitemap |
| **Week 1** | Google starts crawling | Monitor Search Console |
| **Week 2-4** | Pages begin indexing | Check "CSIRT Bea Cukai" ranking |
| **Month 1-2** | Brand keywords ranking | Optimize content |
| **Month 3-6** | Target keywords ranking | Content strategy |

### **🎯 Target Keywords Strategy**

#### **Primary Keywords** (Month 1-2)
- ✅ `CSIRT Bea Cukai` → Expected Position 1-3
- ✅ `Computer Security Incident Response Team Bea Cukai` → Position 1-5

#### **Secondary Keywords** (Month 2-4)
- ✅ `Cyber Security Bea Cukai` → Position 3-8
- ✅ `Keamanan Siber Bea Cukai` → Position 5-10
- ✅ `Tim Tanggap Insiden Keamanan Siber` → Position 5-10

#### **Long-tail Keywords** (Month 3-6)
- ✅ `Cara melaporkan insiden keamanan siber ke Bea Cukai`
- ✅ `Layanan cyber security Direktorat Jenderal Bea dan Cukai`
- ✅ `SOC Bea Cukai Security Operations Center`

### **📈 Performance Monitoring**

#### **Google Search Console Metrics**
- **Impressions**: Target 1000+/month (Month 3)
- **Clicks**: Target 100+/month (Month 3)
- **CTR**: Target 5-15%
- **Average Position**: Target <10 for brand keywords

#### **Key Pages to Monitor**
```bash
# Homepage
https://csirt.beacukai.go.id/

# Service pages
https://csirt.beacukai.go.id/layanan
https://csirt.beacukai.go.id/hubungi-kami

# Content pages
https://csirt.beacukai.go.id/artikel
https://csirt.beacukai.go.id/event
```

### **🔧 SEO Maintenance Tasks**

#### **Weekly Tasks**
- [ ] Check Google Search Console for errors
- [ ] Monitor keyword rankings
- [ ] Check page load speed
- [ ] Review mobile usability

#### **Monthly Tasks**
- [ ] Publish 2-4 new articles
- [ ] Update event information
- [ ] Review and optimize meta descriptions
- [ ] Check for broken links

#### **Quarterly Tasks**
- [ ] Comprehensive SEO audit
- [ ] Competitor analysis
- [ ] Content strategy review
- [ ] Technical SEO improvements

### **🚨 Common SEO Issues & Solutions**

#### **Issue 1: Pages Not Indexing**
```bash
# Solution: Force re-crawl
1. Go to Google Search Console
2. URL Inspection Tool
3. Enter problematic URL
4. Click "Request Indexing"
```

#### **Issue 2: Low Rankings**
```bash
# Solution: Content optimization
1. Check keyword density
2. Improve meta descriptions
3. Add internal links
4. Optimize images with alt tags
```

#### **Issue 3: Slow Page Speed**
```bash
# Solution: Performance optimization
npm run build
php artisan config:cache
# Enable server compression
# Optimize images
```

### **📱 Mobile SEO Optimization**

All pages automatically optimized for mobile with:
- ✅ Responsive design (Tailwind CSS)
- ✅ Mobile-first approach
- ✅ Touch-friendly navigation
- ✅ Fast loading on mobile networks
- ✅ Google Mobile-Friendly test compatible

### **🎯 Success Metrics (6 Months)**

#### **Target Achievements**
- **Google Rankings**: Top 3 for "CSIRT Bea Cukai"
- **Organic Traffic**: 500-1000 visitors/month
- **Page Speed**: <3 seconds load time
- **Mobile Score**: 95+ on PageSpeed Insights
- **Search Console**: 0 critical errors

#### **Content Goals**
- **Articles**: 15-20 published articles
- **Events**: Regular event updates
- **Backlinks**: 10-20 quality backlinks from kemenkeu.go.id domain
- **Social Signals**: Active social media presence

---

**🎯 Hasil yang Diharapkan: Website CSIRT Bea Cukai menjadi hasil pencarian #1 untuk semua target keywords dalam 6 bulan!**

## 🧪 Testing

```bash
# Run tests
php artisan test

# Test specific endpoints
curl http://localhost:8000/test/email
curl http://localhost:8000/test/google-sheets
curl http://localhost:8000/test/notification-service
```

## 📝 API Documentation

### **Google Sheets API Format**
```json
{
  "sheet": "articles|events|contacts|email_notifications",
  "action": "create|read|update|delete",
  "data": {
    "id": "unique_id",
    "title": "Article Title",
    "content": "Article Content",
    "...": "other_fields"
  }
}
```

### **Email Notification Format**
```json
{
  "type": "contact|article|event",
  "recipient": "email@example.com",
  "subject": "Notification Subject",
  "data": {
    "name": "User Name",
    "message": "User Message"
  }
}
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support & Contact

### **Technical Support**
- **Email**: dev@csirt.beacukai.go.id
- **Phone**: +62-21-1234-5678
- **Office Hours**: Mon-Fri 08:00-17:00 WIB

### **Security Incident Reporting**
- **Emergency**: +62-21-1234-5678 (24/7)
- **Email**: incident@csirt.beacukai.go.id
- **Web**: https://csirt.beacukai.go.id/hubungi-kami

### **Official Links**
- **Website**: https://csirt.beacukai.go.id
- **LinkedIn**: [CSIRT Bea Cukai](https://linkedin.com/company/csirt-beacukai)
- **Twitter**: [@CSIRTBeaCukai](https://twitter.com/CSIRTBeaCukai)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 About CSIRT Bea Cukai

**Computer Security Incident Response Team (CSIRT) Bea Cukai** adalah unit khusus di lingkungan Direktorat Jenderal Bea dan Cukai yang bertanggung jawab untuk:

- **Monitoring** ancaman keamanan siber 24/7
- **Response** cepat terhadap insiden keamanan
- **Prevention** melalui edukasi dan awareness
- **Recovery** sistem setelah insiden keamanan
- **Coordination** dengan stakeholder internal dan eksternal

**Visi**: Menjadi garda terdepan keamanan siber di lingkungan Direktorat Jenderal Bea dan Cukai.

**Misi**: Melindungi infrastruktur teknologi informasi Bea Cukai dari ancaman keamanan siber melalui monitoring, response, dan edukasi yang berkelanjutan.

---

**© 2025 CSIRT Bea Cukai - Direktorat Jenderal Bea dan Cukai, Kementerian Keuangan Republik Indonesia**

*Melindungi Digital, Mengamankan Negeri* 🇮🇩
