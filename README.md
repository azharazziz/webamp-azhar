# 🎵 Webamp Music Player

Aplikasi web music player berbasis **Webamp** (Winamp Web Clone) yang dioptimalkan untuk Linux ARM (Armbian).

## ✨ Fitur

- ✅ **Playlist Otomatis**: Membaca semua file .mp3 dari folder `music/`
- ✅ **Metadata MP3**: Membaca artist, title, album dari file MP3
- ✅ **Webamp UI**: Interface Winamp klasik berbasis web
- ✅ **Auto-update Playlist**: Folder `music/` dimonitor, playlist update otomatis
- ✅ **Static Server**: Serve file statis dan musik dari Express
- ✅ **Tanpa Database**: Murni filesystem-based
- ✅ **Aman & Sederhana**: Cocok untuk server pribadi
- ✅ **Armbian Compatible**: Optimized untuk Linux ARM

## 🛠️ Teknologi

- **Backend**: Node.js + Express
- **Frontend**: HTML + Vanilla JavaScript
- **Metadata**: music-metadata library
- **UI**: Webamp dari CDN (skin klasik base-2.91.wsz)
- **Server**: Compatible dengan Linux ARM (Armbian)

## 📋 Struktur Folder

```
webamp-music-player/
├── server.js          # Backend Express server
├── index.html         # Frontend dengan Webamp
├── package.json       # Dependensi
└── music/             # Folder musik (auto-create)
    └── *.mp3          # File musik (diletakkan di sini)
```

## 🚀 Cara Menjalankan

### 1. Setup Awal (Pertama Kali)

```bash
# Masuk ke folder project
cd webamp-music-player

# Install dependencies
npm install

# Server akan membuat folder music/ otomatis
```

### 2. Jalankan Server

```bash
# Development mode
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

Refresh browser → lagu muncul otomatis di playlist!

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

## ⚙️ Konfigurasi

### Port Kustom
```bash
PORT=8080 npm start
```

### Folder Musik Kustom
Edit di `server.js`:
```javascript
const MUSIC_DIR = path.join(__dirname, 'custom-music-folder');
```

## 🔍 Metadata MP3

Server otomatis membaca:
- **Title**: Dari tag ID3v2, fallback ke nama file
- **Artist**: Dari tag ID3v2, default "Unknown Artist"
- **Album**: Dari tag ID3v2, default "Unknown Album"
- **Duration**: Dari file MP3 header

## 🎨 Skin Webamp

Default menggunakan skin klasik Winamp **base-2.91.wsz**

Untuk menggunakan skin lain, edit di `index.html`:
```javascript
initialSkin: {
  url: 'https://cdn.example.com/skins/custom.wsz'
}
```

## 🖥️ Armbian Setup

### Install Node.js di Armbian
```bash
# Install Node.js
sudo apt update
sudo apt install nodejs npm

# Atau gunakan NVM untuk versi terbaru
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

[Install]
WantedBy=multi-user.target
```

2. Enable dan start service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable webamp
sudo systemctl start webamp
sudo systemctl status webamp
```

3. Stop service:
```bash
sudo systemctl stop webamp
```

## 🔒 Security Notes

- Server listen di `0.0.0.0` (accessible dari jaringan)
- Untuk production, gunakan reverse proxy (nginx)
- Folder `music/` hanya bisa read, tidak bisa write dari browser
- Tidak ada upload functionality

## 📊 Monitoring

Check logs:
```bash
# Real-time logs
sudo journalctl -u webamp -f

# Last 50 lines
sudo journalctl -u webamp -n 50
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Ganti port
PORT=3001 npm start

# Atau cari process yang menggunakan port 3000
lsof -i :3000
kill -9 <PID>
```

### Metadata tidak terbaca
- Pastikan file MP3 punya tag ID3v2
- Server akan fallback ke nama file jika tag kosong
- Check console browser untuk error

### File MP3 tidak muncul
- Pastikan file di folder `music/` dan extension `.mp3` (lowercase)
- Refresh browser (Ctrl+F5 hard refresh)
- Check server log untuk error

### Webamp tidak load
- Buka browser DevTools (F12)
- Check Console tab untuk error
- Pastikan internet connection (CDN Webamp)

## 📦 Dependencies

- **express** (4.18.2+): Web server framework
- **music-metadata** (8.1.3+): MP3 metadata reader

Install manual:
```bash
npm install express music-metadata
```

## 📄 License

MIT License - Bebas digunakan untuk project pribadi

## 🎯 Roadmap

- [ ] Support format lain (.flac, .ogg, .wav)
- [ ] Shuffle & repeat modes
- [ ] Playlist save/load
- [ ] Dark/light theme toggle
- [ ] Mobile responsive player

## 📞 Support

Jika ada masalah:
1. Check console browser (F12)
2. Check server logs
3. Restart server
4. Pastikan folder `music/` ada

---

**Enjoy your music! 🎵**
