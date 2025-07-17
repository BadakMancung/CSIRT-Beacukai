# 🔐 LEVEL 3 ENTERPRISE SECURITY IMPLEMENTATION

## 🎯 **FITUR KEAMANAN YANG DIIMPLEMENTASIKAN**

### **✅ 1. Cloud Storage Integration (Google Drive)**
- ✅ File disimpan terenkripsi di Google Drive folder khusus
- ✅ Folder "Secure_Attachments" dengan akses private
- ✅ Integrasi dengan Google Apps Script untuk management

### **✅ 2. File Encryption (AES-256-CBC)**
- ✅ Enkripsi file sebelum upload ke Google Drive
- ✅ Key encryption menggunakan Laravel encryption key
- ✅ Dekripsi on-demand saat download

### **✅ 3. Access Expiration**
- ✅ File otomatis expire setelah 30 hari
- ✅ Manual expiration oleh admin
- ✅ Auto cleanup expired files via command

### **✅ 4. Audit Logs**
- ✅ Log semua akses file (upload, download, view, expire)
- ✅ Tracking user, IP address, timestamp, reason
- ✅ Admin panel untuk view access logs

---

## 🚀 **CARA IMPLEMENTASI**

### **1. Upload Secure File**
```php
// File akan otomatis ter-handle dengan Level 3 security
// ketika user upload via contact form
```

### **2. Akses File (Admin Only)**
```
URL: /admin/secure-attachments/{fileId}/view
- Membutuhkan login admin
- Menampilkan info file dan access logs
- Tombol download, generate temp link, expire
```

### **3. Temporary Access (Public tapi Time-Limited)**
```
URL: /secure-file/{token}
- Token expire dalam 1 jam (default)
- One-time use token
- No authentication required tapi time-limited
```

---

## 🔧 **KONFIGURASI YANG DIPERLUKAN**

### **1. Environment Variables (.env)**
```bash
# Google Apps Script Configuration
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/your-web-app-url

# Secure File Management
FILE_ENCRYPTION_KEY=your-32-char-encryption-key
SECURE_FILE_EXPIRY_DAYS=30
```

### **2. Google Apps Script Setup**

#### **Folder Structure di Google Drive:**
```
📁 FOLDER_ID (sesuai config)
  └── 📁 Secure_Attachments (auto-created, private)
      └── 🔐 encrypted_files...
```

#### **Google Sheets Structure:**
```
📊 secure_files sheet:
- file_id, drive_url, contact_id, original_name, secure_filename
- file_size, mime_type, encryption_algorithm, access_count
- upload_ip, expires_at, created_at, is_active

📊 file_access_logs sheet:
- file_id, access_type, success, reason, user
- ip_address, user_agent, timestamp

📊 temp_tokens sheet:
- token, file_id, expires_at, created_by, created_at, used
```

---

## 🛡️ **KEAMANAN BERLAPIS**

### **Layer 1: Encryption**
- File content dienkripsi dengan AES-256-CBC
- Encryption key berbeda untuk setiap deployment
- IV (Initialization Vector) unique per file

### **Layer 2: Access Control**
- Admin: Full access dengan authentication
- Temporary token: Time-limited, one-time use
- No direct access ke file di Google Drive

### **Layer 3: Audit & Monitoring**
- Setiap akses tercatat dengan detail lengkap
- IP tracking dan user identification
- Access pattern monitoring

### **Layer 4: Expiration & Cleanup**
- Auto-expire files setelah periode tertentu
- Manual expiration oleh admin
- Scheduled cleanup via cron job

---

## 📱 **CARA PENGGUNAAN**

### **A. Untuk User (Public)**
1. Upload file via contact form
2. File otomatis dienkripsi dan disimpan aman
3. Admin dapat generate temporary link jika diperlukan

### **B. Untuk Admin**
1. **View File Info:**
   ```
   GET /admin/secure-attachments/{fileId}/view
   ```

2. **Download File:**
   ```
   GET /admin/secure-attachments/{fileId}/download
   ```

3. **Generate Temporary Access:**
   ```
   POST /admin/secure-attachments/{fileId}/temp-access
   Body: { "expires_in_minutes": 60 }
   ```

4. **Expire File:**
   ```
   POST /admin/secure-attachments/{fileId}/expire
   Body: { "reason": "Manual expiration" }
   ```

5. **View Access Logs:**
   ```
   GET /admin/secure-attachments/{fileId}/logs
   ```

### **C. Maintenance**
```bash
# Cleanup expired files (run via cron)
php artisan files:cleanup-expired
```

---

## 🎨 **ADMIN PANEL FEATURES**

### **Dashboard Secure Attachment:**
- 📊 File information (size, type, access count)
- 🕒 Expiration status and countdown
- 📥 Secure download button
- 🔗 Generate temporary access link
- ❌ Manual expire button
- 📜 Complete access logs table
- 🔄 Real-time data refresh

### **Email Notification Updates:**
- 🔐 Security level badge (LEVEL 3 SECURITY)
- ⏰ Expiration warning
- 🔗 Secure access link (authentication required)

---

## 🚨 **KEAMANAN CHECKLIST**

### **✅ Implemented Security Measures:**
- [x] File encryption (AES-256-CBC)
- [x] Secure cloud storage (Google Drive private)
- [x] Access authentication (admin login required)
- [x] Time-based expiration (30 days default)
- [x] Audit logging (comprehensive access logs)
- [x] Temporary access tokens (time-limited, one-time)
- [x] IP address tracking
- [x] User agent logging
- [x] Manual file expiration
- [x] Automated cleanup
- [x] Secure filename generation (64-char random)
- [x] No direct URL access
- [x] CSRF protection
- [x] Input validation and sanitization

### **🔒 Security Best Practices:**
- Files tidak dapat diakses langsung via URL
- Semua akses memerlukan autentikasi atau token valid
- Token temporary adalah one-time use
- Encryption key terpisah dari database
- Audit trail untuk compliance
- Auto-cleanup untuk data retention

---

## 📈 **MONITORING & MAINTENANCE**

### **Regular Tasks:**
1. **Daily:** Monitor access logs untuk suspicious activity
2. **Weekly:** Review expired files dan cleanup stats
3. **Monthly:** Audit user access patterns
4. **Quarterly:** Review encryption key rotation

### **Alerts Setup:**
- Failed access attempts > 5 per hour
- Unusual download patterns
- File access from unknown IP ranges
- Token generation spikes

---

## 🔍 **TROUBLESHOOTING**

### **Common Issues:**

1. **File not found error:**
   - Check file expiration status
   - Verify file_id in secure_files sheet
   - Check Google Drive file existence

2. **Encryption/decryption failed:**
   - Verify FILE_ENCRYPTION_KEY in .env
   - Check file integrity in Google Drive
   - Confirm encryption algorithm compatibility

3. **Access denied:**
   - Verify admin authentication
   - Check token expiration for temp access
   - Confirm user permissions

4. **Google Apps Script timeout:**
   - Check GOOGLE_SHEETS_WEB_APP_URL
   - Verify script deployment and permissions
   - Monitor Google Apps Script quota

---

## 🚀 **FUTURE ENHANCEMENTS**

### **Possible Improvements:**
- Multi-factor authentication for file access
- File version control and backup
- Advanced user role management
- Integration dengan external SIEM
- Real-time notification untuk suspicious access
- File integrity verification dengan checksums
- Geo-location based access restrictions

---

Implementasi Level 3 Enterprise Security ini memberikan perlindungan maksimal untuk file attachment dengan tetap mempertahankan kemudahan penggunaan untuk admin dan fleksibilitas untuk sharing temporary access.
