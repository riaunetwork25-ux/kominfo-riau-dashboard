# Monitoring Router Kominfo Riau Dashboard

Dashboard sederhana untuk monitoring banyak router Kominfo Riau dengan integrasi Google Sheets untuk database.

## 🚀 Fitur

- **Central Dashboard**: Monitoring semua router Kominfo Riau dari satu tempat
- **Authentication System**: Login page untuk keamanan akses
- **Session Management**: Session dengan timeout otomatis
- **Graph Viewing**: Lihat traffic graph langsung dari dashboard
- **Google Sheets Integration**: Sinkronisasi data ke Google Sheets
- **Local Storage**: Data tersimpan di browser (tidak perlu database)
- **Responsive Design**: Tampilan modern dan responsif
- **Easy Management**: Tambah, edit, hapus router dengan mudah

## 📋 Persyaratan

- Web browser modern (Chrome, Firefox, Edge, Safari)
- Akses ke router Kominfo Riau (IP address reachable)
- Router dengan fitur graphing enabled
- (Opsional) Google Account untuk Google Sheets integration

## 🛠️ Installation

### 1. Download/Clone Project

```bash
cd C:\Users\USER\CascadeProjects\mikrotik-dashboard
```

### 2. Buka Dashboard

Buka file `login.html` di browser (bukan index.html):

```bash
# Buka langsung di browser
# file:///C:/Users/USER/CascadeProjects/mikrotik-dashboard/login.html

# Atau gunakan web server lokal:
python -m http.server 8000
# Kemudian buka http://localhost:8000/login.html
```

**Default Login:**
- Username: `admin`
- Password: `kominfo123`

### 3. Konfigurasi Awal

Edit file `config.js` untuk setup Google Sheets (opsional):

```javascript
const GOOGLE_SHEETS_CONFIG = {
    spreadsheetId: 'YOUR_SPREADSHEET_ID',
    apiKey: 'YOUR_API_KEY',
    sheetName: 'RouterMonitoring'
};
```

## 📖 Cara Penggunaan

### Menambah Router Baru

1. Klik tombol **"+ Tambah Router"**
2. Isi form:
   - **Nama Router**: Nama identifikasi router
   - **IP Address**: IP address router MikroTik
   - **Port**: Port HTTP (opsional, default: 80)
   - **Interface**: Nama interface (opsional, untuk graph spesifik)
   - **Lokasi**: Lokasi fisik router (opsional)
3. Klik **"Simpan Router"**

### Melihat Graph

- **Graph Interface**: Klik **"📊 Graph Interface"** untuk melihat graph interface tertentu di tab baru
- **Semua Interface**: Klik **"🔗 Semua Interface"** untuk melihat semua interface router di tab baru
- **Copy Link**: Klik **"📋 Copy Link"** untuk menyalin link graph ke clipboard

### Sinkronisasi ke Google Sheets

#### Metode 1: Google Sheets API (Advanced)

1. Buat project di [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google Sheets API
3. Buat API Key
4. Buat Google Sheet baru
5. Copy Spreadsheet ID dari URL
6. Edit `config.js` dengan credentials Anda
7. Klik **"🔄 Sync ke Google Sheets"** di dashboard

#### Metode 2: Google Apps Script (Recommended - Lebih Mudah)

Untuk panduan lengkap setup Google Apps Script, lihat file **GOOGLE_APPS_SCRIPT_SETUP.md** di project.

Ringkasan langkah:
1. Buat Google Sheet baru di [sheets.google.com](https://sheets.google.com)
2. Buka **Extensions > Apps Script**
3. Copy kode dari file `google-apps-script.gs`
4. Deploy sebagai Web App dengan permission "Anyone"
5. Copy Web App URL
6. Edit `config.js` dan masukkan URL ke `GOOGLE_APPS_SCRIPT_CONFIG.scriptUrl`
7. Klik **"🔄 Sync ke Google Sheets"** di dashboard

#### Metode 3: Export CSV (Manual)

1. Tambahkan router di dashboard
2. Klik tombol export (akan ditambahkan jika diperlukan)
3. Import CSV ke Google Sheets secara manual

### Menghapus Router

1. Klik tombol **"🗑️ Hapus"** pada card router
2. Konfirmasi penghapusan

## 🔧 Konfigurasi Router

Pastikan graphing enabled di router:

```mikrotik
# Enable graphing
/tool graphing set enable=yes

# Atau via WinBox:
# Tools > Graphing > Settings > Enable
```

Pastikan web server enabled untuk akses graph:

```mikrotik
# Enable web server
/ip service set www enabled=yes port=80
```

## 📁 Struktur Project

```
mikrotik-dashboard/
├── index.html                      # Main dashboard HTML
├── app.js                          # Application logic
├── config.js                       # Configuration file
├── google-apps-script.gs           # Google Apps Script integration
├── GOOGLE_APPS_SCRIPT_SETUP.md     # Setup guide for Google Apps Script
└── README.md                       # Documentation
```

## 🔒 Security Notes

- Dashboard berjalan di client-side (browser)
- Data disimpan di localStorage browser
- Untuk production, gunakan HTTPS
- Jangan expose dashboard ke public internet tanpa authentication
- IP address router tersimpan di browser lokal

## 🚀 Troubleshooting

### Graph tidak muncul

- Pastikan router reachable dari browser
- Check firewall di router MikroTik
- Pastikan web service enabled di MikroTik
- Coba akses langsung `http://IP-ROUTER/graphs/`

### Sync ke Google Sheets gagal

- Pastikan konfigurasi di `config.js` sudah benar
- Check API Key atau Web App URL
- Pastikan permission Google Sheets sudah benar
- Cek browser console untuk error message

### Data hilang setelah refresh browser

- Data disimpan di localStorage browser
- Pastikan browser tidak menghapus localStorage
- Export data secara berkala sebagai backup

## 🎯 Future Enhancements

- [ ] Authentication system
- [ ] Real-time bandwidth monitoring via WebSocket
- [ ] Alert system untuk threshold
- [ ] Historical data analysis
- [ ] Export ke format lain (PDF, Excel)
- [ ] Dark mode
- [ ] Multi-user support
- [ ] Backend server untuk data persistence

## 📝 License

Free untuk penggunaan personal dan commercial.

## 🤝 Contributing

Contributions are welcome! Silakan fork dan buat pull request.

## 📧 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository.

---

**Note**: Dashboard ini menggunakan built-in MikroTik graphing system. Pastikan router MikroTik Anda memiliki fitur graphing enabled.
