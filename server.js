require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
const port = process.env.port || 3000;

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log('✅ MongoDB Berhasil Terhubung!'))
    .catch(err => console.error('❌ Koneksi MongoDB Gagal:', err));

app.get('/', (req, res) => {
  res.send('Dealer Api Berjalan bos!');
});

const prospekRoutes = require('./routes/prospekRoutes');

app.use('/api/prospek', prospekRoutes);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});