# MikroTik Router Setup - Permission & Graphing

Panduan untuk mengatur permission dan enable graphing di router MikroTik.

## 🔓 Enable Graphing di MikroTik

### Via WinBox (GUI)

1. **Buka WinBox** dan connect ke router
2. **Tools > Graphing > Settings**
3. **Enable Graphing**: Centang/Check
4. Klik **Apply** atau **OK**

### Via Terminal (CLI)

```mikrotik
# Enable graphing
/tool graphing set enable=yes

# Cek status
/tool graphing print
```

## 🌐 Enable Web Service untuk Akses Graph

### Via WinBox

1. **IP > Services**
2. Cari **www** (Web Fig)
3. Centang **Enabled**
4. Set **Port** (default: 80)
5. Klik **Apply**

### Via Terminal

```mikrotik
# Enable web service pada port 80
/ip service set www enabled=yes port=80

# Cek status
/ip service print
```

### Jika Port 80 Sudah Digunakan

Gunakan port lain (misal 8080):

```mikrotik
# Enable web service pada port 8080
/ip service set www enabled=yes port=8080
```

Di dashboard, masukkan port 8080 saat tambah router.

## 🔐 Permission untuk Akses Graph

### Method 1: Tanpa Authentication (Public Access)

```mikrotik
# Set web service tanpa authentication
/ip service set www disabled=no port=80 address=0.0.0.0/0
```

⚠️ **Tidak disarankan untuk production** - Siapapun bisa akses router.

### Method 2: Basic Authentication (Recommended)

```mikrotik
# Set web service dengan basic authentication
/ip service set www disabled=no port=80 address=0.0.0.0/0

# Buat user untuk graphing
/user add name=graphing password=graphing123 group=read

# Atau gunakan user admin yang sudah ada
```

Di dashboard, graph akan meminta username/password saat dibuka.

### Method 3: IP Whitelist (Paling Secure)

```mikrotik
# Hanya allow IP tertentu
/ip service set www disabled=no port=80 address=192.168.1.0/24

# Atau allow IP spesifik
/ip service set www disabled=no port=80 address=10.121.121.100/32
```

Ganti `192.168.1.0/24` dengan network IP Anda.

## 🔥 Enable Firewall untuk Web Service

Pastikan firewall tidak memblokir port web:

```mikrotik
# Cek firewall rules
/ip firewall filter print

# Tambah rule untuk allow HTTP (port 80)
/ip firewall filter add chain=input protocol=tcp dst-port=80 action=accept

# Jika menggunakan port 8080
/ip firewall filter add chain=input protocol=tcp dst-port=8080 action=accept
```

## 📊 Enable Graphing untuk Interface Spesifik

### Via WinBox

1. **Tools > Graphing > Interface**
2. Pilih interface yang ingin di-graph
3. Centang **Store on disk**
4. Klik **Apply**

### Via Terminal

```mikrotik
# Enable graphing untuk semua interface
/tool graphing interface set-all store-on-disk=yes

# Enable graphing untuk interface spesifik
/tool graphing interface set ether1 store-on-disk=yes
/tool graphing interface set ether2 store-on-disk=yes
/tool graphing interface set wlan1 store-on-disk=yes
```

## 💻 Enable System Resource Graphing

### Via WinBox

1. **Tools > Graphing > Resource**
2. Pilih resource yang ingin di-graph:
   - CPU
   - Memory
   - Disk
   - Temperature
   - Voltage
   - Fan Speed
3. Centang **Store on disk**
4. Klik **Apply**

### Via Terminal

```mikrotik
# Enable graphing untuk CPU
/tool graphing resource set cpu store-on-disk=yes

# Enable graphing untuk Memory
/tool graphing resource set memory store-on-disk=yes

# Enable graphing untuk Disk
/tool graphing resource set hdd store-on-disk=yes

# Enable graphing untuk Temperature
/tool graphing resource set temperature store-on-disk=yes

# Enable graphing untuk semua resource
/tool graphing resource set-all store-on-disk=yes
```

## 🧪 Test Akses Graph

### 1. Test di Browser

Buka browser dan akses:
```
http://IP_ROUTER/graphs/
```

Contoh:
```
http://10.121.121.142/graphs/
```

### 2. Test Interface Graph

```
http://10.121.121.142/graphs/iface/ether1-InternetKOMINFO/
```

### 3. Test Resource Graph

```
http://10.121.121.142/graphs/resource/cpu/
```

### 4. Test dengan Port Kustom

```
http://10.121.121.142:8080/graphs/
```

## ❌ Troubleshooting

### Error: Connection Refused

**Masalah:** Tidak bisa connect ke router

**Solusi:**
1. Cek koneksi network ke router
2. Cek firewall di router
3. Cek firewall di komputer client
4. Ping router: `ping 10.121.121.142`

### Error: 401 Unauthorized

**Masalah:** Membutuhkan authentication

**Solusi:**
1. Cek authentication setting di `/ip service`
2. Gunakan username/password yang benar
3. Atau disable authentication untuk testing

### Error: 403 Forbidden

**Masalah:** IP tidak di-allow

**Solusi:**
1. Cek IP whitelist di `/ip service`
2. Tambah IP client ke whitelist
3. Atau set ke `0.0.0.0/0` untuk allow all

### Error: 404 Not Found

**Masalah:** Graphing tidak enabled

**Solusi:**
1. Enable graphing: `/tool graphing set enable=yes`
2. Enable web service: `/ip service set www enabled=yes`
3. Restart router jika perlu

### Graph Tidak Muncul

**Masalah:** Graph tidak menampilkan data

**Solusi:**
1. Enable store-on-disk untuk interface/resource
2. Tunggu beberapa menit untuk data terkumpul
3. Cek disk space di router
4. Cek log untuk error

### Error: Invalid ID

**Masalah:** ID interface/resource tidak valid

**Solusi:**
1. Cek nama interface yang benar: `/interface print`
2. Cek nama resource yang benar: `/system resource print`
3. Gunakan nama yang sesuai dengan konfigurasi router

## 📋 Cek Konfigurasi Router

Run command ini untuk cek semua konfigurasi:

```mikrotik
# Cek graphing status
/tool graphing print

# Cek interface graphing
/tool graphing interface print

# Cek resource graphing
/tool graphing resource print

# Cek web service
/ip service print

# Cek firewall rules
/ip firewall filter print

# Cek interface list
/interface print

# Cek system resource
/system resource print
```

## 🔒 Best Practices untuk Production

1. **Gunakan HTTPS** jika memungkinkan
2. **Enable authentication** untuk web service
3. **Gunakan IP whitelist** untuk akses terbatas
4. **Monitor log** untuk aktivitas mencurigakan
5. **Regular backup** konfigurasi router
6. **Update RouterOS** ke versi terbaru
7. **Disable unused services** untuk security

## 📞 Support

Jika masih ada masalah:
1. Cek MikroTik Wiki: https://wiki.mikrotik.com/wiki/Manual:Graphing
2. Cek MikroTik Forum: https://forum.mikrotik.com
3. Contact network administrator
