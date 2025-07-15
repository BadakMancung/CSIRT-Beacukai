# Setup Google Apps Script V3 untuk CRUD Operations

## 🚀 Fitur Baru
Script ini mendukung operasi CRUD lengkap:
- ✅ **CREATE** - Menambah data baru 
- ✅ **READ** - Membaca semua data
- ✅ **UPDATE** - Mengupdate data berdasarkan ID
- ✅ **DELETE** - Menghapus data berdasarkan ID

## 📋 Langkah Setup

### 1. Buat Google Apps Script Project
1. Buka [Google Apps Script](https://script.google.com)
2. Klik **New Project**
3. Copy paste code dari `COMPLETE_GOOGLE_APPS_SCRIPT_V3.js`

### 2. Update Konfigurasi Spreadsheet IDs
Edit bagian ini dalam script:

```javascript
const SPREADSHEET_IDS = {
  article: 'YOUR_ARTICLES_SPREADSHEET_ID',  // Ganti dengan ID spreadsheet artikel
  event: 'YOUR_EVENTS_SPREADSHEET_ID',      // Ganti dengan ID spreadsheet event  
  contact: 'YOUR_CONTACTS_SPREADSHEET_ID'   // Ganti dengan ID spreadsheet kontak
};
```

### 3. Cara Mendapatkan Spreadsheet ID
1. Buka Google Sheets
2. Copy ID dari URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
3. Paste ke konfigurasi script

### 4. Setup Sheet Structure
Pastikan setiap spreadsheet memiliki sheet dengan nama:
- **Articles**: Sheet bernama "Articles"
- **Events**: Sheet bernama "Events" 
- **ContactForms**: Sheet bernama "ContactForms"

### 5. Header Columns
Pastikan spreadsheet memiliki header yang sesuai:

#### Articles Sheet:
```
id | title | excerpt | content | image | image_url | author | is_published | published_at | created_at | updated_at
```

#### Events Sheet:
```
id | title | description | event_date | location | image | image_url | is_published | created_at | updated_at
```

#### ContactForms Sheet:
```
id | name | email | subject | message | created_at | updated_at
```

### 6. Deploy Script
1. Klik **Deploy** > **New deployment**
2. Pilih type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Klik **Deploy**
6. Copy **Web app URL**

### 7. Update Laravel .env
```env
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## 🔧 Testing Script

### Test di Google Apps Script Editor:
1. Pilih function `testScript`
2. Klik **Run**
3. Check logs untuk melihat hasil

### Test dari Laravel:
Monitor log dengan command:
```bash
tail -f storage/logs/laravel.log
```

## 📊 Expected Request Format

### CREATE:
```json
{
  "type": "article",
  "action": "create", 
  "title": "Sample Title",
  "content": "Sample content",
  "author": "Admin"
}
```

### UPDATE:
```json
{
  "type": "article",
  "action": "update",
  "id": "123456789",
  "title": "Updated Title"
}
```

### DELETE:
```json
{
  "type": "article", 
  "action": "delete",
  "id": "123456789"
}
```

### READ:
```json
{
  "type": "article",
  "action": "read"
}
```

## ✅ Troubleshooting

### Jika UPDATE/DELETE tidak berfungsi:
1. Check Google Apps Script logs
2. Check Laravel logs: `tail -f storage/logs/laravel.log`
3. Pastikan spreadsheet ID benar
4. Pastikan permission Google Apps Script sudah benar

### Jika CREATE tidak berfungsi:
1. Check header columns di spreadsheet
2. Check data format yang dikirim
3. Check Google Apps Script execution transcript

## 🔐 Permissions
Pastikan Google Apps Script memiliki permission:
- Google Sheets API
- URL Fetch API  
- Properties Service (jika diperlukan)

## 📝 Catatan Penting
- Script ini menggunakan timestamp sebagai ID jika tidak disediakan
- Field `updated_at` otomatis diupdate saat UPDATE operation
- DELETE operation akan menghapus row secara permanen
- Backup data secara berkala untuk keamanan
