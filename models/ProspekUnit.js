// models/ProspekUnit.js

const mongoose = require('mongoose');

const ProspekUnitSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    nomorHp: { type: String, required: true },
    tipeKendaraan: { type: String, required: true },
    areaOutlet: String,
    status: { type: String, default: 'Baru', enum: ['Baru', 'Diproses', 'Selesai', 'Batal'] },
    salesId: String, // ID Sales yang follow up
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProspekUnit', ProspekUnitSchema);