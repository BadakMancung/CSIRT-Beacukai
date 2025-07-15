# CSIRT BEA CUKAI - PRODUCTION DEPLOYMENT GUIDE

## 📋 Production Checklist

### 1. **Environment Configuration**
```bash
# Set production environment
APP_ENV=production
APP_DEBUG=false
APP_URL=https://csirt.beacukai.go.id

# Security
APP_KEY=<generate-new-32-character-key>

# Database Production
DB_CONNECTION=mysql
DB_HOST=your-production-db-host
DB_PORT=3306
DB_DATABASE=csirt_beacukai_prod
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password

# Mail Configuration (Production)
MAIL_MAILER=smtp
MAIL_HOST=smtp.kemenkeu.go.id
MAIL_PORT=587
MAIL_USERNAME=csirt@beacukai.go.id
MAIL_PASSWORD="your-secure-mail-password"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="csirt@beacukai.go.id"
MAIL_FROM_NAME="CSIRT Bea Cukai"

# Google Sheets (Production)
GOOGLE_SHEETS_WEB_APP_URL=your-production-google-apps-script-url

# Session & Cache
SESSION_DRIVER=database
CACHE_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 2. **Server Requirements**
- **PHP**: >= 8.1
- **MySQL**: >= 8.0
- **Node.js**: >= 18.x
- **Redis**: >= 6.x
- **Web Server**: Apache/Nginx
- **SSL Certificate**: Required for HTTPS

### 3. **Deployment Steps**

#### A. Server Setup
```bash
# 1. Clone repository
git clone https://github.com/BadakMancung/CSIRT-Beacukai.git
cd CSIRT-Beacukai

# 2. Install PHP dependencies
composer install --no-dev --optimize-autoloader

# 3. Install Node.js dependencies
npm install

# 4. Build assets for production
npm run build

# 5. Set permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### B. Environment Setup
```bash
# 1. Copy environment file
cp .env.example .env

# 2. Generate application key
php artisan key:generate

# 3. Configure .env for production (see above)

# 4. Run migrations (if using database)
php artisan migrate --force

# 5. Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

#### C. Web Server Configuration

**Nginx Configuration:**
```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name csirt.beacukai.go.id;
    root /var/www/CSIRT-Beacukai/public;

    # SSL Configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 4. **SEO Optimization**

#### A. Meta Tags & Structured Data
File sudah dioptimasi dengan:
- ✅ Meta title dan description
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Structured data (JSON-LD)

#### B. Technical SEO
```bash
# 1. Generate sitemap
php artisan sitemap:generate

# 2. Submit to search engines
# - Google Search Console
# - Bing Webmaster Tools
```

#### C. Content Optimization
- ✅ Semantic HTML structure
- ✅ Alt tags untuk images
- ✅ Internal linking structure
- ✅ Fast loading (optimized assets)

### 5. **Security Measures**

#### A. Application Security
```bash
# 1. Update dependencies
composer update
npm audit fix

# 2. Set proper file permissions
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
chmod -R 755 storage bootstrap/cache
```

#### B. Server Security
- ✅ Firewall configuration
- ✅ SSL/TLS encryption
- ✅ Regular security updates
- ✅ Database access restrictions
- ✅ File upload restrictions

### 6. **Monitoring & Backup**

#### A. Application Monitoring
```bash
# 1. Setup Laravel Telescope (optional for debugging)
composer require laravel/telescope --dev

# 2. Setup error tracking (Sentry, Bugsnag, etc.)
composer require sentry/sentry-laravel
```

#### B. Backup Strategy
```bash
# 1. Database backup (daily)
mysqldump -u username -p csirt_beacukai_prod > backup_$(date +%Y%m%d).sql

# 2. File backup (weekly)
tar -czf files_backup_$(date +%Y%m%d).tar.gz storage/ public/storage/

# 3. Google Sheets backup (automatic)
# Data already synced to Google Sheets as primary storage
```

### 7. **Performance Optimization**

#### A. Caching
```bash
# Enable OPCache in php.ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000

# Redis caching
CACHE_DRIVER=redis
SESSION_DRIVER=redis
```

#### B. Asset Optimization
```bash
# Build optimized assets
npm run production

# Enable gzip compression in web server
# Enable browser caching for static assets
```

### 8. **DNS & Domain Setup**

#### A. DNS Records
```
A     csirt.beacukai.go.id     -> SERVER_IP
CNAME www.csirt.beacukai.go.id -> csirt.beacukai.go.id
```

#### B. Search Engine Submission
1. **Google Search Console**
   - Verify domain ownership
   - Submit sitemap.xml
   - Monitor search performance

2. **Bing Webmaster Tools**
   - Add and verify site
   - Submit sitemap

### 9. **Keywords & SEO Strategy**

#### Target Keywords:
- "CSIRT Bea Cukai"
- "Cyber Security Bea Cukai"
- "Keamanan Siber Dirjen Bea Cukai"
- "Tim Tanggap Insiden Keamanan Siber"
- "Computer Security Incident Response Team Bea Cukai"

#### Content Strategy:
- ✅ Regular artikel cyber security
- ✅ Panduan keamanan siber
- ✅ Update threat intelligence
- ✅ Best practices security

### 10. **Final Production Commands**
```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper permissions
sudo chown -R www-data:www-data .
sudo chmod -R 755 storage bootstrap/cache
```

---

## 🚀 Go Live Checklist

- [ ] Domain & DNS configured
- [ ] SSL certificate installed
- [ ] Database migrated
- [ ] Environment variables set
- [ ] Assets built and optimized
- [ ] Caching enabled
- [ ] Security headers configured
- [ ] Backup strategy implemented
- [ ] Monitoring tools setup
- [ ] Search engines submitted
- [ ] Performance tested

**Status**: Ready for Production 🎉
