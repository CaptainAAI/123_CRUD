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


