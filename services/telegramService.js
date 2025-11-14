const TelegramBot = require('node-telegram-bot-api');

// Ganti dengan token bot Telegram Anda
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID; // ID grup/chat untuk notifikasi

const bot = new TelegramBot(token, { polling: true });

// Fungsi untuk kirim notifikasi ke Telegram
function kirimNotifFollowUp(prospek) {
  const message = `
🆕 **PROSPEK BARU**

📝 **Nama:** ${prospek.nama}
📞 **Telepon:** ${prospek.telepon}
📧 **Email:** ${prospek.email || 'Tidak ada'}
🚗 **Unit:** ${prospek.unitYangDiminati}
🔍 **Sumber:** ${prospek.sumber}

⏰ **Waktu:** ${prospek.createdAt.toLocaleString('id-ID')}
  `;

  const keyboard = {
    inline_keyboard: [[
      {
        text: '✅ Ambil Prospek',
        callback_data: `ambil_${prospek._id}`
      }
    ]]
  };

  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
}

module.exports = {
  kirimNotifFollowUp,
  bot,
  chatId
};