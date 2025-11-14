// routes/prospekRoutes.js

const express = require('express');
const ProspekUnit = require('../models/ProspekUnit');
const { kirimNotifFollowUp, bot, chatId } = require('../services/telegramService');

const router = express.Router();

// --- 1. CREATE (POST) - Menerima Formulir Order Unit ---
router.post('/unit', async (req, res) => {
    try {
        const prospek = new ProspekUnit(req.body);
        await prospek.save();
        
        // **TRIGGER NOTIFIKASI**
        kirimNotifFollowUp(prospek);

        res.status(201).json({ message: 'Prospek unit berhasil disimpan dan notifikasi terkirim.' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- 2. READ (GET) - Daftar Prospek ---
router.get('/unit', async (req, res) => {
    try {
        const prospeks = await ProspekUnit.find().sort({ createdAt: -1 });
        res.status(200).json(prospeks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 3. UPDATE (PATCH) - Sales Mengambil Prospek (dari callback Telegram) ---
router.patch('/unit/:id/ambil', async (req, res) => {
    try {
        const { salesId } = req.body; // Sales ID harus dikirim dari frontend/logic bot
        const prospek = await ProspekUnit.findByIdAndUpdate(
            req.params.id, 
            { $set: { status: 'Diproses', salesId: salesId } },
            { new: true }
        );
        
        if (!prospek) return res.status(404).json({ message: 'Prospek tidak ditemukan.' });
        
        res.status(200).json(prospek);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- 4. Handle Callback dari Tombol Telegram ---
// Ini adalah logika penting yang menghubungkan Telegram ke API Express Anda
bot.on('callback_query', async (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data; 
    const salesId = callbackQuery.from.id; // ID pengguna Telegram yang mengklik

    if (data.startsWith('ambil_')) {
        const prospekId = data.split('_')[1];
        
        try {
            // Panggil API PATCH untuk mengunci prospek (Asumsikan Anda memiliki endpoint ini)
            const updatedProspek = await ProspekUnit.findByIdAndUpdate(prospekId, 
                { $set: { status: 'Diproses', salesId: salesId } },
                { new: true }
            );

            if (updatedProspek.status === 'Diproses' && updatedProspek.salesId === salesId.toString()) {
                 // Kirim konfirmasi ke grup
                 bot.sendMessage(chatId, `✅ **${callbackQuery.from.first_name}** berhasil mengambil prospek ID: ${prospekId}.`);
                 
                 // Hapus tombol dari pesan asli agar tidak diklik lagi
                 bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
                    chat_id: message.chat.id,
                    message_id: message.message_id
                 });

            } else {
                bot.answerCallbackQuery(callbackQuery.id, 'Prospek sudah diambil oleh sales lain.');
            }

        } catch (error) {
            console.error('Error saat handle callback:', error);
            bot.answerCallbackQuery(callbackQuery.id, 'Terjadi kesalahan saat memproses permintaan.');
        }
    }
});

module.exports = router;