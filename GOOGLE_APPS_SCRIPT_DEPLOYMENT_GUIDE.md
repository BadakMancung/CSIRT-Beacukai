## 🚀 DEPLOY GOOGLE APPS SCRIPT - SECURITY UPDATE

### **LANGKAH DEPLOYMENT WAJIB**

⚠️ **PENTING**: Google Apps Script harus di-deploy ulang dengan function baru untuk keamanan Level 3!

### **1. Buka Google Apps Script**
```
1. Buka https://script.google.com
2. Pilih project CSIRT Beacukai yang sudah ada
3. Atau buat project baru jika belum ada
```

### **2. Update Code dengan Version Terbaru**
```
1. Copy semua isi dari file: FINAL_COMPLETE_GOOGLE_APPS_SCRIPT.js
2. Paste ke editor Google Apps Script
3. Ganti semua code yang ada
```

### **3. Function Baru yang Ditambahkan**
- ✅ `uploadContactFile(fileData)` - Upload secure ke Google Drive  
- ✅ `handleSecureFileUpload(data)` - Management file aman
- ✅ `getOrCreateSecureFolder()` - Folder Drive terproteksi
- ✅ Action: `upload_contact_file` - Endpoint untuk contact form

### **4. Deploy as Web App**
```
1. Klik tombol "Deploy" → "New deployment"
2. Pilih type: "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone" 
5. Click "Deploy"
6. Copy WEB APP URL
```

### **5. Update Environment Laravel**
```env
# File: .env
GOOGLE_SHEETS_WEB_APP_URL=YOUR_NEW_WEB_APP_URL_HERE
```

### **6. Test Deployment**
Jalankan command ini untuk test:
```bash
# Test upload function
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{"action":"upload_contact_file","file_data":{"content":"dGVzdA==","filename":"test.txt","original_name":"test.txt","mime_type":"text/plain","size":4,"contact_id":"test123"}}'
```

### **7. Verifikasi di Google Drive**
```
1. Buka Google Drive
2. Cek folder "CSIRT_Secure_Files" 
3. Pastikan file test masuk dengan nama yang di-hash
```

---

### **TROUBLESHOOTING**

**Error: "Missing required parameters"**
```
❌ Deployment belum selesai
✅ Ulangi step 4-5 dengan benar
```

**Error: "Function not found"**  
```
❌ Code belum di-update ke version terbaru
✅ Copy paste ulang dari FINAL_COMPLETE_GOOGLE_APPS_SCRIPT.js
```

**File tidak masuk Google Drive**
```
❌ Permission Google Drive belum diaktifkan
✅ First time run akan minta permission - klik Allow All
```

---

### **SECURITY BENEFITS**

✅ **Level 3 Security Achieved:**
- File disimpan di Google Drive (tidak di server)
- Nama file di-hash dengan timestamp
- Folder Drive khusus dengan permission terbatas  
- Email hanya berisi link Google Drive
- Tidak ada brute force attack vector
- Audit log lengkap di Google Sheets

⚠️ **Files lama yang ada di `/storage/app/public/` masih bisa diakses. Hapus manual jika diperlukan.**

---

### **NEXT STEPS**
1. ✅ Deploy Google Apps Script 
2. ✅ Update .env dengan WEB APP URL baru
3. ✅ Test contact form dengan file upload
4. ✅ Verify email notification berisi Google Drive link
5. ✅ Confirm files stored in Google Drive only
