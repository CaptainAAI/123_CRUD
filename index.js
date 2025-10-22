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
    console.log(' Error MySQL: ' + err.stack);
    return;
  }
  console.log(' Koneksi MySQL berhasil');
});

app.get('/api/mahasiswa', (req, res) => {
  const query = 'SELECT * FROM biodata';
  db.query(query, (err, results) => {
    if (err) {
      console.error(' Error query GET:', err.stack);
      res.status(500).json({ error: 'Gagal mengambil data' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/mahasiswa', (req, res) => {  
    const { nama, alamat, agama } = req.body;  

    if (!nama || !alamat || !agama) {  
        return res.status(400).send('Nama, Alamat, Agama are required');  
    }  

    const sql = 'INSERT INTO biodata (nama, alamat, agama) VALUES (?, ?, ?)';  
    db.query(sql, [nama, alamat, agama], (err, result) => {  
        if (err) {  
            console.error('Error executing query:' + err.stack);  
            return res.status(500).send('Error adding mahasiswa');  
        }  
        res.status(201).send(`Mahasiswa added with ID: ${result.insertId}`);  
    });  
});


app.put('/api/mahasiswa/:id', (req, res) => {
  const { id } = req.params;
  const { nama, alamat, agama, nim, kelas } = req.body;

  const query = 'UPDATE biodata SET nama = ?, alamat = ?, agama = ?, nim = ?, kelas = ? WHERE id = ?';
  db.query(query, [nama, alamat, agama, nim || null, kelas || null, id], (err, result) => {
    if (err) {
      console.error(' Error query PUT:', err.stack);
      return res.status(500).json({ error: 'Gagal memperbarui data' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }
    res.json({ message: ' Data berhasil diperbarui' });
  });
});


app.delete('/api/mahasiswa/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM biodata WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(' Error query DELETE:', err.stack);
      return res.status(500).json({ error: 'Gagal menghapus data' });
    }
    res.json({ message: ' Data berhasil dihapus' });
  });
});



