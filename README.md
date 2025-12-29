# 🎵 Webamp Music Player

Aplikasi web music player berbasis **Webamp** (Winamp Web Clone) yang dioptimalkan untuk Linux ARM (Armbian).

## ✨ Fitur

- ✅ **Playlist Otomatis**: Membaca semua file .mp3 dari folder `music/`
- ✅ **Metadata MP3**: Membaca artist, title, album dari file MP3
- ✅ **Webamp UI**: Interface Winamp modern berbasis web
- ✅ **Auto-update Playlist**: Folder `music/` dimonitor, playlist update otomatis
- ✅ **Static Server**: Serve file statis, musik, dan skin dari Express
- ✅ **Local Skin Support**: Skin Winamp disimpan lokal di folder `/skin`
- ✅ **Tanpa Database**: Murni filesystem-based
- ✅ **Aman & Sederhana**: Cocok untuk server pribadi
- ✅ **Armbian Compatible**: Optimized untuk Linux ARM
- ✅ **Full Screen Player**: Interface yang memenuhi seluruh layar

## 🛠️ Teknologi

- **Backend**: Node.js + Express
- **Frontend**: HTML + Vanilla JavaScript
- **Metadata**: music-metadata library
- **UI**: Webamp 1.4.0 dengan Winamp5 Classified skin
- **Server**: Compatible dengan Linux ARM (Armbian)

## 📋 Struktur Folder

```
webamp-music-player/
├── server.js          # Backend Express server
├── index.html         # Frontend dengan Webamp
├── package.json       # Dependensi
├── .gitignore         # Git ignore file
├── skin/              # Folder skin Winamp
│   └── Winamp5_Classified_v5.5.wsz
├── music/             # Folder musik
│   └── *.mp3          # File musik
└── README.md          # Dokumentasi
```

## 🚀 Cara Menjalankan

### 1. Setup Awal (Pertama Kali)

```bash
# Clone atau download project
git clone <repository-url>
cd webamp-music-player

# Install dependencies
npm install

# Server akan membuat folder music/ otomatis jika belum ada
```

### 2. Jalankan Server

```bash
# Development/Production mode
npm start

# Atau langsung dengan Node
node server.js
```

Output:
```
╔════════════════════════════════════╗
║   Webamp Music Player Started       ║
╚════════════════════════════════════╝

✓ Server running on: http://0.0.0.0:3000
✓ Music folder: /path/to/music
✓ Access from: http://localhost:3000

📝 Setup:
  1. Add .mp3 files to the music/ folder
  2. Refresh the browser to update playlist
  3. Metadata will be read automatically
```

### 3. Akses Aplikasi

- **Local**: http://localhost:3000
- **Dari Device Lain**: http://<IP-ADDRESS>:3000
  - Cari IP dengan: `hostname -I` (Linux) atau `ipconfig` (Windows)

### 4. Tambah Lagu

```bash
# Copy file MP3 ke folder music/
cp lagu.mp3 music/

# Atau drag-drop file ke folder music/
```

**Refresh browser** → lagu muncul otomatis di playlist!

## 📝 API Endpoints

### GET `/playlist`
Mendapatkan daftar semua lagu dengan metadata

**Response:**
```json
[
  {
    "title": "Song Title",
    "artist": "Artist Name",
    "album": "Album Name",
    "duration": 240,
    "url": "/music/song.mp3",
    "filename": "song.mp3"
  }
]
```

### GET `/api/info`
Mendapatkan informasi server

**Response:**
```json
{
  "name": "Webamp Music Player",
  "version": "1.0.0",
  "musicDir": "/path/to/music"
}
```

### Static Files
- `GET /` → index.html
- `GET /music/*` → File MP3 dari folder music/
- `GET /skin/*` → Skin Winamp dari folder skin/

## ⚙️ Konfigurasi

### Port Kustom
```bash
PORT=8080 npm start
```

### Ganti Skin Webamp

1. Taruh file `.wsz` di folder `skin/`
2. Edit `index.html`, baris `initialSkin`:
```javascript
initialSkin: {
  url: '/skin/nama-skin-anda.wsz'
}
```
3. Restart server dan refresh browser

### Folder Musik Kustom
Edit di `server.js`:
```javascript
const MUSIC_DIR = path.join(__dirname, 'custom-music-folder');
```

## 🔍 Metadata MP3

Server otomatis membaca dari tag ID3v2:
- **Title**: Dari tag ID3v2, fallback ke nama file
- **Artist**: Dari tag ID3v2, default "Unknown Artist"
- **Album**: Dari tag ID3v2, default "Unknown Album"
- **Duration**: Dari file MP3 header

Jika metadata kosong, sistem akan menggunakan nama file sebagai judul.

## 🎨 Skin Webamp Saat Ini

Menggunakan **Winamp5 Classified v5.5** (disimpan lokal di folder `/skin`)

Untuk menambah skin baru:
1. Download file `.wsz` dari internet
2. Letakkan di folder `skin/`
3. Update URL di `index.html`

**Resources Skin:**
- https://www.winamp.com/skins (official)
- https://skinbase.org/
- https://www.deviantart.com/ (search "Winamp skin")

## 🖥️ Armbian Setup

### Install Node.js di Armbian

```bash
# Update package list
sudo apt update

# Install Node.js dan npm
sudo apt install nodejs npm

# Atau gunakan NVM untuk versi terbaru (recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs
```

### Jalankan Sebagai Service (Systemd)

1. Buat file `/etc/systemd/system/webamp.service`:

```ini
[Unit]
Description=Webamp Music Player
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/home/your-username/webamp-music-player
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

2. Setup service:
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service (auto-start saat boot)
sudo systemctl enable webamp

# Start service
sudo systemctl start webamp

# Check status
sudo systemctl status webamp
```

3. Manage service:
```bash
# Stop service
sudo systemctl stop webamp

# Restart service
sudo systemctl restart webamp

# View logs
sudo journalctl -u webamp -f
```

## 🔒 Security Notes

- Server listen di `0.0.0.0` (accessible dari jaringan lokal)
- Untuk production internet-facing, gunakan reverse proxy (nginx)
- Folder `music/` read-only dari browser, tidak bisa write/delete
- Tidak ada upload functionality
- Cocok untuk server pribadi/intranet

## 📊 Monitoring & Logging

Check logs real-time:
```bash
# Real-time logs (Armbian)
sudo journalctl -u webamp -f

# Last 50 lines
sudo journalctl -u webamp -n 50

# Last 1 hour
sudo journalctl -u webamp --since "1 hour ago"
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Ganti port
PORT=3001 npm start

# Cari process yang menggunakan port 3000 (Linux)
sudo lsof -i :3000
sudo kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Metadata MP3 tidak terbaca
- Pastikan file MP3 punya tag ID3v2
- Server otomatis fallback ke nama file jika tag kosong
- Buka DevTools browser (F12) → Console untuk error detail

### File MP3 tidak muncul di playlist
- Pastikan file di folder `music/` dengan extension `.mp3` (lowercase)
- Hard refresh browser: **Ctrl+F5** (Windows/Linux) atau **Cmd+Shift+R** (Mac)
- Check server log: `npm start` dan lihat error message

### Skin Webamp tidak tampil
- Pastikan file `.wsz` ada di folder `skin/`
- Cek bahwa URL di `index.html` benar: `/skin/nama-file.wsz`
- Refresh browser dan buka DevTools Console (F12)
- Restart server: `Ctrl+C` lalu `npm start`

### Webamp tidak load sama sekali
- Buka DevTools (F12) → Console tab
- Cek apakah ada error message
- Pastikan server running: check terminal output
- Reload halaman: **F5** atau **Ctrl+R**

### Server tidak start
```bash
# Check error detail
node server.js

# Pastikan Node.js terinstall
node --version
npm --version

# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📦 Dependencies

- **express** (^4.18.2): Web server framework
- **music-metadata** (^8.1.3): MP3 metadata reader

Install ulang (jika perlu):
```bash
npm install
# atau
npm install express music-metadata
```

## 📄 License

MIT License - Bebas digunakan untuk project pribadi

## 🎯 Roadmap Fitur

- [ ] Support format audio lain (.flac, .ogg, .wav, .m4a)
- [ ] Shuffle & repeat modes
- [ ] Playlist save/load
- [ ] Dark/light theme toggle
- [ ] Mobile responsive controller
- [ ] Volume control UI
- [ ] Equalizer
- [ ] Visualization

## 📞 Quick Help

**Sesuatu tidak berfungsi? Coba ini dulu:**

1. ✅ Restart server: `Ctrl+C` lalu `npm start`
2. ✅ Hard refresh browser: `Ctrl+F5` (Windows) / `Cmd+Shift+R` (Mac)
3. ✅ Check DevTools Console: `F12` → Console tab
4. ✅ Check server logs di terminal
5. ✅ Pastikan folder `music/` ada dan berisi file `.mp3`

---

**Enjoy your music! 🎵**
Made with ❤️ for personal music servers
