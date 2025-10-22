const express = require('express');
let mysql = require('mysql');
const app = express();
const PORT = 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '',
  database: 'mahasiswa'
});

db.connect((err) => {
  if (err) {
    console.log('❌ Error MySQL: ' + err.stack);
    return;
  }
  console.log('✅ Koneksi MySQL berhasil');
});

app.get('/api/mahasiswa', (req, res) => {
  const query = 'SELECT * FROM biodata';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error query GET:', err.stack);
      res.status(500).json({ error: 'Gagal mengambil data' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/mahasiswa', (req, res) => {
  const { nama, alamat, agama, nim, kelas } = req.body;

  // 🔍 Validasi input wajib
  if (!nama || !alamat || !agama) {
    return res.status(400).json({
      error: '❗ Kolom nama, alamat, dan agama wajib diisi!'
    });
  }

  const query = 'INSERT INTO biodata (nama, alamat, agama, nim, kelas) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nama, alamat, agama, nim || null, kelas || null], (err, result) => {
    if (err) {
      console.error('❌ Error query POST:', err.stack);
      return res.status(500).json({ error: 'Gagal menambah data' });
    }
    res.status(201).json({ 
      message: '✅ Data berhasil ditambahkan', 
      id: result.insertId 
    });
  });
});

app.put('/api/mahasiswa/:id', (req, res) => {
  const { id } = req.params;
  const { nama, alamat, agama, nim, kelas } = req.body;

  // Validasi kolom wajib
  if (!nama || !alamat || !agama) {
    return res.status(400).json({
      error: '❗ Kolom nama, alamat, dan agama wajib diisi!'
    });
  }

  const query = 'UPDATE biodata SET nama = ?, alamat = ?, agama = ?, nim = ?, kelas = ? WHERE id = ?';
  db.query(query, [nama, alamat, agama, nim || null, kelas || null, id], (err, result) => {
    if (err) {
      console.error('❌ Error query PUT:', err.stack);
      return res.status(500).json({ error: 'Gagal memperbarui data' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }
    res.json({ message: '✅ Data berhasil diperbarui' });
  });
});


app.delete('/api/mahasiswa/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM biodata WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('❌ Error query DELETE:', err.stack);
      return res.status(500).json({ error: 'Gagal menghapus data' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }
    res.json({ message: '🗑️ Data berhasil dihapus' });
  });
});



