const { default: Kynderbot, Browsers, DisconnectReason, useMultiFileAuthState, getContentType } = require("@whiskeysockets/baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");

const Sayangku = process.argv.includes("--Kynders");
const Starting = process.argv.includes("--Starting");

async function KynderbotWhatsapp() {
    if (Starting) {
        console.log("Starting...");
    }
    const auth = await useMultiFileAuthState("./lib/Kynders");
    const riky = await Kynderbot({
        printQRInTerminal: !Sayangku,
        browser: Sayangku ? Browsers.ubuntu("RikyXD") : Browsers.macOS("Kynderbot"),
        auth: auth.state,
        logger: pino({ level: "silent" })
    });

    riky.ev.on("creds.update", auth.saveCreds);
    riky.ev.on("connection.update", (update) => {
        if (update.connection === "close") {
            let reconnect = new Boom(update.lastDisconnect.error).output.statusCode !== DisconnectReason.loggedOut;
            console.log("Koneksi terputus pada ", update.lastDisconnect.error, "Menghubungkan ulang ", reconnect);
            if (reconnect) {
                KynderbotWhatsapp();
            }
        } else if (update.connection === "open") {
            console.log("Tersambung ke ", riky.user.id.split(":")[0]);
        }
    });

    riky.ev.on("messages.upsert", message => {
        const chats = message.messages[0];
        const tanya = getContentType(chats.message);
        const jawab = tanya === "conversation" ? 
          chats.message.conversation : tanya === "extendedTextMessage" ?
          chats.message.extendedTextMessage.text : tanya === "imageMessage" ?
          chats.message.imageMessage.caption : tanya === "videoMessage" ?
          chats.message.videoMessage.caption : "";
        const kirim = chats.key.remoteJid;
        const orang = chats ? chats.pushName : riky.user.id.split(":")[0];

        async function balas(tulisan) {
            await riky.sendMessage(kirim, { text: tulisan }, { quoted: chats });
        }

        try {
            let sender = chats.key.remoteJid;
            if (kirim.includes("@g.us")) sender = chats.key.participant;
            let teks = `~ (+${sender.split("@s.whatsapp.net")[0]}) ${orang} > ${jawab}`;
            console.log(JSON.stringify(teks, undefined, 2));
            //console.log(chats);
        
            if (!chats.key.fromMe) {
                require("./lib/KynderbotReplyUser.js").run(riky, jawab, kirim, chats);
                require("./lib/KynderbotReplyGrub.js").run(riky, jawab, kirim, chats);
            }

        } catch (error) {
            balas(`*Ada yang salah nih*\n${error}`);
            setTimeout(() => process.exit(), 2000);
        }
    });
}

KynderbotWhatsapp();