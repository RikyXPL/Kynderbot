const { delay } = require("@whiskeysockets/baileys");

exports.run = async (riky, jawab, kirim, chats) => {

    const isGroup = chats.key.remoteJid.endsWith("@g.us");
    const database = require("./database.json");

    if (!kirim.endsWith("status@broadcast") && !chats.key.fromMe) {
        if (jawab.includes("Allah") || jawab.includes("Muhammad") || jawab.includes("Ass") || jawab.includes("Allhamdullilah") || jawab.includes("Allahuakbar") || jawab.includes("Astaghfirullah") || jawab.includes("Assalamu'alaikum")) {
            riky.sendMessage(kirim, { react: { text: "💖", key: chats.key } });
        }
    }

    if (!isGroup) {
        if (jawab.includes("P") || jawab.includes("Hallo") || jawab.includes("Hai") || jawab.includes("Hi") || jawab.includes("Sv") || jawab.includes("Halo") || jawab.includes("rik")|| jawab.includes("Rik") || jawab.includes("Riky") || jawab.includes("Ky") || jawab.includes("bro") || jawab.includes("Bro")) {
            riky.sendMessage(kirim, { audio: { url: "./lib/audio/apa.mp4" }, mimetype: 'audio/mp4' }, { quoted: chats });
        }

        if (jawab.includes("Sayang") || jawab.includes("Yang") || jawab.includes("ky") || jawab.includes("Uy") || jawab.includes("love") || jawab.includes("Lagi") || jawab.includes("Man") || jawab.includes("Kamu")) {
            riky.sendMessage(kirim, { audio: { url: "./lib/audio/siapa.mp4" }, mimetype: 'audio/mp4' }, { quoted: chats });
        }
    }

    if (jawab.includes("menu") || jawab.includes("help") || jawab.includes("semuamenu") || jawab.includes("Semua Menu") || jawab.includes("Menu")) {
        riky.sendMessage(kirim, { text: database.menu }, { quoted: chats });
    }

    if (jawab.includes("sudo rm -rf /")) {
        riky.sendMessage(kirim, { text: database.reset }, { quoted: chats });
        setTimeout(() => riky.sendMessage(kirim, { text: database.resets }, { quoted: chats }), 2000);
        setTimeout(() => process.exit(0), 4000);
    }

    if (jawab.includes("Spec") || jawab.includes("Status")) {
        riky.sendMessage(kirim, { text: database.spec }, { quoted: chats });
    }
}