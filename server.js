const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { parseFile } = require('music-metadata');

const app = express();
const PORT = process.env.PORT || 3000;
const MUSIC_DIR = path.join(__dirname, 'music');

// Pastikan direktori music ada
(async () => {
  try {
    await fs.mkdir(MUSIC_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating music directory:', err);
  }
})();

// Middleware
app.use(express.static(__dirname));
app.use('/music', express.static(MUSIC_DIR));
app.use('/skin', express.static(path.join(__dirname, 'skin')));

// Endpoint untuk mendapatkan playlist dengan metadata
app.get('/playlist', async (req, res) => {
  try {
    const files = await fs.readdir(MUSIC_DIR);
    const mp3Files = files.filter(file => file.toLowerCase().endsWith('.mp3'));
    
    const playlist = [];

    for (const file of mp3Files) {
      const filePath = path.join(MUSIC_DIR, file);
      let title = file.replace('.mp3', '');
      let artist = 'Unknown Artist';
      let album = 'Unknown Album';
      let duration = 0;

      try {
        // Baca metadata file MP3
        const metadata = await parseFile(filePath);
        
        if (metadata.common.title) {
          title = metadata.common.title;
        }
        if (metadata.common.artist) {
          artist = metadata.common.artist;
        }
        if (metadata.common.album) {
          album = metadata.common.album;
        }
        if (metadata.format.duration) {
          duration = Math.round(metadata.format.duration);
        }
      } catch (err) {
        console.warn(`Warning parsing metadata for ${file}:`, err.message);
      }

      playlist.push({
        title: title,
        artist: artist,
        album: album,
        duration: duration,
        url: `/music/${encodeURIComponent(file)}`,
        filename: file
      });
    }

    // Sort playlist berdasarkan nama file
    playlist.sort((a, b) => a.filename.localeCompare(b.filename));

    res.json(playlist);
  } catch (err) {
    console.error('Error reading playlist:', err);
    res.status(500).json({ error: 'Failed to read playlist', details: err.message });
  }
});

// Endpoint untuk server info
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Webamp Music Player',
    version: '1.0.0',
    musicDir: MUSIC_DIR
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════╗
║   Webamp Music Player Started       ║
╚════════════════════════════════════╝

✓ Server running on: http://0.0.0.0:${PORT}
✓ Music folder: ${MUSIC_DIR}
✓ Access from: http://localhost:${PORT}

📝 Setup:
  1. Add .mp3 files to the music/ folder
  2. Refresh the browser to update playlist
  3. Metadata will be read automatically

`);
});
