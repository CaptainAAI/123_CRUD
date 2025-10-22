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




