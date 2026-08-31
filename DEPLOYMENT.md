# Deployment Guide - Monitoring Router Kominfo Riau Dashboard

Panduan untuk deploy dashboard agar bisa diakses publik.

## 🌐 Opsi 1: GitHub Pages (Gratis & Recommended)

### Kelebihan
- Gratis sepenuhnya
- SSL/HTTPS otomatis
- Mudah setup
- Auto-deploy dari Git
- Custom domain support

### Langkah-langkah

#### 1. Buat Repository GitHub
1. Login ke [GitHub](https://github.com)
2. Klik **+ > New repository**
3. Beri nama: `kominfo-riau-dashboard`
4. Set ke **Public**
5. Klik **Create repository**

#### 2. Upload Files
**Option A: Via GitHub Web Interface**
1. Di repository baru, klik **uploading an existing file**
2. Drag & drop semua file dari project:
   - `index.html`
   - `app.js`
   - `config.js`
   - `google-apps-script.gs`
   - `README.md`
   - `GOOGLE_APPS_SCRIPT_SETUP.md`
3. Klik **Commit changes**

**Option B: Via Git Command Line**
```bash
cd C:\Users\USER\CascadeProjects\mikrotik-dashboard
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/kominfo-riau-dashboard.git
git push -u origin main
```

#### 3. Enable GitHub Pages
1. Di repository, klik **Settings**
2. Scroll ke **Pages** (sidebar kiri)
3. Under **Build and deployment** > **Source**:
   - Pilih **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
4. Klik **Save**

#### 5. Tunggu Deploy
- GitHub akan deploy dalam 1-2 menit
- URL akan muncul: `https://USERNAME.github.io/kominfo-riau-dashboard/`

#### 6. Akses Dashboard
- Buka URL yang diberikan
- Dashboard sudah live dan bisa diakses publik!

---

## 🚀 Opsi 2: Netlify (Gratis & Cepat)

### Kelebihan
- Gratis
- Drag & drop deploy
- SSL otomatis
- Custom domain
- Form handling

### Langkah-langkah

#### 1. Signup Netlify
1. Buka [Netlify](https://netlify.com)
2. Signup dengan GitHub/GitLab/Bitbucket

#### 2. Drag & Drop Deploy
1. Klik **"Add new site" > "Deploy manually"**
2. Drag folder `mikrotik-dashboard` ke area upload
3. Tunggu beberapa detik
4. Dashboard live dengan URL random: `https://random-name.netlify.app`

#### 3. Custom Site Name (Opsional)
1. Di dashboard Netlify, klik **Site settings**
2. **Change site name**
3. Masukkan nama: `kominfo-riau-dashboard`
4. URL menjadi: `https://kominfo-riau-dashboard.netlify.app`

---

## ⚡ Opsi 3: Vercel (Gratis & Modern)

### Kelebihan
- Gratis
- Git integration
- SSL otomatis
- Fast CDN
- Preview deployments

### Langkah-langkah

#### 1. Signup Vercel
1. Buka [Vercel](https://vercel.com)
2. Signup dengan GitHub

#### 2. Import Project
1. Klik **"Add New Project"**
2. Import repository GitHub
3. Configure:
   - Framework Preset: **Other**
   - Root Directory: **./**
4. Klik **Deploy**

#### 3. Akses Dashboard
- URL: `https://kominfo-riau-dashboard.vercel.app`

---

## 🖥️ Opsi 4: VPS/Server Sendiri

### Kelebihan
- Full control
- Custom domain
- Bisa hosting backend
- Lebih secure untuk internal use

### Langkah-langkah

#### 1. Siapkan Server
- VPS (DigitalOcean, Linode, AWS EC2)
- Atau server internal

#### 2. Install Web Server
**Nginx:**
```bash
sudo apt update
sudo apt install nginx
sudo systemctl start nginx
```

**Apache:**
```bash
sudo apt update
sudo apt install apache2
sudo systemctl start apache2
```

#### 3. Upload Files
```bash
# Upload via SCP
scp -r C:\Users\USER\CascadeProjects\mikrotik-dashboard/* user@server:/var/www/html/

# Atau via FTP/SFTP
```

#### 4. Configure Nginx
```nginx
server {
    listen 80;
    server_name dashboard.kominfo.riau.go.id;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

#### 5. Enable SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d dashboard.kominfo.riau.go.id
```

---

## 🔒 Security Considerations

### Untuk Public Access
- **Jangan** simpan data sensitif di client-side
- **Gunakan HTTPS** (semua opsi di atas provide SSL gratis)
- **Rate limiting** untuk mencegah abuse
- **CORS configuration** jika perlu API access

### Untuk Internal Use Only
- Gunakan **authentication** (Basic Auth, OAuth, dll)
- **IP whitelist** - hanya allow IP tertentu
- **VPN access** - akses via VPN internal
- **Network isolation** - hosting di internal network

---

## 🎯 Rekomendasi

### Untuk Kominfo Riau
**Opsi 1: GitHub Pages** (Recommended)
- Gratis dan mudah
- Cukup untuk static dashboard
- Bisa diakses publik dengan HTTPS

### Untuk Internal Use
**Opsi 4: VPS dengan Authentication**
- Full control
- Bisa tambahkan authentication
- Lebih secure untuk data internal

---

## 📝 Custom Domain

### Setup Custom Domain
1. Buy domain (misal: `dashboard.kominfo.riau.go.id`)
2. Di GitHub Pages/Netlify/Vercel:
   - Add custom domain
3. Update DNS records:
   ```
   Type: CNAME
   Name: dashboard
   Value: USERNAME.github.io (atau sesuai provider)
   ```

---

## 🔄 Auto-Deploy

### GitHub Actions (Opsional)
Buat file `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## 🐛 Troubleshooting

### 404 Error
- Check file `index.html` ada di root
- Check GitHub Pages settings

### CORS Error
- Router harus mengizinkan cross-origin requests
- Atau gunakan proxy server

### Data tidak tersimpan
- LocalStorage tidak bekerja cross-domain
- Gunakan Google Sheets sebagai database utama

---

## 📞 Support

Jika ada masalah dengan deployment:
1. Cek documentation masing-masing provider
2. Cek browser console untuk error
3. Pastikan semua file terupload dengan benar
