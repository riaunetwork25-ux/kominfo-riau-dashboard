# Authentication System - Monitoring Router Kominfo Riau Dashboard

Panduan sistem autentikasi untuk keamanan dashboard.

## 🔐 Fitur Keamanan

- **Login Page** - Halaman login terpisah sebelum akses dashboard
- **Session Management** - Session dengan timeout otomatis
- **Remember Me** - Opsi untuk mengingat login (7 hari)
- **Auto Logout** - Logout otomatis setelah session expired
- **Secure Storage** - Data session tersimpan di localStorage

## 🚀 Cara Menggunakan

### 1. Buka Dashboard

Buka file `login.html` di browser:
```
file:///C:/Users/USER/CascadeProjects/mikrotik-dashboard/login.html
```

### 2. Login Default

**Username:** `admin`  
**Password:** `kominfo123`

### 3. Ubah Kredensial

Edit file `config.js` untuk mengubah username dan password:

```javascript
const AUTH_CREDENTIALS = {
    username: 'admin',
    password: 'password_baru_anda'
};
```

### 4. Session Timeout

- **Default:** 30 menit
- **Remember Me:** 7 hari
- Session akan otomatis logout jika expired

## 📋 Flow Autentikasi

### Login Flow
1. User buka `login.html`
2. Masukkan username & password
3. Klik tombol "Login"
4. Validasi kredensial
5. Jika valid → buat session → redirect ke `index.html`
6. Jika invalid → tampilkan error

### Dashboard Access Flow
1. User buka `index.html`
2. Cek session di localStorage
3. Jika session valid → tampilkan dashboard
4. Jika session invalid/expired → redirect ke `login.html`

### Logout Flow
1. User klik tombol "Logout"
2. Hapus session dari localStorage
3. Redirect ke `login.html`

## 🔧 Konfigurasi

### Ubah Session Timeout

Edit file `auth.js`:

```javascript
// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000; // Ubah sesuai kebutuhan
```

### Ubah Remember Me Duration

Edit file `auth.js`:

```javascript
// Dalam fungsi handleLogin()
sessionData.expiry = rememberMe ? 
    Date.now() + (7 * 24 * 60 * 60 * 1000) : // 7 hari
    Date.now() + SESSION_TIMEOUT; // 30 menit
```

## 🛡️ Security Notes

### Keamanan yang Sudah Ada
- ✅ Session timeout otomatis
- ✅ Password tidak disimpan di browser (hanya session token)
- ✅ Auto-logout jika session expired
- ✅ Redirect otomatis jika tidak ada session

### Keamanan yang Perlu Ditambahkan (Untuk Production)
- ⚠️ **HTTPS** - Gunakan HTTPS untuk production
- ⚠️ **Backend Authentication** - Untuk security yang lebih kuat
- ⚠️ **Password Hashing** - Hash password di backend
- ⚠️ **Rate Limiting** - Mencegah brute force attack
- ⚠️ **Multi-factor Authentication** - Tambah 2FA
- ⚠️ **Audit Logs** - Log semua aktivitas login

### Limitations (Client-Side Only)
- ⚠️ Kredensial tersimpan di JavaScript (bisa dilihat di View Source)
- ⚠️ Tidak cocok untuk data sangat sensitif
- ⚠️ Vulnerable terhadap XSS attack
- ⚠️ Session storage di localStorage bisa diakses user

## 🔍 Troubleshooting

### Tidak Bisa Login

**Masalah:** Username/password selalu salah

**Solusi:**
1. Cek kredensial di `config.js`
2. Pastikan tidak ada spasi ekstra
3. Clear browser cache dan localStorage
4. Refresh halaman

### Auto Logout Terus

**Masalah:** Selalu logout otomatis

**Solusi:**
1. Cek session timeout di `auth.js`
2. Pastikan localStorage tidak dihapus oleh browser
3. Cek browser console untuk error

### Lupa Password

**Masalah:** Lupa password yang sudah diubah

**Solusi:**
1. Edit file `config.js`
2. Reset ke password default atau buat baru
3. Refresh halaman login

### Session Tidak Tersimpan

**Masalah:** "Ingat saya" tidak berfungsi

**Solusi:**
1. Pastikan localStorage enabled di browser
2. Cek browser settings untuk localStorage permission
3. Coba browser lain

## 📱 Deployment dengan Authentication

### GitHub Pages
- ✅ Login page akan berfungsi
- ⚠️ Kredensial visible di source code (tidak secure untuk production)

### Netlify/Vercel
- ✅ Login page akan berfungsi
- ⚠️ Sama seperti GitHub Pages

### VPS dengan Backend (Recommended untuk Production)
- ✅ Lebih secure
- ✅ Kredensial di server, tidak di client
- ✅ Bisa tambahkan fitur security tambahan

## 🔄 Upgrade ke Backend Authentication

Untuk production use, disarankan upgrade ke backend authentication:

### Option 1: Firebase Authentication
- Gratis
- Mudah integrasi
- Support multiple auth methods

### Option 2: Auth0
- Enterprise-grade
- Banyak fitur security
- Free tier available

### Option 3: Custom Backend
- Full control
- Bisa custom sesuai kebutuhan
- Memerlukan development effort

## 📝 File Structure

```
mikrotik-dashboard/
├── login.html              # Halaman login
├── index.html              # Dashboard utama
├── auth.js                 # Logic autentikasi
├── config.js               # Konfigurasi (termasuk kredensial)
├── app.js                  # Logic dashboard
└── AUTHENTICATION.md       # Documentation ini
```

## 🎯 Best Practices

1. **Ganti password default** sebelum production
2. **Gunakan HTTPS** untuk production
3. **Limit session duration** untuk security
4. **Monitor login attempts** jika ada backend
5. **Regular security updates** untuk dependencies
6. **Backup data** secara berkala

## 🆘 Emergency Access

Jika terkunci dan tidak bisa login:

1. Buka browser console (F12)
2. Jalankan perintah:
```javascript
localStorage.removeItem('kominfoSession');
```
3. Refresh halaman
4. Login dengan kredensial yang benar

---

**Catatan:** Sistem autentikasi ini adalah client-side only. Untuk production environment dengan data sensitif, disarankan menggunakan backend authentication system.
