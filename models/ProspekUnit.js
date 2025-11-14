const mongoose = require('mongoose');

const prospekUnitSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    trim: true
  },
  telepon: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  unitYangDiminati: {
    type: String,
    required: true
  },
  sumber: {
    type: String,
    enum: ['website', 'whatsapp', 'telegram', 'instagram', 'lainnya'],
    default: 'website'
  },
  status: {
    type: String,
    enum: ['Baru', 'Diproses', 'Terjual', 'Batal'],
    default: 'Baru'
  },
  salesId: {
    type: String // ID sales yang mengambil prospek
  },
  catatan: String
}, {
  timestamps: true
});

module.exports = mongoose.model('ProspekUnit', prospekUnitSchema);