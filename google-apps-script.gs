// MikroTik Router Dashboard - Google Apps Script Integration
// Deploy sebagai Web App di Google Sheets

// Konfigurasi
const CONFIG = {
  SHEET_NAME: 'RouterMonitoring',
  HEADERS: ['ID', 'Nama Router', 'IP Address', 'Port', 'Interface', 'Daftar Interface', 'Lokasi', 'Ditambahkan', 'Link Graph']
};

// Handler untuk GET request - mengambil data dari sheet
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      // Buat sheet jika belum ada
      createSheet();
      return createResponse({ status: 'created', message: 'Sheet created successfully' });
    }
    
    const data = sheet.getDataRange().getValues();
    return createResponse(data);
    
  } catch (error) {
    return createErrorResponse(error);
  }
}

// Handler untuk POST request - menyimpan data ke sheet
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      createSheet();
    }
    
    const data = JSON.parse(e.postData.contents);
    
    // Clear existing data
    sheet.clear();
    
    // Write header
    sheet.appendRow(CONFIG.HEADERS);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, CONFIG.HEADERS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#667eea');
    headerRange.setFontColor('white');
    
    // Write data
    if (data && data.length > 0) {
      data.forEach(function(row, index) {
        sheet.appendRow(row);
        
        // Add alternating row colors
        if (index % 2 === 0) {
          sheet.getRange(index + 2, 1, 1, row.length).setBackground('#f8f9fa');
        }
      });
      
      // Auto-fit columns
      sheet.autoResizeColumns(1, CONFIG.HEADERS.length);
      
      // Freeze header row
      sheet.setFrozenRows(1);
    }
    
    return createResponse({ status: 'success', message: 'Data saved successfully', rows: data.length });
    
  } catch (error) {
    return createErrorResponse(error);
  }
}

// Fungsi untuk membuat sheet baru
function createSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
  
  // Add headers
  sheet.appendRow(CONFIG.HEADERS);
  
  // Format header
  const headerRange = sheet.getRange(1, 1, 1, CONFIG.HEADERS.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#667eea');
  headerRange.setFontColor('white');
  
  // Auto-fit columns
  sheet.autoResizeColumns(1, CONFIG.HEADERS.length);
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  return sheet;
}

// Fungsi untuk membuat response JSON
function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Fungsi untuk membuat error response
function createErrorResponse(error) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: error.toString(),
    stack: error.stack
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

// Fungsi untuk menambah router tunggal (alternative method)
function addRouter(routerData) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      createSheet();
    }
    
    const row = [
      routerData.id,
      routerData.name,
      routerData.ip,
      routerData.port || '80',
      routerData.interface || '',
      routerData.interfaces ? routerData.interfaces.join(', ') : '',
      routerData.location || '',
      new Date().toLocaleString('id-ID'),
      `http://${routerData.ip}${routerData.port ? ':' + routerData.port : ''}/graphs/`
    ];
    
    sheet.appendRow(row);
    
    return { status: 'success', message: 'Router added successfully' };
    
  } catch (error) {
    return { status: 'error', message: error.toString() };
  }
}

// Fungsi untuk menghapus router berdasarkan ID
function deleteRouter(routerId) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      return { status: 'error', message: 'Sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Find row with matching ID (column 1)
    const rowIndex = data.findIndex(row => row[0] == routerId);
    
    if (rowIndex === -1) {
      return { status: 'error', message: 'Router not found' };
    }
    
    // Delete row (add 2 because of header and 0-indexed)
    sheet.deleteRow(rowIndex + 2);
    
    return { status: 'success', message: 'Router deleted successfully' };
    
  } catch (error) {
    return { status: 'error', message: error.toString() };
  }
}

// Fungsi untuk mendapatkan semua router
function getAllRouters() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      return { status: 'error', message: 'Sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Remove header row
    const routers = data.slice(1).map(row => ({
      id: row[0],
      name: row[1],
      ip: row[2],
      port: row[3],
      interface: row[4],
      interfaces: row[5] ? row[5].split(', ').map(i => i.trim()) : [],
      location: row[6],
      addedAt: row[7],
      link: row[8]
    }));
    
    return { status: 'success', routers: routers };
    
  } catch (error) {
    return { status: 'error', message: error.toString() };
  }
}

// Fungsi setup awal - jalankan sekali untuk setup
function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Delete existing sheet if exists
  const existingSheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  if (existingSheet) {
    spreadsheet.deleteSheet(existingSheet);
  }
  
  // Create new sheet
  createSheet();
  
  // Add sample data
  const sampleData = [
    [Date.now(), 'Router Sample', '10.121.121.142', '80', 'ether1-InternetKOMINFO', 'ether1-InternetKOMINFO, ether2, wlan1, bridge-local', 'Sample Location', new Date().toLocaleString('id-ID'), 'http://10.121.121.142/graphs/']
  ];
  
  const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  sampleData.forEach(function(row) {
    sheet.appendRow(row);
  });
  
  return 'Setup completed successfully!';
}
