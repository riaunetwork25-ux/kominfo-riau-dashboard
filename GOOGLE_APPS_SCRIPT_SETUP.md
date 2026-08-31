# Setup Google Apps Script untuk MikroTik Dashboard

Panduan lengkap setup Google Apps Script untuk integrasi dashboard dengan Google Sheets.

## 📋 Langkah-langkah Setup

### 1. Buat Google Sheet Baru

1. Buka [sheets.google.com](https://sheets.google.com)
2. Klik "Blank" untuk membuat spreadsheet baru
3. Beri nama spreadsheet: "MikroTik Router Monitoring"
4. Sheet akan otomatis bernama "Sheet1" - biarkan saja

### 2. Buka Apps Script Editor

1. Di Google Sheet, klik **Extensions > Apps Script**
2. Akan terbuka tab baru dengan Apps Script editor
3. Hapus semua kode yang ada (default function)

### 3. Copy Paste Script

1. Buka file `google-apps-script.gs` dari project dashboard
2. Copy semua kode
3. Paste ke Apps Script editor
4. Simpan dengan klik icon disket atau `Ctrl + S`
5. Beri nama project: "MikroTik Dashboard Integration"

### 4. Deploy sebagai Web App

1. Klik **Deploy > New Deployment**
2. Pilih type: **Web App**
3. Isi form:
   - **Description**: "MikroTik Dashboard API"
   - **Execute as**: Me (email Anda)
   - **Who has access**: Anyone
4. Klik **Deploy**
5. Akan muncul popup authorization:
   - Klik **Review permissions**
   - Pilih Google account Anda
   - Klik **Advanced**
   - Klik **Go to MikroTik Dashboard Integration (unsafe)**
   - Klik **Allow**
6. Copy **Web App URL** yang muncul
   - Format: `https://script.google.com/macros/s/.../exec`

### 5. Konfigurasi Dashboard

1. Buka file `config.js` di project dashboard
2. Update konfigurasi Google Apps Script:

```javascript
const GOOGLE_APPS_SCRIPT_CONFIG = {
    // Paste Web App URL di sini
    scriptUrl: 'https://script.google.com/macros/s/YOUR_WEB_APP_ID/exec',
    
    // Nama sheet di Google Sheets
    sheetName: 'RouterMonitoring'
};
```

3. Simpan file `config.js`

### 6. Test Integration

1. Buka dashboard (`index.html`)
2. Tambah beberapa router
3. Klik **"🔄 Sync ke Google Sheets"**
4. Cek Google Sheet - data akan muncul di sheet "RouterMonitoring"

## 🔧 Fungsi Tambahan di Apps Script

Script ini juga menyediakan fungsi-fungsi tambahan yang bisa dipanggil langsung dari Apps Script editor:

### `setup()`
Jalankan fungsi ini untuk setup awal (hanya sekali):
- Membuat sheet "RouterMonitoring"
- Menambah header dengan format
- Menambah data sample

**Cara menjalankan:**
1. Di Apps Script editor, pilih fungsi `setup` dari dropdown
2. Klik **Run**
3. Berikan permission jika diminta

### `getAllRouters()`
Mengambil semua data router dari sheet.

**Cara menjalankan:**
1. Pilih fungsi `getAllRouters` dari dropdown
2. Klik **Run**
3. Hasil akan muncul di log (View > Logs)

### `addRouter(routerData)`
Menambah router tunggu ke sheet.

**Contoh penggunaan:**
```javascript
addRouter({
  id: '12345',
  name: 'Router Baru',
  ip: '192.168.1.1',
  interface: 'ether1',
  location: 'Kantor'
});
```

### `deleteRouter(routerId)`
Menghapus router berdasarkan ID.

**Contoh penggunaan:**
```javascript
deleteRouter('12345');
```

## 🎨 Format Sheet Otomatis

Script ini akan otomatis:
- Membuat header dengan background biru (#667eea)
- Memberi warna alternating pada rows
- Auto-size columns
- Freeze header row
- Format tanggal dan waktu

## 📊 Struktur Data di Sheet

Sheet akan memiliki kolom:

| Kolom | Deskripsi | Contoh |
|-------|-----------|--------|
| ID | Unique identifier | 1725123456789 |
| Nama Router | Nama router | Router Kantor Pusat |
| IP Address | IP address router | 10.121.121.142 |
| Port | Port HTTP (default: 80) | 80 atau 8080 |
| Interface | Nama interface (opsional) | ether1-InternetKOMINFO |
| Lokasi | Lokasi fisik router | Kantor Pusat |
| Ditambahkan | Tanggal ditambahkan | 31/08/2026, 11:30:00 |
| Link Graph | Link ke graph router | http://10.121.121.142/graphs/ |

## 🔒 Security

- Web App di-set ke "Anyone" agar bisa diakses dari dashboard
- Data dikirim via HTTPS
- Google Sheets memiliki built-in security
- Pastikan tidak share spreadsheet ke public jika data sensitif

## 🐛 Troubleshooting

### Error "Script function not found"
- Pastikan nama fungsi di script benar
- Refresh Apps Script editor
- Deploy ulang Web App

### Error "Authorization required"
- Re-deploy Web App
- Pastikan permission sudah diberikan
- Cek Google account yang digunakan

### Data tidak muncul di sheet
- Cek Web App URL di config.js sudah benar
- Cek console browser untuk error
- Pastikan internet connection stable

### Sheet tidak ter-create
- Pastikan nama sheet di config.js sama
- Jalankan fungsi `setup()` manual
- Cek permission Google Sheets

## 🚀 Tips

- **Backup**: Export spreadsheet secara berkala
- **Multiple users**: Share spreadsheet ke team untuk kolaborasi
- **Custom format**: Edit script untuk format sheet sesuai kebutuhan
- **Version control**: Keep copy of script sebelum mengubah

## 📝 Update Script

Jika ingin mengubah script:
1. Edit di Apps Script editor
2. Simpan perubahan
3. Deploy ulang Web App:
   - Deploy > Manage Deployments
   - Pilih deployment yang ada
   - Klik Edit > redeploy
4. Update Web App URL di config.js jika berubah

## 🎯 Next Steps

Setelah setup selesai:
1. Tambah semua router ke dashboard
2. Sync ke Google Sheets
3. Setup sharing spreadsheet ke team
4. (Opsional) Buat dashboard tambahan di Google Sheets dengan charts

---

**Need Help?**
Cek README.md di project dashboard untuk informasi lebih lanjut.
