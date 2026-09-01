// MikroTik Router Dashboard - Configuration

// Authentication Configuration
// Ganti username dan password sesuai kebutuhan
const AUTH_CREDENTIALS = {
    username: 'admin',
    password: 'kominfo123'
};

// Google Sheets Configuration
// Untuk setup Google Sheets API:
// 1. Buat project di Google Cloud Console (https://console.cloud.google.com)
// 2. Enable Google Sheets API
// 3. Buat API Key atau OAuth 2.0 credentials
// 4. Buat Google Sheet baru dan copy Spreadsheet ID dari URL

const GOOGLE_SHEETS_CONFIG = {
    // Spreadsheet ID dari URL Google Sheet (contoh: dari URL https://docs.google.com/spreadsheets/d/1BxiM.../edit)
    spreadsheetId: '', // Masukkan Spreadsheet ID di sini
    
    // API Key dari Google Cloud Console
    apiKey: '', // Masukkan API Key di sini
    
    // Sheet name untuk data router
    sheetName: 'RouterMonitoring'
};

// Alternative: Use Google Apps Script (Recommended untuk simplicity)
// Buat Google Apps Script dengan script berikut:
/*
function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RouterMonitoring');
  var data = sheet.getDataRange().getValues();
  return ContentService.createTextDocument(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RouterMonitoring');
  var data = JSON.parse(e.postData.contents);
  
  // Clear existing data (optional)
  sheet.clear();
  
  // Write header
  sheet.appendRow(['ID', 'Nama Router', 'IP Address', 'Interface', 'Lokasi', 'Ditambahkan', 'Link Graph']);
  
  // Write data
  data.forEach(function(row) {
    sheet.appendRow(row);
  });
  
  return ContentService.createTextDocument(JSON.stringify({status: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
*/

// Google Apps Script Configuration (Alternative Method)
const GOOGLE_APPS_SCRIPT_CONFIG = {
    // Deploy script sebagai Web App dan copy URL di sini
    scriptUrl: 'https://script.google.com/macros/s/AKfycbwFXDmamreCzg-9dqHuQJh9iuJ-zxbhs1oRDAOyk2AsYdJTj-bkbhoEWvlaPdU1nksD/exec',     
    // Nama sheet di Google Sheets
    sheetName: 'RouterMonitoring'
};

// Dashboard Configuration
const DASHBOARD_CONFIG = {
    // Refresh interval untuk check status (ms)
    refreshInterval: 30000, // 30 detik
    
    // Timeout untuk loading graph (ms)
    graphTimeout: 10000, // 10 detik
    
    // Default view mode
    defaultView: 'grid', // 'grid' atau 'list'
    
    // Enable auto-sync ke Google Sheets
    autoSync: false,
    
    // Auto-sync interval (ms)
    autoSyncInterval: 300000 // 5 menit
};

// Router Categories untuk grouping (opsional)
const ROUTER_CATEGORIES = {
    'CORE': 'Router Core',
    'DISTRIBUTION': 'Router Distribution',
    'ACCESS': 'Router Access',
    'BACKUP': 'Router Backup'
};

// Alert thresholds (opsional untuk future enhancement)
const ALERT_THRESHOLDS = {
    cpuUsage: 80, // persen
    memoryUsage: 80, // persen
    bandwidthUsage: 90 // persen dari kapasitas
};
