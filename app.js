// MikroTik Router Dashboard - Main Application

let routers = [];
let syncStatus = false;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    checkSession();

    // Setup session timeout checker
    setupSessionTimeout();

    loadRouters();
    renderRouters();
    checkSyncStatus();
});

// Load routers from localStorage
function loadRouters() {
    const savedRouters = localStorage.getItem('kominfoRouters');
    if (savedRouters) {
        routers = JSON.parse(savedRouters);
    } else {
        // Add sample router from user's example
        routers = [{
            id: Date.now(),
            name: 'Router Kominfo Sample',
            ip: '10.121.121.142',
            port: '',
            interface: 'ether1-InternetKOMINFO',
            location: 'Kantor Kominfo Riau',
            addedAt: new Date().toISOString()
        }];
        saveRouters();
    }
}

// Save routers to localStorage
function saveRouters() {
    localStorage.setItem('kominfoRouters', JSON.stringify(routers));
    syncStatus = false;
    updateSyncStatus();
}

// Render routers to grid
function renderRouters() {
    const grid = document.getElementById('routerGrid');
    
    if (routers.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: white;">
                <h3>Belum ada router yang ditambahkan</h3>
                <p>Klik tombol "+ Tambah Router" untuk memulai</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = routers.map(router => `
        <div class="router-card">
            <div class="router-header">
                <h3>${escapeHtml(router.name)}</h3>
                <span class="status">Active</span>
            </div>
            <div class="router-body">
                <div class="router-info">
                    <p><strong>IP:</strong> ${escapeHtml(router.ip)}${router.port ? ':' + router.port : ''}</p>
                    <p><strong>Interface:</strong> ${escapeHtml(router.interface || 'All Interfaces')}</p>
                    <p><strong>Lokasi:</strong> ${escapeHtml(router.location || 'N/A')}</p>
                    <p><strong>Ditambahkan:</strong> ${formatDate(router.addedAt)}</p>
                </div>
                <div class="router-actions">
                    <button class="btn-view" onclick="viewGraph('${router.id}')">📊 Graph Interface</button>
                    <button class="btn-view" onclick="viewAllInterfaces('${router.id}')">🔗 Semua Interface</button>
                    <button class="btn-view" onclick="copyGraphLink('${router.id}')">📋 Copy Link</button>
                    <button class="btn-delete" onclick="deleteRouter('${router.id}')">🗑️ Hapus</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle add form
function toggleAddForm() {
    const form = document.getElementById('addRouterForm');
    form.classList.toggle('active');
    
    if (form.classList.contains('active')) {
        document.getElementById('routerName').focus();
    }
}

// Add new router
function addRouter() {
    const name = document.getElementById('routerName').value.trim();
    const ip = document.getElementById('routerIP').value.trim();
    const port = document.getElementById('routerPort').value.trim();
    const interface = document.getElementById('routerInterface').value.trim();
    const location = document.getElementById('routerLocation').value.trim();

    if (!name || !ip) {
        alert('Nama dan IP Address wajib diisi!');
        return;
    }

    // Validate IP format
    if (!isValidIP(ip)) {
        alert('Format IP Address tidak valid!');
        return;
    }

    // Validate port if provided
    if (port && (port < 1 || port > 65535)) {
        alert('Port harus antara 1 dan 65535!');
        return;
    }

    const newRouter = {
        id: Date.now().toString(),
        name: name,
        ip: ip,
        port: port || '',
        interface: interface || '',
        location: location || '',
        addedAt: new Date().toISOString()
    };

    routers.push(newRouter);
    saveRouters();
    renderRouters();
    toggleAddForm();

    // Clear form
    document.getElementById('routerName').value = '';
    document.getElementById('routerIP').value = '';
    document.getElementById('routerPort').value = '';
    document.getElementById('routerInterface').value = '';
    document.getElementById('routerLocation').value = '';

    alert('Router berhasil ditambahkan!');
}

// Delete router
function deleteRouter(id) {
    if (confirm('Apakah Anda yakin ingin menghapus router ini?')) {
        routers = routers.filter(r => r.id !== id);
        saveRouters();
        renderRouters();
    }
}

// View graph for specific interface
function viewGraph(id) {
    const router = routers.find(r => r.id === id);
    if (!router) return;

    const port = router.port ? `:${router.port}` : '';
    let graphUrl;
    if (router.interface) {
        const encodedInterface = encodeURIComponent(router.interface);
        graphUrl = `http://${router.ip}${port}/graphs/iface/${encodedInterface}/`;
    } else {
        graphUrl = `http://${router.ip}${port}/graphs/`;
    }

    // Open directly in new tab (MikroTik doesn't allow iframe embedding)
    window.open(graphUrl, '_blank');
}

// View all interfaces
function viewAllInterfaces(id) {
    const router = routers.find(r => r.id === id);
    if (!router) return;

    const port = router.port ? `:${router.port}` : '';
    const graphUrl = `http://${router.ip}${port}/graphs/`;
    window.open(graphUrl, '_blank');
}

// Copy graph link to clipboard
function copyGraphLink(id) {
    const router = routers.find(r => r.id === id);
    if (!router) return;

    const port = router.port ? `:${router.port}` : '';
    const graphUrl = `http://${router.ip}${port}/graphs/`;
    navigator.clipboard.writeText(graphUrl).then(() => {
        alert('Link graph berhasil disalin ke clipboard!');
    }).catch(err => {
        console.error('Gagal menyalin link:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = graphUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link graph berhasil disalin ke clipboard!');
    });
}


// Clear all data
function clearAllData() {
    if (confirm('Apakah Anda yakin ingin menghapus semua data router? Tindakan ini tidak dapat dibatalkan!')) {
        routers = [];
        saveRouters();
        renderRouters();
        syncStatus = false;
        updateSyncStatus();
    }
}

// Sync to Google Sheets
async function syncToGoogleSheets() {
    // Try Google Apps Script first (recommended)
    if (GOOGLE_APPS_SCRIPT_CONFIG.scriptUrl) {
        return syncToGoogleAppsScript();
    }
    
    // Fallback to Google Sheets API
    if (!GOOGLE_SHEETS_CONFIG.spreadsheetId || !GOOGLE_SHEETS_CONFIG.apiKey) {
        alert('Konfigurasi Google Sheets belum diatur. Silakan edit file config.js atau gunakan Google Apps Script (lihat GOOGLE_APPS_SCRIPT_SETUP.md)');
        return;
    }

    const syncStatusEl = document.getElementById('syncStatus');
    syncStatusEl.textContent = 'Syncing...';
    syncStatusEl.className = 'sync-status syncing';

    try {
        // Prepare data for Google Sheets
        const data = routers.map(router => [
            router.id,
            router.name,
            router.ip,
            router.port || '80',
            router.interface || '',
            router.location || '',
            formatDate(router.addedAt),
            `http://${router.ip}${router.port ? ':' + router.port : ''}/graphs/`
        ]);

        // Add header row
        const rows = [['ID', 'Nama Router', 'IP Address', 'Port', 'Interface', 'Lokasi', 'Ditambahkan', 'Link Graph'], ...data];

        // Using Google Sheets API (requires API key)
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/values/RouterMonitoring:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GOOGLE_SHEETS_CONFIG.apiKey}`
                },
                body: JSON.stringify({
                    values: rows
                })
            }
        );

        if (response.ok) {
            syncStatus = true;
            updateSyncStatus();
            alert('Data berhasil disinkronkan ke Google Sheets!');
        } else {
            throw new Error('Gagal sync ke Google Sheets');
        }
    } catch (error) {
        console.error('Sync error:', error);
        syncStatusEl.textContent = 'Sync Failed';
        syncStatusEl.className = 'sync-status unsynced';
        alert('Gagal sync ke Google Sheets. Pastikan konfigurasi sudah benar.');
    }
}

// Sync to Google Apps Script (recommended method)
async function syncToGoogleAppsScript() {
    if (!GOOGLE_APPS_SCRIPT_CONFIG.scriptUrl) {
        alert('Konfigurasi Google Apps Script belum diatur. Silakan edit file config.js dan ikuti panduan di GOOGLE_APPS_SCRIPT_SETUP.md');
        return;
    }

    const syncStatusEl = document.getElementById('syncStatus');
    syncStatusEl.textContent = 'Syncing...';
    syncStatusEl.className = 'sync-status syncing';

    try {
        // Prepare data for Google Apps Script
        const data = routers.map(router => [
            router.id,
            router.name,
            router.ip,
            router.port || '80',
            router.interface || '',
            router.location || '',
            formatDate(router.addedAt),
            `http://${router.ip}${router.port ? ':' + router.port : ''}/graphs/`
        ]);

        // Add header row
        const rows = [['ID', 'Nama Router', 'IP Address', 'Port', 'Interface', 'Lokasi', 'Ditambahkan', 'Link Graph'], ...data];

        console.log('Sending data to Google Apps Script:', rows);
        console.log('Number of routers:', routers.length);

        // Send to Google Apps Script
        const response = await fetch(GOOGLE_APPS_SCRIPT_CONFIG.scriptUrl, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rows)
        });

        console.log('Response received:', response);

        // Google Apps Script with no-cors doesn't give us response details
        // We assume success if no network error
        syncStatus = true;
        updateSyncStatus();
        alert(`Data berhasil disinkronkan ke Google Sheets via Google Apps Script!\n\nTotal router: ${routers.length}`);
        
    } catch (error) {
        console.error('Sync error:', error);
        syncStatusEl.textContent = 'Sync Failed';
        syncStatusEl.className = 'sync-status unsynced';
        alert('Gagal sync ke Google Sheets. Error: ' + error.message + '\n\nPastikan:\n1. Koneksi internet aktif\n2. Google Apps Script URL sudah benar\n3. Script sudah di-deploy dengan permission "Anyone"');
    }
}

// Alternative: Export to CSV for manual import to Google Sheets
function exportToCSV() {
    const headers = ['ID', 'Nama Router', 'IP Address', 'Port', 'Interface', 'Lokasi', 'Ditambahkan', 'Link Graph'];
    const rows = routers.map(router => [
        router.id,
        router.name,
        router.ip,
        router.port || '80',
        router.interface || '',
        router.location || '',
        formatDate(router.addedAt),
        `http://${router.ip}${router.port ? ':' + router.port : ''}/graphs/`
    ]);

    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'kominfo_riau_routers.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Check sync status
function checkSyncStatus() {
    const savedSyncStatus = localStorage.getItem('kominfoSyncStatus');
    if (savedSyncStatus) {
        syncStatus = JSON.parse(savedSyncStatus);
        updateSyncStatus();
    }
}

// Update sync status display
function updateSyncStatus() {
    const syncStatusEl = document.getElementById('syncStatus');
    localStorage.setItem('kominfoSyncStatus', JSON.stringify(syncStatus));

    if (syncStatus) {
        syncStatusEl.textContent = 'Synced';
        syncStatusEl.className = 'sync-status synced';
    } else {
        syncStatusEl.textContent = 'Belum Sync';
        syncStatusEl.className = 'sync-status unsynced';
    }
}

// Helper functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function isValidIP(ip) {
    const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipPattern.test(ip);
}
