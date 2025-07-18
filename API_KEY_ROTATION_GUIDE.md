# 🔐 API KEY ROTATION SYSTEM - IMPLEMENTATION GUIDE

## 📋 **OVERVIEW**

Sistem API Key Rotation telah diimplementasikan untuk meningkatkan keamanan aplikasi CSIRT Bea Cukai dengan rotasi otomatis API keys secara berkala dan emergency rotation ketika terjadi kompromi.

---

## 🚀 **FEATURES YANG DIIMPLEMENTASIKAN**

### **1. Automatic API Key Rotation**
- ✅ Rotasi otomatis berdasarkan schedule
- ✅ Emergency rotation untuk keys yang compromised
- ✅ Backup otomatis sebelum rotasi
- ✅ Validasi API key baru setelah rotasi
- ✅ Logging dan audit trail lengkap

### **2. Supported Services**
- ✅ **SendGrid API Key** (90 hari)
- ✅ **Telegram Bot Token** (180 hari)  
- ✅ **File Encryption Key** (365 hari)
- ✅ **Admin Password** (90 hari)

### **3. Security Features**
- ✅ Secure password generation
- ✅ Backup dan restore functionality
- ✅ Emergency rotation procedures
- ✅ Real-time notifications
- ✅ Audit logging

---

## 🛠️ **CARA PENGGUNAAN**

### **Manual Rotation via Command Line**

```bash
# Rotate semua API keys
php artisan security:rotate-api-keys --service=all --backup

# Rotate specific service
php artisan security:rotate-api-keys --service=sendgrid --force

# Check rotation status
php artisan security:check-api-rotation --alert

# Emergency rotation
php artisan security:rotate-api-keys --service=sendgrid --force
```

### **Web Dashboard Management**

```php
// Access via admin panel
https://your-domain.com/admin/api-keys

// Available endpoints:
GET  /admin/api-keys           # Dashboard
POST /admin/api-keys/rotate    # Manual rotation
POST /admin/api-keys/emergency-rotate  # Emergency rotation
POST /admin/api-keys/schedule  # Schedule future rotation
POST /admin/api-keys/validate  # Validate new keys
GET  /admin/api-keys/history   # Rotation history
```

### **Programmatic Usage**

```php
use App\Services\ApiKeyManager;

$apiKeyManager = app(ApiKeyManager::class);

// Check what needs rotation
$needsRotation = $apiKeyManager->checkRotationNeeded();

// Emergency rotation
$result = $apiKeyManager->emergencyRotation('sendgrid', 'Key possibly compromised');

// Schedule rotation
$apiKeyManager->scheduleRotation('telegram', now()->addDays(7));

// Validate new key
$isValid = $apiKeyManager->validateApiKey('sendgrid', $newApiKey);
```

---

## ⚙️ **CONFIGURATION**

### **Environment Variables**

```env
# Tambahkan ke .env file
API_ROTATION_ENABLED=true
API_ROTATION_BACKUP_RETENTION_DAYS=90
API_ROTATION_NOTIFICATION_EMAIL=security@beacukai.go.id

# Security logging
LOG_CHANNEL_SECURITY=daily
LOG_SECURITY_RETENTION_DAYS=365
```

### **Rotation Schedule**

```php
// Di ApiKeyManager.php - dapat disesuaikan
protected $rotationSchedule = [
    'sendgrid' => 90,        // days
    'telegram' => 180,       // days  
    'file_encryption' => 365, // days
    'admin_password' => 90,   // days
];
```

---

## 🔄 **AUTOMATION SETUP**

### **Cron Job Configuration**

```bash
# Tambahkan ke crontab untuk automatic checking
# Check every day at 2 AM
0 2 * * * cd /path/to/your/app && php artisan security:check-api-rotation --alert

# Auto-rotate critical overdue keys weekly
0 3 * * 0 cd /path/to/your/app && php artisan security:check-api-rotation --auto-rotate
```

### **Laravel Scheduler**

```php
// Tambahkan ke app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // Check rotation status daily
    $schedule->command('security:check-api-rotation --alert')
             ->daily()
             ->at('02:00');

    // Auto-rotate critical keys weekly  
    $schedule->command('security:check-api-rotation --auto-rotate')
             ->weekly()
             ->sundays()
             ->at('03:00');
}
```

---

## 🚨 **EMERGENCY PROCEDURES**

### **When API Key is Compromised**

```bash
# Step 1: Emergency rotation
php artisan security:rotate-api-keys --service=sendgrid --force --backup

# Step 2: Manual steps (akan ditampilkan di output)
# - Login ke SendGrid dashboard
# - Generate new API key
# - Update .env dengan key baru
# - Update Google Apps Script
# - Delete old key dari provider

# Step 3: Validate new key
# Test functionality dengan key baru
```

### **Rollback Procedure**

```bash
# Jika terjadi masalah, restore dari backup
# Backup tersimpan di: storage/backups/api-keys/

# 1. Copy backup .env
cp storage/backups/api-keys/.env_backup_YYYY-MM-DD_HH-ii-ss .env

# 2. Clear cache
php artisan config:clear
php artisan cache:clear

# 3. Restart application
php artisan queue:restart
```

---

## 📊 **MONITORING & ALERTS**

### **Dashboard Metrics**

```php
// Metrics yang dipantau:
- Last rotation date untuk setiap service
- Days until next rotation
- Failed rotation attempts
- Emergency rotations triggered
- Key validation status
```

### **Alert Conditions**

```php
// Alerts dikirim ketika:
- API key overdue > 7 days (WARNING)
- API key overdue > 30 days (CRITICAL)
- Failed rotation attempts (ERROR)
- Emergency rotation triggered (CRITICAL)
- Invalid key detected (ERROR)
```

---

## 🔍 **SECURITY AUDIT TRAIL**

### **What Gets Logged**

```php
// Semua aktivitas tercatat di security log:
- Rotation requests (manual/automatic)
- Successful/failed rotations
- Emergency rotations with reasons
- Key validation attempts
- Backup creation/restoration
- Schedule changes
```

### **Log Locations**

```bash
# Security logs
storage/logs/security/security-YYYY-MM-DD.log

# Rotation backups  
storage/backups/api-keys/

# Google Apps Script updates
storage/api-keys/google_apps_script_update_*.js
```

---

## ✅ **POST-IMPLEMENTATION CHECKLIST**

### **Immediate Actions Required**

```bash
# 1. Update current credentials
php artisan security:rotate-api-keys --service=all --backup

# 2. Setup cron jobs
crontab -e
# Add the cron entries above

# 3. Test emergency rotation
php artisan security:rotate-api-keys --service=telegram --force

# 4. Configure notifications
# Update NOTIFICATION_EMAIL in .env

# 5. Train team on procedures
# Share this documentation with team
```

### **Verification Steps**

```bash
# 1. Check rotation status
php artisan security:check-api-rotation

# 2. Test web dashboard
# Visit /admin/api-keys

# 3. Verify logging
tail -f storage/logs/security/security-*.log

# 4. Test backup/restore
# Manually trigger rotation and verify backup creation
```

---

## 🎯 **INTEGRATION DENGAN GOOGLE APPS SCRIPT**

### **Setelah Rotasi API Key**

```javascript
// File akan dibuat otomatis di: storage/api-keys/
// Copy content ke Google Apps Script:

// 1. Update SENDGRID_API_KEY
const SENDGRID_API_KEY = "SG.new_key_here";

// 2. Update TELEGRAM_BOT_TOKEN  
const TELEGRAM_BOT_TOKEN = "new_token_here";

// 3. Test integration
// Kirim test email/telegram untuk verify
```

### **PropertiesService Integration** (Recommended)

```javascript
// Untuk keamanan maksimal, gunakan PropertiesService:
function setupSecureProperties() {
    const properties = PropertiesService.getScriptProperties();
    properties.setProperties({
        'SENDGRID_API_KEY': 'your_new_sendgrid_key',
        'TELEGRAM_BOT_TOKEN': 'your_new_telegram_token'
    });
}

// Kemudian gunakan di script:
const SENDGRID_API_KEY = PropertiesService.getScriptProperties().getProperty('SENDGRID_API_KEY');
```

---

## 🚀 **BENEFITS YANG DIDAPAT**

### **Security Improvements**
- ✅ **Regular key rotation** mengurangi window of exposure
- ✅ **Emergency rotation** untuk response cepat terhadap breach
- ✅ **Automated backup** mencegah data loss
- ✅ **Audit trail** untuk compliance dan forensik

### **Operational Benefits**  
- ✅ **Automated process** mengurangi human error
- ✅ **Centralized management** untuk semua API keys
- ✅ **Real-time monitoring** dan alerting
- ✅ **Easy rollback** jika terjadi masalah

---

## 📞 **SUPPORT & TROUBLESHOOTING**

### **Common Issues**

```bash
# Issue: Rotation gagal
# Solution: Check logs dan retry dengan --force

# Issue: New key tidak valid
# Solution: Manual verification dan rollback ke backup

# Issue: Google Apps Script tidak update
# Solution: Manual update menggunakan generated script file
```

### **Emergency Contacts**

```bash
# Jika terjadi masalah kritis:
1. Check security logs: storage/logs/security/
2. Restore dari backup terakhir
3. Contact security team
4. Document incident untuk post-mortem
```

---

**🛡️ API Key Rotation System berhasil diimplementasikan dengan Level 3 Enterprise Security!**
