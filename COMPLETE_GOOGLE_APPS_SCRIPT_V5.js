const SPREADSHEET_ID = ''; // Single spreadsheet with multiple sheets

// Sheet names within the spreadsheet
const SHEET_NAMES = {
  articles: 'articles',
  events: 'events', 
  contacts: 'contacts',
  email_notifications: 'email_notifications'
};

/**
 * Main function that handles all POST requests
 */
function doPost(e) {
  try {
    console.log('📥 Received POST request');
    
    if (!e.postData || !e.postData.contents) {
      return createResponse(false, 'No data received');
    }
    
    const data = JSON.parse(e.postData.contents);
    console.log('📋 Request data:', data);
    
    // Handle different request formats for backward compatibility
    let sheetName, action;
    
    if (data.sheet && data.action) {
      // New format from NotificationService
      sheetName = data.sheet;
      action = data.action;
    } else if (data.type && data.action) {
      // Format from your suggested script
      sheetName = data.type;
      action = data.action;
    } else {
      return createResponse(false, 'Missing required parameters (sheet/type and action)');
    }
    
    // Validate sheet name
    if (!SHEET_NAMES[sheetName]) {
      return createResponse(false, `Unknown sheet: ${sheetName}`);
    }
    
    switch (action) {
      case 'read':
        return handleRead(sheetName);
      case 'create':
        return handleCreate(sheetName, data);
      case 'update':
        return handleUpdate(sheetName, data);
      case 'delete':
        return handleDelete(sheetName, data);
      default:
        return createResponse(false, `Unknown action: ${action}`);
    }
    
  } catch (error) {
    console.error('❌ Error in doPost:', error);
    return createResponse(false, `Server error: ${error.message}`);
  }
}

/**
 * Handle GET requests for backward compatibility
 */
function doGet(e) {
  try {
    const sheetName = e.parameter.sheet || 'complaints';
    return handleRead(sheetName);
  } catch (error) {
    console.error('❌ Error in doGet:', error);
    return createResponse(false, `Server error: ${error.message}`);
  }
}

/**
 * Handle READ operations
 */
function handleRead(sheetName) {
  try {
    const sheet = getOrCreateSheet(sheetName);
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return createResponse(true, 'No data found', []);
    }
    
    const headers = getSheetHeaders(sheetName);
    const rows = data.slice(1); // Skip header row
    
    const result = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      // Only include records that have essential data
      return obj;
    }).filter(record => {
      return record.id || record.email || record.title || record.name;
    });
    
    console.log(`📋 Read ${result.length} records from ${sheetName}`);
    return createResponse(true, `Data retrieved successfully`, result);
    
  } catch (error) {
    console.error(`❌ Read error for ${sheetName}:`, error);
    return createResponse(false, `Failed to read data: ${error.message}`);
  }
}

/**
 * Handle CREATE operations
 */
function handleCreate(sheetName, requestData) {
  try {
    const sheet = getOrCreateSheet(sheetName);
    const headers = getSheetHeaders(sheetName);
    const data = requestData.data || requestData;
    
    // Add timestamp if not provided
    if (!data.created_at) {
      data.created_at = new Date().toISOString();
    }
    
    // Generate ID if not provided
    if (!data.id) {
      data.id = new Date().getTime();
    }
    
    // Create row data based on headers
    const rowData = headers.map(header => data[header] || '');
    
    sheet.appendRow(rowData);
    
    // Prepare response data
    const newRecord = {};
    headers.forEach((header, index) => {
      newRecord[header] = rowData[index];
    });
    
    console.log(`✅ Created new ${sheetName} record with ID: ${data.id}`);
    return createResponse(true, `${sheetName} created successfully`, newRecord);
    
  } catch (error) {
    console.error(`❌ Create error for ${sheetName}:`, error);
    return createResponse(false, `Failed to create ${sheetName}: ${error.message}`);
  }
}

/**
 * Handle UPDATE operations
 */
function handleUpdate(sheetName, requestData) {
  try {
    const sheet = getOrCreateSheet(sheetName);
    const headers = getSheetHeaders(sheetName);
    const data = requestData.data || requestData;
    const id = requestData.id || data.id;
    
    if (!id) {
      return createResponse(false, 'ID is required for update operation');
    }
    
    const allData = sheet.getDataRange().getValues();
    const idColumnIndex = headers.indexOf('id');
    
    if (idColumnIndex === -1) {
      return createResponse(false, 'ID column not found');
    }
    
    // Find the row with matching ID
    let rowIndex = -1;
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][idColumnIndex].toString() === id.toString()) {
        rowIndex = i + 1; // +1 because getRange is 1-indexed
        break;
      }
    }
    
    if (rowIndex === -1) {
      return createResponse(false, `Record with ID ${id} not found`);
    }
    
    // Add updated timestamp
    data.updated_at = new Date().toISOString();
    
    // Update the row
    const updatedRowData = headers.map(header => {
      if (data.hasOwnProperty(header)) {
        return data[header];
      } else {
        // Keep existing value
        const colIndex = headers.indexOf(header);
        return allData[rowIndex - 1][colIndex] || '';
      }
    });
    
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([updatedRowData]);
    
    // Prepare response data
    const updatedRecord = {};
    headers.forEach((header, index) => {
      updatedRecord[header] = updatedRowData[index];
    });
    
    console.log(`✅ Updated ${sheetName} record with ID: ${id}`);
    return createResponse(true, `${sheetName} updated successfully`, updatedRecord);
    
  } catch (error) {
    console.error(`❌ Update error for ${sheetName}:`, error);
    return createResponse(false, `Failed to update ${sheetName}: ${error.message}`);
  }
}

/**
 * Handle DELETE operations
 */
function handleDelete(sheetName, requestData) {
  try {
    const sheet = getOrCreateSheet(sheetName);
    const headers = getSheetHeaders(sheetName);
    const id = requestData.id;
    
    if (!id) {
      return createResponse(false, 'ID is required for delete operation');
    }
    
    const allData = sheet.getDataRange().getValues();
    const idColumnIndex = headers.indexOf('id');
    
    if (idColumnIndex === -1) {
      return createResponse(false, 'ID column not found');
    }
    
    // Find the row with matching ID
    let rowIndex = -1;
    let deletedRecord = {};
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][idColumnIndex].toString() === id.toString()) {
        rowIndex = i + 1; // +1 because deleteRow is 1-indexed
        
        // Store deleted record for response
        headers.forEach((header, index) => {
          deletedRecord[header] = allData[i][index];
        });
        break;
      }
    }
    
    if (rowIndex === -1) {
      return createResponse(false, `Record with ID ${id} not found`);
    }
    
    sheet.deleteRow(rowIndex);
    
    console.log(`🗑️ Deleted ${sheetName} record with ID: ${id}`);
    return createResponse(true, `${sheetName} deleted successfully`, deletedRecord);
    
  } catch (error) {
    console.error(`❌ Delete error for ${sheetName}:`, error);
    return createResponse(false, `Failed to delete ${sheetName}: ${error.message}`);
  }
}

/**
 * Get or create sheet with proper headers
 */
function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAMES[sheetName]);
  
  if (!sheet) {
    console.log(`Creating new sheet: ${sheetName}`);
    sheet = spreadsheet.insertSheet(SHEET_NAMES[sheetName]);
    
    // Set up headers
    const headers = getSheetHeaders(sheetName);
    if (headers.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
    }
  }
  
  return sheet;
}

/**
 * Get headers for each sheet type
 */
function getSheetHeaders(sheetName) {
  const headerMappings = {
    'contacts': ['id', 'name', 'email', 'phone', 'subject', 'message', 'incident_type', 'attachment', 'submitted_at', 'status', 'created_at', 'updated_at'],
    'articles': ['id', 'title', 'content', 'author','excerpt','is_published', 'image', 'published_at', 'created_at', 'updated_at'],
    'events': ['id', 'title', 'description','content', 'event_date', 'event_end_date', 'location', 'is_published', 'image', 'created_at', 'updated_at'],
    'email_notifications': ['id', 'email', 'name', 'role', 'notification_types', 'active', 'created_at', 'updated_at']
  };
  
  return headerMappings[sheetName] || ['id', 'data', 'created_at', 'updated_at'];
}

/**
 * Create standardized response
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  const output = ContentService.createTextOutput(JSON.stringify(response));
  output.setMimeType(ContentService.MimeType.JSON);
  
  return output;
}

/**
 * Initialize all required sheets
 */
function initializeSpreadsheet() {
  const sheetNames = ['contacts', 'articles', 'events', 'email_notifications'];
  
  sheetNames.forEach(sheetName => {
    getOrCreateSheet(sheetName);
  });
  
  console.log('✅ Spreadsheet initialized with all required sheets');
}

/**
 * Test function for debugging
 */
function testScript() {
  try {
    // Test reading email notifications
    const testData = {
      sheet: 'email_notifications',
      action: 'read'
    };
    
    const result = doPost({
      postData: {
        contents: JSON.stringify(testData)
      }
    });
    
    console.log('Test result:', result.getContent());
    return 'Test completed successfully';
  } catch (error) {
    console.error('Test failed:', error);
    return 'Test failed: ' + error.toString();
  }
}
