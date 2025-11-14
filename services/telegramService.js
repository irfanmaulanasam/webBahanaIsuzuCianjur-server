// services/telegramService.js

const TelegramBot = require('node-telegram-bot-api');

// Ambil token dan chat ID dari .env
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

// Non-polling (hanya untuk mengirim pesan)
const bot = new TelegramBot(token, { polling: false }); 

function kirimNotifFollowUp(prospek) {
    const pesan = `🚨 **NEW LEAD (PROSPEK UNIT)** 🚨
ID: ${prospek._id}
Nama: ${prospek.nama}
No. HP: ${prospek.nomorHp}
Minat: ${prospek.tipeKendaraan}
Outlet: ${prospek.areaOutlet}
    
Silakan klik tombol di bawah untuk mengambil prospek ini:`;

    const options = {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ 
                    text: "🔥 AMBIL FOLLOW UP", 
                    callback_data: `ambil_${prospek._id}` 
                }]
            ]
        }
    };
    
    // Kirim pesan ke Grup Sales
    bot.sendMessage(chatId, pesan, options)
        .then(() => console.log('Notifikasi Telegram sukses terkirim.'))
        .catch(err => console.error('Gagal mengirim notif:', err.message));
}

module.exports = { kirimNotifFollowUp, bot, chatId }; // Ekspor bot untuk event handling