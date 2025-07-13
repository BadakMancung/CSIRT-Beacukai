const SPREADSHEET_IDS = {
  article: '1YOUR_ARTICLES_SPREADSHEET_ID',  // Replace with actual ID
  event: '1YOUR_EVENTS_SPREADSHEET_ID',      // Replace with actual ID
  contact: '1YOUR_CONTACTS_SPREADSHEET_ID'   // Replace with actual ID
};

// Sheet names within each spreadsheet
const SHEET_NAMES = {
  article: 'Articles',
  event: 'Events', 
  contact: 'ContactForms'
};

/**
 * Main function that handles all POST requests
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    console.log('📥 Received request:', data);
    
    const { type, action } = data;
    
    if (!type) {
      return createResponse(false, 'Type is required');
    }
    
    if (!SPREADSHEET_IDS[type]) {
      return createResponse(false, `Unknown type: ${type}`);
    }
    
    switch (action) {
      case 'read':
        return handleRead(type);
      case 'create':
        return handleCreate(type, data);
      case 'update':
        return handleUpdate(type, data);
      case 'delete':
        return handleDelete(type, data);
      default:
        return createResponse(false, `Unknown action: ${action}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    return createResponse(false, `Server error: ${error.message}`);
  }
}

/**
 * Handle READ operations
 */
function handleRead(type) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_IDS[type]);
    const sheet = spreadsheet.getSheetByName(SHEET_NAMES[type]);
    
    if (!sheet) {
      return createResponse(false, `Sheet not found: ${SHEET_NAMES[type]}`);
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return createResponse(true, 'No data found', []);
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const result = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
    
    console.log(`📋 Read ${result.length} records from ${type}`);
    return createResponse(true, `Data retrieved successfully`, result);
    
  } catch (error) {
    console.error(`❌ Read error for ${type}:`, error);
    return createResponse(false, `Failed to read data: ${error.message}`);
  }
}

/**
 * Handle CREATE operations
 */
function handleCreate(type, data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_IDS[type]);
    const sheet = spreadsheet.getSheetByName(SHEET_NAMES[type]);
    
    if (!sheet) {
      return createResponse(false, `Sheet not found: ${SHEET_NAMES[type]}`);
    }
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Create row data based on headers
    const rowData = headers.map(header => {
      if (header === 'id' && !data[header]) {
        return new Date().getTime(); // Generate timestamp ID if not provided
      }
      return data[header] || '';
    });
    
    sheet.appendRow(rowData);
    
    console.log(`✅ Created new ${type} record with ID: ${rowData[0]}`);
    return createResponse(true, `${type} created successfully`, { id: rowData[0] });
    
  } catch (error) {
    console.error(`❌ Create error for ${type}:`, error);
    return createResponse(false, `Failed to create ${type}: ${error.message}`);
  }
}

/**
 * Handle UPDATE operations
 */
function handleUpdate(type, data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_IDS[type]);
    const sheet = spreadsheet.getSheetByName(SHEET_NAMES[type]);
    
    if (!sheet) {
      return createResponse(false, `Sheet not found: ${SHEET_NAMES[type]}`);
    }
    
    const allData = sheet.getDataRange().getValues();
    const headers = allData[0];
    const idColumnIndex = headers.indexOf('id');
    
    if (idColumnIndex === -1) {
      return createResponse(false, 'ID column not found');
    }
    
    // Find the row with matching ID
    let rowIndex = -1;
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][idColumnIndex].toString() === data.id.toString()) {
        rowIndex = i + 1; // +1 because getRange is 1-indexed
        break;
      }
    }
    
    if (rowIndex === -1) {
      return createResponse(false, `Record with ID ${data.id} not found`);
    }
    
    // Update each field
    headers.forEach((header, index) => {
      if (data.hasOwnProperty(header) && header !== 'id') {
        sheet.getRange(rowIndex, index + 1).setValue(data[header]);
      }
    });
    
    // Update the updated_at timestamp
    const updatedAtIndex = headers.indexOf('updated_at');
    if (updatedAtIndex !== -1) {
      sheet.getRange(rowIndex, updatedAtIndex + 1).setValue(new Date().toISOString());
    }
    
    console.log(`✅ Updated ${type} record with ID: ${data.id}`);
    return createResponse(true, `${type} updated successfully`, { id: data.id });
    
  } catch (error) {
    console.error(`❌ Update error for ${type}:`, error);
    return createResponse(false, `Failed to update ${type}: ${error.message}`);
  }
}

/**
 * Handle DELETE operations
 */
function handleDelete(type, data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_IDS[type]);
    const sheet = spreadsheet.getSheetByName(SHEET_NAMES[type]);
    
    if (!sheet) {
      return createResponse(false, `Sheet not found: ${SHEET_NAMES[type]}`);
    }
    
    const allData = sheet.getDataRange().getValues();
    const headers = allData[0];
    const idColumnIndex = headers.indexOf('id');
    
    if (idColumnIndex === -1) {
      return createResponse(false, 'ID column not found');
    }
    
    // Find the row with matching ID
    let rowIndex = -1;
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][idColumnIndex].toString() === data.id.toString()) {
        rowIndex = i + 1; // +1 because deleteRow is 1-indexed
        break;
      }
    }
    
    if (rowIndex === -1) {
      return createResponse(false, `Record with ID ${data.id} not found`);
    }
    
    sheet.deleteRow(rowIndex);
    
    console.log(`🗑️ Deleted ${type} record with ID: ${data.id}`);
    return createResponse(true, `${type} deleted successfully`, { id: data.id });
    
  } catch (error) {
    console.error(`❌ Delete error for ${type}:`, error);
    return createResponse(false, `Failed to delete ${type}: ${error.message}`);
  }
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
 * Test function for debugging
 */
function testScript() {
  // Test read operation
  const testData = {
    type: 'article',
    action: 'read'
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  console.log('Test result:', result.getContent());
}
