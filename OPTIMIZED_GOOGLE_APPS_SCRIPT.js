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
      
      // Check for attachment information from secure_files sheet
      let attachmentInfo = null;
      try {
        const secureFilesSheet = getOrCreateSheet('secure_files');
        const secureFilesData = secureFilesSheet.getDataRange().getValues();
        const secureHeaders = getSheetHeaders('secure_files');
        const contactIdIndex = secureHeaders.indexOf('contact_id');
        const driveUrlIndex = secureHeaders.indexOf('drive_url');
        const originalNameIndex = secureHeaders.indexOf('original_name');
        const fileIdIndex = secureHeaders.indexOf('file_id');
        
        console.log('🔍 Looking for attachment with contact_id:', nomorAduan);
        console.log('📊 Secure files data rows:', secureFilesData.length);
        
        // Find attachment for this contact
        for (let i = 1; i < secureFilesData.length; i++) {
          const fileContactId = secureFilesData[i][contactIdIndex];
          console.log(`📋 Row ${i}: contact_id = "${fileContactId}", looking for "${nomorAduan}"`);
          
          if (fileContactId === nomorAduan || fileContactId === data.id) {
            attachmentInfo = {
              file_url: secureFilesData[i][driveUrlIndex],
              original_name: secureFilesData[i][originalNameIndex],
              file_id: secureFilesData[i][fileIdIndex],
              type: 'google_drive',
              security_level: 'Level-3-Enterprise'
            };
            console.log('📎 Found attachment for contact:', attachmentInfo);
            
            // Update the attachment field in contacts sheet
            const attachmentColumnIndex = headers.indexOf('attachment');
            if (attachmentColumnIndex !== -1) {
              sheet.getRange(lastRow, attachmentColumnIndex + 1).setValue(attachmentInfo.file_url);
              data.attachment = attachmentInfo.file_url;
              console.log('✅ Updated contacts sheet with attachment URL');
            }
            
            break;
          }
        }
        
        if (!attachmentInfo) {
          console.log('⚠️ No attachment found for contact_id:', nomorAduan);
        }
        
      } catch (attachError) {
        console.log('⚠️ Could not check for attachments:', attachError.message);
      }
      
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
        created_at: data.created_at || new Date().toISOString(),
        attachment: attachmentInfo ? attachmentInfo.file_url : null,
        attachment_original_name: attachmentInfo ? attachmentInfo.original_name : null,
        attachment_type: attachmentInfo ? attachmentInfo.type : null,
        attachment_security: attachmentInfo ? attachmentInfo.security_level : null
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
                       (dataAduan.attachment ? 
                         `📎 LAMPIRAN ANDA:\n` +
                         `- File tersimpan aman di Google Drive (Level 3 Security)\n` +
                         `- Link Akses: ${dataAduan.attachment}\n` +
                         `- Nama File: ${dataAduan.attachment_original_name || 'File Lampiran'}\n` +
                         `- Keamanan: ${dataAduan.attachment_security || 'Enterprise Level'}\n\n` +
                         `⚠️ PENTING: Link ini hanya dapat diakses oleh pihak yang berwenang.\n\n`
                         : '') +
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
                          (dataAduan.attachment ? 
                            `📎 Lampiran: ${dataAduan.attachment_original_name || 'File tersedia'} (Level 3 Security)\n` +
                            `🔗 Link: ${dataAduan.attachment}\n`
                            : '📎 Lampiran: Tidak ada\n') +
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
  
  // Ensure all security-related sheets are created when any sheet is accessed
  if (sheetName === 'secure_files' || sheetName === 'contacts' || sheetName === 'file_access_logs' || sheetName === 'temp_tokens') {
    ensureSecuritySheetsExist(spreadsheet);
  }
  
  return sheet;
}

/**
 * Ensure all security-related sheets exist
 */
function ensureSecuritySheetsExist(spreadsheet) {
  const securitySheets = ['secure_files', 'file_access_logs', 'temp_tokens'];
  
  securitySheets.forEach(securitySheetName => {
    if (!spreadsheet.getSheetByName(SHEET_NAMES[securitySheetName])) {
      console.log(`🔐 Creating security sheet: ${securitySheetName}`);
      const newSheet = spreadsheet.insertSheet(SHEET_NAMES[securitySheetName]);
      const headers = getSheetHeaders(securitySheetName);
      if (headers.length > 0) {
        const headerRange = newSheet.getRange(1, 1, 1, headers.length);
        headerRange.setValues([headers]).setBackground('#dc2626').setFontColor('#ffffff').setFontWeight('bold');
        console.log(`✅ Created security sheet ${securitySheetName} with headers:`, headers);
      }
    }
  });
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
//             SECURE FILE MANAGEMENT - ESSENTIAL ONLY
// ===================================================================

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
    console.log('🆔 Contact ID for file:', fileData?.contact_id);
    
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
      contactId: fileData.contact_id,
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
    
    console.log('📊 Secure file metadata logged to secure_files sheet for contact_id:', fileData.contact_id);
    
    // Auto-update contacts table if contact exists
    try {
      console.log('🔄 Auto-updating contacts table with attachment...');
      const contactsSheet = getOrCreateSheet('contacts');
      const contactsData = contactsSheet.getDataRange().getValues();
      const contactsHeaders = getSheetHeaders('contacts');
      const contactIdIndex = contactsHeaders.indexOf('id');
      const attachmentIndex = contactsHeaders.indexOf('attachment');
      
      if (contactIdIndex !== -1 && attachmentIndex !== -1) {
        for (let i = 1; i < contactsData.length; i++) {
          if (contactsData[i][contactIdIndex] === fileData.contact_id) {
            contactsSheet.getRange(i + 1, attachmentIndex + 1).setValue(shareableLink);
            console.log('✅ Auto-updated contacts table with attachment URL for:', fileData.contact_id);
            break;
          }
        }
      }
    } catch (updateError) {
      console.log('⚠️ Could not auto-update contacts table:', updateError.message);
    }
    
    return createResponse(true, 'Level 3 Security contact file uploaded successfully', {
      file_id: driveFile.getId(),
      file_url: shareableLink,
      secure_filename: fileData.filename,
      original_name: fileData.original_name || fileData.filename,
      upload_time: uploadTime,
      security_level: 'Level-3-Enterprise-Security',
      folder_name: 'CSIRT_Secure_Files',
      contact_id: fileData.contact_id
    });
    
  } catch (error) {
    console.error('❌ Error in Level 3 Security uploadContactFile:', error);
    console.error('❌ Stack trace:', error.stack);
    return createResponse(false, `Failed to upload Level 3 Security contact file: ${error.message}`);
  }
}

/**
 * Handle basic secure file upload (untuk kompatibilitas)
 */
function handleSecureFileUpload(data) {
  try {
    console.log('🔐 Basic secure file upload - redirecting to uploadContactFile...');
    
    // Convert data structure if needed
    const fileData = {
      content: data.encrypted_content || data.content,
      filename: data.metadata?.secure_filename || data.filename,
      original_name: data.metadata?.original_name || data.original_name,
      contact_id: data.metadata?.contact_id || data.contact_id,
      mime_type: data.metadata?.mime_type || data.mime_type,
      size: data.metadata?.file_size || data.size
    };
    
    return uploadContactFile(fileData);
    
  } catch (error) {
    console.error('❌ Error in handleSecureFileUpload:', error);
    return createResponse(false, `Failed to upload secure file: ${error.message}`);
  }
}

// ===================================================================
//             ESSENTIAL UTILITY FUNCTIONS FOR PRODUCTION
// ===================================================================

/**
 * Create all required sheets (untuk initial setup)
 */
function createAllSecuritySheets() {
  try {
    console.log("🔧 Creating All Required Security Sheets...");
    
    const allRequiredSheets = [
      'contacts', 'articles', 'events', 'email_notifications', 
      'secure_files', 'file_access_logs', 'temp_tokens'
    ];
    
    allRequiredSheets.forEach(sheetName => {
      console.log(`📋 Ensuring sheet exists: ${sheetName}`);
      const sheet = getOrCreateSheet(sheetName);
      const headers = getSheetHeaders(sheetName);
      console.log(`✅ Sheet ${sheetName} ready with ${headers.length} columns`);
    });
    
    console.log("✅ All required sheets created successfully");
    return createResponse(true, 'All security sheets created successfully', { 
      sheets_created: allRequiredSheets.length,
      sheet_names: allRequiredSheets
    });
    
  } catch (error) {
    console.error("❌ Create all security sheets failed:", error);
    return createResponse(false, `Failed to create security sheets: ${error.message}`);
  }
}

/**
 * Fix existing contact attachment (untuk data migration)
 */
function fixExistingContactAttachment() {
  try {
    console.log("🔧 Fixing existing contact attachment...");
    
    const contactId = 'ADUAN-20250716-0001';
    const secureFilesSheet = getOrCreateSheet('secure_files');
    const secureFilesData = secureFilesSheet.getDataRange().getValues();
    const secureHeaders = getSheetHeaders('secure_files');
    
    const contactIdIndex = secureHeaders.indexOf('contact_id');
    const driveUrlIndex = secureHeaders.indexOf('drive_url');
    
    for (let i = 1; i < secureFilesData.length; i++) {
      const currentContactId = secureFilesData[i][contactIdIndex];
      if (currentContactId && currentContactId.startsWith('TEST-')) {
        console.log(`🔄 Updating contact_id from ${currentContactId} to ${contactId}`);
        secureFilesSheet.getRange(i + 1, contactIdIndex + 1).setValue(contactId);
        
        const driveUrl = secureFilesData[i][driveUrlIndex];
        
        // Update contacts table
        const contactsSheet = getOrCreateSheet('contacts');
        const contactsData = contactsSheet.getDataRange().getValues();
        const contactsHeaders = getSheetHeaders('contacts');
        const contactIdIndexContacts = contactsHeaders.indexOf('id');
        const attachmentIndexContacts = contactsHeaders.indexOf('attachment');
        
        for (let j = 1; j < contactsData.length; j++) {
          if (contactsData[j][contactIdIndexContacts] === contactId) {
            console.log(`🔄 Updating contact ${contactId} with attachment URL`);
            contactsSheet.getRange(j + 1, attachmentIndexContacts + 1).setValue(driveUrl);
            console.log("✅ Contact attachment field updated successfully");
            break;
          }
        }
        break;
      }
    }
    
    console.log("✅ Existing contact attachment fix completed");
    return createResponse(true, 'Existing contact attachment fixed successfully');
    
  } catch (error) {
    console.error("❌ Fix existing contact attachment failed:", error);
    return createResponse(false, `Failed to fix existing contact attachment: ${error.message}`);
  }
}
