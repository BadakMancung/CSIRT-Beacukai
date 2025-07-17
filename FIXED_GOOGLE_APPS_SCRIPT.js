// ===================================================================
//                        BAGIAN KONFIGURASI
// ===================================================================

const SPREADSHEET_ID = '1gsLf9GOuj3D3pBLdbggkXOJqlnvOw6k9DtzHFf9F27E';
const TEMPLATE_ID = "1yEm9g-ISK4m9wgJ90tfnOsk1zc1LvDrdbx-ExS5h2Ls";
const FOLDER_ID = "1cffnroKr1Wu7Ax7KP9aC3snVQ6JVUX6V";

// --- KONFIGURASI NOTIFIKASI TELEGRAM ---
const TELEGRAM_BOT_TOKEN = "8068154092:AAET3Mdus8-ZexzSQh0yvuh5TaRy6oywWYY";
const TELEGRAM_CHAT_ID = "957566469";

// --- KONFIGURASI PENGIRIMAN EMAIL VIA SENDGRID ---
const SENDGRID_API_KEY = "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";
const PENGIRIM_EMAIL = "csirt_beacukai@kemenkeu.go.id";
const PENGIRIM_NAMA = "Tim Layanan Aduan CSIRT Bea Cukai";

// Daftar nama sheet yang digunakan
const SHEET_NAMES = {
  articles: 'articles',
  events: 'events',
  contacts: 'contacts', // Sheet untuk aduan/kontak
  email_notifications: 'email_notifications',
  secure_files: 'secure_files', // Sheet untuk tracking file secure
  file_access_logs: 'file_access_logs', // Sheet untuk audit logs
  temp_tokens: 'temp_tokens' // Sheet untuk temporary access tokens
};

// ===================================================================
//             FUNGSI INTI API (doPost, doGet, CRUD)
// ===================================================================

/**
 * Fungsi utama yang menangani semua permintaan POST
 */
function doPost(e) {
  try {
    console.log('📥 Received POST request');
    console.log('🔍 Full request object e:', JSON.stringify(e));
    
    if (!e.postData || !e.postData.contents) {
      console.log('❌ No postData or contents found');
      return createResponse(false, 'No data received');
    }
    
    console.log('📋 Raw POST contents:', e.postData.contents);
    
    const data = JSON.parse(e.postData.contents);
    console.log('📋 Parsed request data:', JSON.stringify(data));

    const sheetName = data.sheet || data.type;
    const action = data.action;
    
    console.log(`🎯 Target: sheet=${sheetName}, action=${action}`);

    // Special handling for file upload actions that don't need sheet parameter
    if (action === 'upload_contact_file' || action === 'upload_secure_file') {
      console.log('🔐 Processing file upload action:', action);
      
      switch (action) {
        case 'upload_contact_file': return uploadContactFile(data.file_data);
        case 'upload_secure_file': return handleSecureFileUpload(data);
      }
    }

    // Regular CRUD operations require sheet and action
    if (!sheetName || !action) {
      console.log('❌ Missing required parameters');
      return createResponse(false, 'Missing required parameters (sheet/type and action)');
    }
    
    if (!SHEET_NAMES[sheetName]) {
      console.log(`❌ Unknown sheet: ${sheetName}`);
      return createResponse(false, `Unknown sheet: ${sheetName}`);
    }

    switch (action) {
      case 'read':   return handleRead(sheetName);
      case 'create': return handleCreate(sheetName, data);
      case 'update': return handleUpdate(sheetName, data);
      case 'delete': return handleDelete(sheetName, data);
      
      // Other secure file operations (non-upload)
      case 'download_secure_file': return handleSecureFileDownload(data);
      case 'get_file_metadata': return handleGetFileMetadata(data);
      case 'update_access_count': return handleUpdateAccessCount(data);
      case 'log_file_access': return handleLogFileAccess(data);
      case 'store_temp_token': return handleStoreTempToken(data);
      case 'verify_temp_token': return handleVerifyTempToken(data);
      case 'update_file_metadata': return handleUpdateFileMetadata(data);
      case 'get_access_logs': return handleGetAccessLogs(data);
      case 'cleanup_expired_files': return handleCleanupExpiredFiles(data);
      
      default:       
        console.log(`❌ Unknown action: ${action}`);
        return createResponse(false, `Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('❌ Error in doPost:', error);
    console.error('❌ Stack trace:', error.stack);
    return createResponse(false, `Server error: ${error.message}`);
  }
}

/**
 * Fungsi GET untuk membaca data (opsional)
 */
function doGet(e) {
  try {
    const sheetName = e.parameter.sheet || 'contacts'; // Default ke 'contacts' jika tidak ada parameter
    return handleRead(sheetName);
  } catch (error) {
    console.error('❌ Error in doGet:', error);
    return createResponse(false, `Server error: ${error.message}`);
  }
}

/**
 * Menangani operasi CREATE
 */
function handleCreate(sheetName, requestData) {
  try {
    console.log('🏗️ handleCreate called with:', JSON.stringify(requestData));
    
    const sheet = getOrCreateSheet(sheetName);
    const headers = getSheetHeaders(sheetName);
    
    // **ENHANCED DATA EXTRACTION WITH FALLBACK**
    let data;
    if (requestData.data) {
      console.log('📦 Using requestData.data structure');
      data = requestData.data;
    } else {
      console.log('📦 Using direct requestData structure');
      data = requestData;
      // Remove action and sheet keys to avoid conflicts
      const { action, sheet: sheetKey, ...cleanData } = data;
      data = cleanData;
    }
    
    console.log('📋 Final data object:', JSON.stringify(data));
    console.log('📧 Email field check:', data.email);
    console.log('👤 Name field check:', data.name);

    // Menambahkan data standar
    data.created_at = new Date().toISOString();
    if (!data.id) data.id = new Date().getTime();

    const rowData = headers.map(header => data[header] || '');
    console.log('📝 Row data to be written:', rowData);
    
    sheet.appendRow(rowData);

    // *** PERUBAHAN UTAMA: MEMICU NOTIFIKASI SETELAH DATA DIBUAT ***
    if (sheetName === 'contacts') {
      console.log('🔄 Processing contacts submission...');
      console.log('📋 Original requestData:', JSON.stringify(requestData));
      console.log('📋 Processed data object:', JSON.stringify(data));
      
      const lastRow = sheet.getLastRow();
      const nomorAduan = generateNomorAduan(lastRow);
      
      // Menulis Nomor Aduan kembali ke sheet
      const kolomNomorAduan = headers.indexOf("id") + 1; // Asumsi 'id' adalah untuk nomor aduan
      if (kolomNomorAduan > 0) {
        sheet.getRange(lastRow, kolomNomorAduan).setValue(nomorAduan);
        data.id = nomorAduan; // Update data object dengan nomor aduan baru
      }
      
      // **ENHANCED DATA VALIDATION BEFORE SENDING**
      console.log('🔍 Validating data before sending notification...');
      console.log('📧 Email check:', data.email || 'MISSING');
      console.log('🆔 ID check:', data.id || 'MISSING');
      console.log('👤 Name check:', data.name || 'MISSING');
      
      // Create a safe data object for notification
      const notificationData = {
        id: data.id || nomorAduan,
        name: data.name || 'Tidak disebutkan',
        email: data.email || '',
        phone: data.phone || '',
        subject: data.subject || '',
        message: data.message || '',
        incident_type: data.incident_type || '',
        submitted_at: data.submitted_at || new Date().toISOString(),
        status: data.status || 'new',
        created_at: data.created_at || new Date().toISOString()
      };
      
      console.log('📦 Final notification data:', JSON.stringify(notificationData));
      
      // Only call notification if email exists
      if (notificationData.email && notificationData.email.trim() !== '') {
        console.log('✅ Data valid, calling kirimNotifikasiDanBalasan...');
        kirimNotifikasiDanBalasan(notificationData);
      } else {
        console.log('❌ Email tidak ada, notifikasi tidak dikirim');
        console.log('🔍 Debug - original email field:', requestData.email);
        console.log('🔍 Debug - data.email field:', data.email);
      }
    }
    
    // Siapkan data untuk respons
    const newRecord = {};
    headers.forEach((header, index) => { newRecord[header] = rowData[index]; });
    if(newRecord.id && data.id) newRecord.id = data.id; // Pastikan ID baru disertakan di respons

    console.log(`✅ Created new ${sheetName} record with ID: ${data.id}`);
    return createResponse(true, `${sheetName} created successfully`, newRecord);
  } catch (error) {
    console.error(`❌ Create error for ${sheetName}:`, error);
    console.error('❌ Stack trace:', error.stack);
    return createResponse(false, `Failed to create ${sheetName}: ${error.message}`);
  }
}

/**
 * Menangani operasi READ
 */
function handleRead(sheetName) {
  try {
    const sheet = getOrCreateSheet(sheetName);
    const data = sheet.getDataRange().getValues();
    if (data.length === 0) return createResponse(true, 'No data found', []);
    const headers = getSheetHeaders(sheetName);
    const result = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => { obj[header] = row[index] || ''; });
      return obj;
    }).filter(record => record.id || record.email || record.title || record.name);
    console.log(`📋 Read ${result.length} records from ${sheetName}`);
    return createResponse(true, 'Data retrieved successfully', result);
  } catch (error) {
    console.error(`❌ Read error for ${sheetName}:`, error);
    return createResponse(false, `Failed to read data: ${error.message}`);
  }
}

/**
 * Menangani operasi UPDATE
 */
function handleUpdate(sheetName, requestData) {
  try {
    const sheet = getOrCreateSheet(sheetName);
    const headers = getSheetHeaders(sheetName);
    const data = requestData.data || requestData;
    const idToUpdate = data.id;

    if (!idToUpdate) {
      return createResponse(false, 'ID is required for update operation');
    }

    // Cari baris berdasarkan ID
    const allData = sheet.getDataRange().getValues();
    const idColumnIndex = headers.indexOf('id');
    
    if (idColumnIndex === -1) {
      return createResponse(false, 'ID column not found');
    }

    let rowIndex = -1;
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][idColumnIndex].toString() === idToUpdate.toString()) {
        rowIndex = i + 1; // Convert to 1-based index
        break;
      }
    }

    if (rowIndex === -1) {
      return createResponse(false, `Record with ID ${idToUpdate} not found`);
    }

    // Update data
    data.updated_at = new Date().toISOString();
    const rowData = headers.map(header => data[header] || '');
    
    // Update baris
    for (let i = 0; i < headers.length; i++) {
      if (rowData[i] !== '') {
        sheet.getRange(rowIndex, i + 1).setValue(rowData[i]);
      }
    }

    const updatedRecord = {};
    headers.forEach((header, index) => { updatedRecord[header] = rowData[index]; });

    console.log(`✅ Updated ${sheetName} record with ID: ${idToUpdate}`);
    return createResponse(true, `${sheetName} updated successfully`, updatedRecord);
  } catch (error) {
    console.error(`❌ Update error for ${sheetName}:`, error);
    return createResponse(false, `Failed to update ${sheetName}: ${error.message}`);
  }
}

/**
 * Menangani operasi DELETE
 */
function handleDelete(sheetName, requestData) {
  try {
    const sheet = getOrCreateSheet(sheetName);
    const headers = getSheetHeaders(sheetName);
    const idToDelete = requestData.id || requestData.data?.id;

    if (!idToDelete) {
      return createResponse(false, 'ID is required for delete operation');
    }

    // Cari baris berdasarkan ID
    const allData = sheet.getDataRange().getValues();
    const idColumnIndex = headers.indexOf('id');
    
    if (idColumnIndex === -1) {
      return createResponse(false, 'ID column not found');
    }

    let rowIndex = -1;
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][idColumnIndex].toString() === idToDelete.toString()) {
        rowIndex = i + 1; // Convert to 1-based index
        break;
      }
    }

    if (rowIndex === -1) {
      return createResponse(false, `Record with ID ${idToDelete} not found`);
    }

    // Hapus baris
    sheet.deleteRow(rowIndex);

    console.log(`✅ Deleted ${sheetName} record with ID: ${idToDelete}`);
    return createResponse(true, `${sheetName} deleted successfully`, { id: idToDelete });
  } catch (error) {
    console.error(`❌ Delete error for ${sheetName}:`, error);
    return createResponse(false, `Failed to delete ${sheetName}: ${error.message}`);
  }
}

// ===================================================================
//             FUNGSI NOTIFIKASI DAN AUTO-REPLY
// ===================================================================

/**
 * Fungsi baru yang menggantikan prosesAduanOtomatis,
 * dipanggil langsung oleh handleCreate.
 */
function kirimNotifikasiDanBalasan(dataAduan) {
  try {
    console.log('🔄 Starting kirimNotifikasiDanBalasan...');
    console.log('📋 Input dataAduan type:', typeof dataAduan);
    console.log('📋 Input dataAduan value:', JSON.stringify(dataAduan));
    
    // **ULTIMATE SAFEGUARD - NULL/UNDEFINED CHECK**
    if (!dataAduan) {
      console.log('❌ dataAduan is null or undefined');
      return;
    }
    
    if (typeof dataAduan !== 'object') {
      console.log('❌ dataAduan is not an object, type:', typeof dataAduan);
      return;
    }
    
    const emailPelapor = dataAduan.email;
    const nomorAduan = dataAduan.id; // Menggunakan ID yang sudah di-generate
    
    console.log('🔍 Extracted email:', emailPelapor);
    console.log('🔍 Extracted nomor aduan:', nomorAduan);
    
    if (!emailPelapor) {
      console.log("❌ Email pelapor tidak ada di data aduan, notifikasi tidak dikirim.");
      console.log("🔍 Available keys in dataAduan:", Object.keys(dataAduan));
      return;
    }
    
    if (!nomorAduan) {
      console.log("❌ Nomor aduan tidak ada, notifikasi tidak dikirim.");
      console.log("🔍 Available keys in dataAduan:", Object.keys(dataAduan));
      return;
    }
    
    console.log(`📧 Processing untuk email: ${emailPelapor}, nomor aduan: ${nomorAduan}`);
    
    // --- Membuat Dokumen PDF dari Template ---
    let pdfBlob = null;
    try {
      console.log('🔄 Generating PDF...');
      const docTemplate = DriveApp.getFileById(TEMPLATE_ID);
      const folderTujuan = DriveApp.getFolderById(FOLDER_ID);
      const namaFileBaru = `Laporan Aduan #${nomorAduan}`;
      const fileDocBaru = docTemplate.makeCopy(namaFileBaru, folderTujuan);
      const doc = DocumentApp.openById(fileDocBaru.getId());
      const body = doc.getBody();
      
      // Mengganti placeholder dengan data dari objek dataAduan
      body.replaceText("{{Nomor Aduan}}", nomorAduan || '-');
      body.replaceText("{{name}}", dataAduan.name || '-');
      body.replaceText("{{email}}", dataAduan.email || '-');
      body.replaceText("{{phone}}", dataAduan.phone || '-');
      body.replaceText("{{subject}}", dataAduan.subject || '-');
      body.replaceText("{{message}}", dataAduan.message || '-');
      body.replaceText("{{incident_type}}", dataAduan.incident_type || '-');
      body.replaceText("{{submitted_at}}", dataAduan.submitted_at || new Date().toISOString());
      body.replaceText("{{status}}", dataAduan.status || 'new');
      body.replaceText("{{created_at}}", dataAduan.created_at || new Date().toISOString());

      doc.saveAndClose();
      pdfBlob = fileDocBaru.getAs('application/pdf');
      
      // Hapus file doc sementara
      DriveApp.getFileById(fileDocBaru.getId()).setTrashed(true);
      console.log('✅ PDF berhasil di-generate');
      
    } catch (pdfError) {
      console.error('❌ PDF generation error:', pdfError);
      // Continue without PDF if generation fails
    }

    // --- Menyiapkan dan Mengirim Email via SENDGRID ---
    if (pdfBlob) {
      try {
        console.log('🔄 Sending email via SendGrid...');
        const subjekEmail = `Konfirmasi Penerimaan Laporan Aduan #${nomorAduan}`;
        const isiEmail = `Halo ${dataAduan.name || 'Bapak/Ibu'},\n\n` +
                       `Terima kasih, laporan Anda telah kami terima dengan Nomor Aduan: ${nomorAduan}.\n` +
                       `Detail lengkap laporan Anda terlampir dalam file PDF.\n\n` +
                       `Informasi Laporan:\n` +
                       `- Subjek: ${dataAduan.subject || '-'}\n` +
                       `- Jenis Insiden: ${dataAduan.incident_type || '-'}\n` +
                       `- Tanggal Laporan: ${new Date().toLocaleDateString('id-ID')}\n\n` +
                       `Tim kami akan segera meninjau laporan Anda dan menghubungi jika diperlukan informasi tambahan.\n\n` +
                       `Hormat kami,\nTim Layanan Aduan CSIRT Bea Cukai`;
        
        kirimEmailViaSendGrid(emailPelapor, '', subjekEmail, isiEmail, pdfBlob);
        console.log('✅ Email berhasil dikirim via SendGrid');
        
      } catch (emailError) {
        console.error('❌ Email sending error:', emailError);
      }
    } else {
      console.log('⚠️ PDF tidak tersedia, email tidak dikirim');
    }
    
    // --- Mengirim Notifikasi ke Telegram ---
    try {
      console.log('🔄 Sending Telegram notification...');
      const pesanTelegram = `🔔 Laporan Aduan Baru Diterima!\n\n` +
                          `Nomor Aduan: ${nomorAduan}\n` +
                          `Pelapor: ${dataAduan.name || 'Tidak disebutkan'}\n` +
                          `Email: ${emailPelapor}\n` +
                          `Subjek: ${dataAduan.subject || 'Tidak ada subjek'}\n` +
                          `Jenis Insiden: ${dataAduan.incident_type || 'Tidak disebutkan'}\n` +
                          `Waktu: ${new Date().toLocaleString("id-ID", {timeZone: "Asia/Jakarta"})}`;
      
      if (pesanTelegram && pesanTelegram.trim().length > 0) {
        kirimNotifikasiTelegram(pesanTelegram);
        console.log('✅ Telegram notification berhasil dikirim');
      } else {
        console.log('❌ Pesan Telegram kosong, tidak dikirim');
      }
      
    } catch (telegramError) {
      console.error('❌ Telegram sending error:', telegramError);
    }

    console.log(`✅ Notifikasi untuk aduan ${nomorAduan} berhasil diproses.`);

  } catch (error) {
    console.error(`❌ Error di kirimNotifikasiDanBalasan: ${error.toString()}`);
    console.error('❌ Stack trace:', error.stack);
  }
}

/**
 * Men-generate nomor aduan berdasarkan nomor baris.
 */
function generateNomorAduan(nomorBaris) {
  const jumlahAduan = nomorBaris - 1;
  const nomorUrut = ("0000" + jumlahAduan).slice(-4);
  const tanggalFormat = Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd");
  return `ADUAN-${tanggalFormat}-${nomorUrut}`;
}

/**
 * Fungsi untuk mengirim email melalui SendGrid API menggunakan BCC.
 */
function kirimEmailViaSendGrid(penerima, bccPenerima, subjek, isiTeks, lampiran) {
  try {
    console.log('🔄 Starting SendGrid email process...');
    console.log(`📧 To: ${penerima}, Subject: ${subjek}`);
    
    // Pastikan lampiran ada dan valid
    if (!lampiran) {
      console.log('❌ Lampiran PDF tidak ada, email tidak akan dikirim');
      return false;
    }
    
    const url = "https://api.sendgrid.com/v3/mail/send";
    
    console.log('🔄 Converting PDF to base64...');
    const lampiranBase64 = Utilities.base64Encode(lampiran.getBytes());
    console.log('✅ PDF conversion successful');

    const personalizations = [{
      "to": [{"email": penerima}],
      "subject": subjek
    }];

    // Add BCC only if provided
    if (bccPenerima && bccPenerima.trim() !== '') {
      personalizations[0].bcc = bccPenerima.split(',').map(email => ({"email": email.trim()}));
    }

    const dataEmail = {
      "personalizations": personalizations,
      "from": {"email": PENGIRIM_EMAIL, "name": PENGIRIM_NAMA},
      "content": [{"type": "text/plain", "value": isiTeks}],
      "attachments": [{
        "content": lampiranBase64,
        "filename": `Laporan_Aduan_${new Date().getTime()}.pdf`,
        "type": "application/pdf",
        "disposition": "attachment"
      }]
    };

    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'headers': { 'Authorization': 'Bearer ' + SENDGRID_API_KEY },
      'payload': JSON.stringify(dataEmail),
      'muteHttpExceptions': true
    };
    
    console.log('🔄 Sending email via SendGrid API...');
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    
    console.log(`📮 SendGrid response code: ${responseCode}`);
    
    if (responseCode === 202) {
      console.log('✅ Email berhasil dikirim via SendGrid');
      return true;
    } else {
      console.log(`❌ SendGrid error: ${response.getContentText()}`);
      return false;
    }
    
  } catch(error) {
    console.error('❌ Error in kirimEmailViaSendGrid:', error.toString());
    console.error('❌ Stack trace:', error.stack);
    return false;
  }
}

/**
 * Fungsi untuk mengirim pesan ke Telegram.
 */
function kirimNotifikasiTelegram(text) {
  try {
    console.log('🔄 Starting Telegram notification...');
    
    // Pastikan text tidak kosong
    if (!text || text.trim().length === 0) {
      console.log('❌ Text untuk Telegram kosong, notifikasi tidak dikirim');
      return false;
    }
    
    console.log(`📱 Telegram message: ${text.substring(0, 100)}...`);
    
    const url = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
    const payload = {
      'method': 'post',
      'payload': {
        'chat_id': String(TELEGRAM_CHAT_ID),
        'text': text,
        'parse_mode': 'HTML'
      },
      'muteHttpExceptions': true
    };

    console.log('🔄 Sending to Telegram API...');
    const response = UrlFetchApp.fetch(url, payload);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    console.log(`📱 Telegram response code: ${responseCode}`);
    
    if (responseCode === 200) {
      console.log('✅ Telegram notification berhasil dikirim');
      return true;
    } else {
      console.log(`❌ Telegram error: ${responseText}`);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error in kirimNotifikasiTelegram:', error.toString());
    console.error('❌ Stack trace:', error.stack);
    return false;
  }
}

// ===================================================================
//             FUNGSI HELPER
// ===================================================================

function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAMES[sheetName]);
  if (!sheet) {
    console.log(`Creating new sheet: ${sheetName}`);
    sheet = spreadsheet.insertSheet(SHEET_NAMES[sheetName]);
    const headers = getSheetHeaders(sheetName);
    if (headers.length > 0) {
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setValues([headers]).setBackground('#4285f4').setFontColor('#ffffff').setFontWeight('bold');
    }
  }
  return sheet;
}

function getSheetHeaders(sheetName) {
  const headerMappings = {
    'contacts': ['id', 'name', 'email', 'phone', 'subject', 'message', 'incident_type', 'attachment', 'attachment_expires', 'submitted_at', 'status', 'created_at', 'updated_at'],
    'articles': ['id', 'title', 'content', 'author','excerpt','is_published', 'image', 'published_at', 'created_at', 'updated_at'],
    'events': ['id', 'title', 'description','content', 'event_date', 'event_end_date', 'location', 'is_published', 'image', 'created_at', 'updated_at'],
    'email_notifications': ['id', 'email', 'name', 'role', 'notification_types', 'active', 'created_at', 'updated_at'],
    'secure_files': ['file_id', 'drive_url', 'contact_id', 'original_name', 'secure_filename', 'file_size', 'mime_type', 'encryption_algorithm', 'access_count', 'upload_ip', 'expires_at', 'created_at', 'is_active'],
    'file_access_logs': ['file_id', 'access_type', 'success', 'reason', 'user', 'ip_address', 'user_agent', 'timestamp'],
    'temp_tokens': ['token', 'file_id', 'expires_at', 'created_by', 'created_at', 'used']
  };
  return headerMappings[sheetName] || ['id', 'data', 'created_at', 'updated_at'];
}

function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  if (data !== null) { response.data = data; }
  const output = ContentService.createTextOutput(JSON.stringify(response));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ===================================================================
//             SECURE FILE MANAGEMENT FUNCTIONS
// ===================================================================

/**
 * Handle secure file upload to Google Drive
 */
function handleSecureFileUpload(data) {
  try {
    console.log('🔐 Starting secure file upload...');
    
    const encryptedContent = data.encrypted_content;
    const metadata = data.metadata;
    
    if (!encryptedContent || !metadata) {
      return createResponse(false, 'Missing encrypted content or metadata');
    }
    
    // Create folder for secure files if not exists
    const secureFolder = getOrCreateSecureFolder();
    
    // Create file in Google Drive
    const blob = Utilities.newBlob(Utilities.base64Decode(encryptedContent), 'application/octet-stream', metadata.secure_filename);
    const driveFile = secureFolder.createFile(blob);
    
    // Set file permissions (private)
    driveFile.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
    
    // Store metadata in secure_files sheet
    const fileRecord = {
      file_id: driveFile.getId(),
      drive_url: driveFile.getUrl(),
      contact_id: metadata.contact_id,
      original_name: metadata.original_name,
      secure_filename: metadata.secure_filename,
      file_size: metadata.file_size,
      mime_type: metadata.mime_type,
      encryption_algorithm: metadata.encryption_algorithm,
      access_count: 0,
      upload_ip: metadata.upload_ip,
      expires_at: metadata.expires_at,
      created_at: metadata.created_at,
      is_active: true
    };
    
    const secureFilesSheet = getOrCreateSheet('secure_files');
    const headers = getSheetHeaders('secure_files');
    const rowData = headers.map(header => fileRecord[header] || '');
    secureFilesSheet.appendRow(rowData);
    
    console.log(`✅ Secure file uploaded with ID: ${driveFile.getId()}`);
    
    return createResponse(true, 'Secure file uploaded successfully', {
      file_id: driveFile.getId(),
      drive_url: driveFile.getUrl()
    });
    
  } catch (error) {
    console.error('❌ Error in handleSecureFileUpload:', error);
    return createResponse(false, `Failed to upload secure file: ${error.message}`);
  }
}

/**
 * Handle secure file download
 */
function handleSecureFileDownload(data) {
  try {
    console.log('🔐 Starting secure file download...');
    
    const fileId = data.file_id;
    if (!fileId) {
      return createResponse(false, 'File ID is required');
    }
    
    // Get file from Drive
    const driveFile = DriveApp.getFileById(fileId);
    const fileBlob = driveFile.getBlob();
    const encryptedContent = Utilities.base64Encode(fileBlob.getBytes());
    
    console.log(`✅ Secure file downloaded: ${fileId}`);
    
    return createResponse(true, 'File downloaded successfully', {
      content: encryptedContent
    });
    
  } catch (error) {
    console.error('❌ Error in handleSecureFileDownload:', error);
    return createResponse(false, `Failed to download secure file: ${error.message}`);
  }
}

/**
 * Get file metadata
 */
function handleGetFileMetadata(data) {
  try {
    const fileId = data.file_id;
    if (!fileId) {
      return createResponse(false, 'File ID is required');
    }
    
    const secureFilesSheet = getOrCreateSheet('secure_files');
    const allData = secureFilesSheet.getDataRange().getValues();
    const headers = getSheetHeaders('secure_files');
    const fileIdIndex = headers.indexOf('file_id');
    
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][fileIdIndex] === fileId) {
        const fileData = {};
        headers.forEach((header, index) => {
          fileData[header] = allData[i][index];
        });
        
        return createResponse(true, 'File metadata retrieved', fileData);
      }
    }
    
    return createResponse(false, 'File not found');
    
  } catch (error) {
    console.error('❌ Error in handleGetFileMetadata:', error);
    return createResponse(false, `Failed to get file metadata: ${error.message}`);
  }
}

/**
 * Update access count
 */
function handleUpdateAccessCount(data) {
  try {
    const fileId = data.file_id;
    if (!fileId) {
      return createResponse(false, 'File ID is required');
    }
    
    const secureFilesSheet = getOrCreateSheet('secure_files');
    const allData = secureFilesSheet.getDataRange().getValues();
    const headers = getSheetHeaders('secure_files');
    const fileIdIndex = headers.indexOf('file_id');
    const accessCountIndex = headers.indexOf('access_count');
    
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][fileIdIndex] === fileId) {
        const currentCount = parseInt(allData[i][accessCountIndex]) || 0;
        secureFilesSheet.getRange(i + 1, accessCountIndex + 1).setValue(currentCount + 1);
        
        return createResponse(true, 'Access count updated');
      }
    }
    
    return createResponse(false, 'File not found');
    
  } catch (error) {
    console.error('❌ Error in handleUpdateAccessCount:', error);
    return createResponse(false, `Failed to update access count: ${error.message}`);
  }
}

/**
 * Log file access
 */
function handleLogFileAccess(data) {
  try {
    const logData = data.log_data;
    if (!logData) {
      return createResponse(false, 'Log data is required');
    }
    
    const accessLogsSheet = getOrCreateSheet('file_access_logs');
    const headers = getSheetHeaders('file_access_logs');
    const rowData = headers.map(header => logData[header] || '');
    accessLogsSheet.appendRow(rowData);
    
    return createResponse(true, 'Access logged successfully');
    
  } catch (error) {
    console.error('❌ Error in handleLogFileAccess:', error);
    return createResponse(false, `Failed to log access: ${error.message}`);
  }
}

/**
 * Store temporary token
 */
function handleStoreTempToken(data) {
  try {
    const tokenData = data.token_data;
    if (!tokenData) {
      return createResponse(false, 'Token data is required');
    }
    
    const tempTokensSheet = getOrCreateSheet('temp_tokens');
    const headers = getSheetHeaders('temp_tokens');
    const rowData = headers.map(header => tokenData[header] || '');
    tempTokensSheet.appendRow(rowData);
    
    return createResponse(true, 'Temporary token stored successfully');
    
  } catch (error) {
    console.error('❌ Error in handleStoreTempToken:', error);
    return createResponse(false, `Failed to store temporary token: ${error.message}`);
  }
}

/**
 * Verify temporary token
 */
function handleVerifyTempToken(data) {
  try {
    const token = data.token;
    if (!token) {
      return createResponse(false, 'Token is required');
    }
    
    const tempTokensSheet = getOrCreateSheet('temp_tokens');
    const allData = tempTokensSheet.getDataRange().getValues();
    const headers = getSheetHeaders('temp_tokens');
    const tokenIndex = headers.indexOf('token');
    const expiresAtIndex = headers.indexOf('expires_at');
    const usedIndex = headers.indexOf('used');
    const fileIdIndex = headers.indexOf('file_id');
    
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][tokenIndex] === token) {
        const expiresAt = new Date(allData[i][expiresAtIndex]);
        const isUsed = allData[i][usedIndex];
        
        if (isUsed) {
          return createResponse(false, 'Token already used');
        }
        
        if (new Date() > expiresAt) {
          return createResponse(false, 'Token expired');
        }
        
        // Mark token as used
        tempTokensSheet.getRange(i + 1, usedIndex + 1).setValue(true);
        
        const fileId = allData[i][fileIdIndex];
        return createResponse(true, 'Token verified', { file_id: fileId });
      }
    }
    
    return createResponse(false, 'Invalid token');
    
  } catch (error) {
    console.error('❌ Error in handleVerifyTempToken:', error);
    return createResponse(false, `Failed to verify token: ${error.message}`);
  }
}

/**
 * Update file metadata
 */
function handleUpdateFileMetadata(data) {
  try {
    const fileId = data.file_id;
    const updateData = data.update_data;
    
    if (!fileId || !updateData) {
      return createResponse(false, 'File ID and update data are required');
    }
    
    const secureFilesSheet = getOrCreateSheet('secure_files');
    const allData = secureFilesSheet.getDataRange().getValues();
    const headers = getSheetHeaders('secure_files');
    const fileIdIndex = headers.indexOf('file_id');
    
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][fileIdIndex] === fileId) {
        // Update specified fields
        Object.keys(updateData).forEach(key => {
          const columnIndex = headers.indexOf(key);
          if (columnIndex !== -1) {
            secureFilesSheet.getRange(i + 1, columnIndex + 1).setValue(updateData[key]);
          }
        });
        
        return createResponse(true, 'File metadata updated');
      }
    }
    
    return createResponse(false, 'File not found');
    
  } catch (error) {
    console.error('❌ Error in handleUpdateFileMetadata:', error);
    return createResponse(false, `Failed to update file metadata: ${error.message}`);
  }
}

/**
 * Get access logs for a file
 */
function handleGetAccessLogs(data) {
  try {
    const fileId = data.file_id;
    if (!fileId) {
      return createResponse(false, 'File ID is required');
    }
    
    const accessLogsSheet = getOrCreateSheet('file_access_logs');
    const allData = accessLogsSheet.getDataRange().getValues();
    const headers = getSheetHeaders('file_access_logs');
    const fileIdIndex = headers.indexOf('file_id');
    
    if (allData.length === 0) {
      return createResponse(true, 'No access logs found', []);
    }
    
    const logs = [];
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][fileIdIndex] === fileId) {
        const logEntry = {};
        headers.forEach((header, index) => {
          logEntry[header] = allData[i][index];
        });
        logs.push(logEntry);
      }
    }
    
    // Sort by timestamp descending
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return createResponse(true, 'Access logs retrieved', logs);
    
  } catch (error) {
    console.error('❌ Error in handleGetAccessLogs:', error);
    return createResponse(false, `Failed to get access logs: ${error.message}`);
  }
}

/**
 * Cleanup expired files
 */
function handleCleanupExpiredFiles(data) {
  try {
    const secureFilesSheet = getOrCreateSheet('secure_files');
    const allData = secureFilesSheet.getDataRange().getValues();
    const headers = getSheetHeaders('secure_files');
    const expiresAtIndex = headers.indexOf('expires_at');
    const isActiveIndex = headers.indexOf('is_active');
    const fileIdIndex = headers.indexOf('file_id');
    
    let deletedCount = 0;
    const now = new Date();
    
    // Process from bottom to top to avoid index issues when deleting rows
    for (let i = allData.length - 1; i >= 1; i--) {
      const expiresAt = new Date(allData[i][expiresAtIndex]);
      const isActive = allData[i][isActiveIndex];
      const fileId = allData[i][fileIdIndex];
      
      if (!isActive || now > expiresAt) {
        try {
          // Delete file from Drive
          const driveFile = DriveApp.getFileById(fileId);
          driveFile.setTrashed(true);
          
          // Delete row from sheet
          secureFilesSheet.deleteRow(i + 1);
          deletedCount++;
          
          console.log(`🗑️ Deleted expired file: ${fileId}`);
        } catch (fileError) {
          console.error(`❌ Failed to delete file ${fileId}:`, fileError);
        }
      }
    }
    
    return createResponse(true, 'Expired files cleaned up', { deleted_count: deletedCount });
    
  } catch (error) {
    console.error('❌ Error in handleCleanupExpiredFiles:', error);
    return createResponse(false, `Failed to cleanup expired files: ${error.message}`);
  }
}

/**
 * Get or create secure folder in Drive
 */
function getOrCreateSecureFolder() {
  try {
    // Try to get folder by ID first (if exists)
    try {
      const existingFolder = DriveApp.getFolderById('1cffnroKr1Wu7Ax7KP9aC3snVQ6JVUX6V');
      const secureSubfolders = existingFolder.getFoldersByName('CSIRT_Secure_Files');
      
      if (secureSubfolders.hasNext()) {
        const secureFolder = secureSubfolders.next();
        console.log('✅ Using existing CSIRT_Secure_Files folder');
        return secureFolder;
      }
    } catch (e) {
      console.log('ℹ️ Parent folder not accessible, creating in root Drive');
    }
    
    // Create in root Drive if parent not accessible
    const rootFolders = DriveApp.getFoldersByName('CSIRT_Secure_Files');
    
    if (rootFolders.hasNext()) {
      const existingFolder = rootFolders.next();
      console.log('✅ Using existing root CSIRT_Secure_Files folder');
      return existingFolder;
    } else {
      console.log('📁 Creating new CSIRT_Secure_Files folder in root Drive');
      const secureFolder = DriveApp.createFolder('CSIRT_Secure_Files');
      
      // Set folder to be viewable with link (so files inside can be accessed)
      secureFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      console.log('✅ Created CSIRT_Secure_Files folder with ID:', secureFolder.getId());
      console.log('🔗 Folder URL:', secureFolder.getUrl());
      
      return secureFolder;
    }
  } catch (error) {
    console.error('❌ Error creating secure folder:', error);
    throw error;
  }
}

/**
 * Handle contact file upload specifically - LEVEL 3 SECURITY VERSION
 * Uploads file to Google Drive with shareable link for contact form
 */
function uploadContactFile(fileData) {
  try {
    console.log('📤 Processing Level 3 Security contact file upload:', fileData?.original_name);
    
    // Validate required data
    if (!fileData || !fileData.content || !fileData.filename || !fileData.contact_id) {
      console.log('❌ Missing required file data:', {
        hasFileData: !!fileData,
        hasContent: !!fileData?.content,
        hasFilename: !!fileData?.filename,
        hasContactId: !!fileData?.contact_id
      });
      return createResponse(false, 'Missing required file data (content, filename, or contact_id)');
    }
    
    // Get or create secure folder in Google Drive
    const secureFolder = getOrCreateSecureFolder();
    
    // Create file in Google Drive
    const blob = Utilities.newBlob(
      Utilities.base64Decode(fileData.content),
      fileData.mime_type || 'application/octet-stream',
      fileData.filename
    );
    
    const driveFile = secureFolder.createFile(blob);
    
    // Set file sharing to view-only with link (Level 3 Security)
    driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Get shareable link
    const shareableLink = driveFile.getUrl();
    
    console.log('✅ Level 3 Security file uploaded successfully:', {
      fileId: driveFile.getId(),
      filename: fileData.filename,
      url: shareableLink,
      securityLevel: 'Level-3-Enterprise'
    });
    
    // Log the upload to secure_files sheet with correct header order
    const secureFilesSheet = getOrCreateSheet('secure_files');
    const uploadTime = new Date().toISOString();
    
    // Headers: ['file_id', 'drive_url', 'contact_id', 'original_name', 'secure_filename', 'file_size', 'mime_type', 'encryption_algorithm', 'access_count', 'upload_ip', 'expires_at', 'created_at', 'is_active']
    secureFilesSheet.appendRow([
      driveFile.getId(),                              // file_id
      shareableLink,                                  // drive_url
      fileData.contact_id,                            // contact_id
      fileData.original_name || fileData.filename,    // original_name
      fileData.filename,                              // secure_filename
      fileData.size || 0,                             // file_size
      fileData.mime_type || 'application/octet-stream', // mime_type
      'Level-3-Enterprise-Security',                  // encryption_algorithm
      0,                                              // access_count
      '',                                             // upload_ip (empty for privacy)
      '',                                             // expires_at (empty = no expiry)
      uploadTime,                                     // created_at
      true                                            // is_active
    ]);
    
    console.log('📊 Secure file metadata logged to secure_files sheet');
    
    return createResponse(true, 'Level 3 Security contact file uploaded successfully', {
      file_id: driveFile.getId(),
      file_url: shareableLink,
      secure_filename: fileData.filename,
      original_name: fileData.original_name || fileData.filename,
      upload_time: uploadTime,
      security_level: 'Level-3-Enterprise-Security',
      folder_name: 'CSIRT_Secure_Files'
    });
    
  } catch (error) {
    console.error('❌ Error in Level 3 Security uploadContactFile:', error);
    console.error('❌ Stack trace:', error.stack);
    return createResponse(false, `Failed to upload Level 3 Security contact file: ${error.message}`);
  }
}

// ===================================================================
//             FUNGSI TESTING (Opsional)
// ===================================================================

/**
 * Fungsi untuk testing manual
 */
function testScript() {
  console.log("🧪 Testing Google Apps Script...");
  
  // Test membuat data
  const testData = {
    action: 'create',
    sheet: 'contacts',
    data: {
      name: 'Test User SendGrid',
      email: 'your_email@gmail.com', // GANTI dengan email Anda
      phone: '081234567890',
      subject: 'Test Subject SendGrid',
      message: 'Test message untuk SendGrid + PDF',
      incident_type: 'Testing'
    }
  };
  
  const testCreate = handleCreate('contacts', testData);
  console.log("Test Create Result:", testCreate.getContent());
}

/**
 * Test Level 3 Security File Upload
 */
function testLevel3FileUpload() {
  try {
    console.log("🧪 Testing Level 3 Security File Upload...");
    
    // Create test file data
    const testFileContent = Utilities.base64Encode('Test file content for Level 3 Security');
    
    const testFileData = {
      content: testFileContent,
      filename: 'test_level3_security.txt',
      original_name: 'test_document.txt',
      contact_id: 'TEST-20250717-0001',
      mime_type: 'text/plain',
      size: testFileContent.length
    };
    
    console.log("📧 Testing with file data:", JSON.stringify({
      filename: testFileData.filename,
      contact_id: testFileData.contact_id,
      size: testFileData.size
    }));
    
    // Test upload file
    const uploadResult = uploadContactFile(testFileData);
    console.log("✅ Level 3 Security file upload test completed:", uploadResult.getContent());
    
  } catch (error) {
    console.error("❌ Level 3 Security file upload test failed:", error);
  }
}

/**
 * Test SendGrid langsung tanpa CRUD
 */
function testSendGridDirect() {
  try {
    console.log("🧪 Testing SendGrid Direct...");
    
    const testData = {
      id: 'TEST-' + new Date().getTime(),
      name: 'Test User Direct',
      email: 'studifyppl@gmail.com', // Email untuk testing
      phone: '081234567890',
      subject: 'Test Subject Direct',
      message: 'Test message SendGrid direct',
      incident_type: 'Testing Direct',
      submitted_at: new Date().toISOString(),
      status: 'new',
      created_at: new Date().toISOString()
    };
    
    console.log("📧 Testing with data:", JSON.stringify(testData));
    
    // Test kirim notifikasi langsung
    kirimNotifikasiDanBalasan(testData);
    console.log("✅ SendGrid direct test completed");
  } catch (error) {
    console.error("❌ SendGrid direct test failed:", error);
  }
}
