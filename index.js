const { default: Kynderbot, Browsers, DisconnectReason, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const axios = require("axios");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const database = require("./lib/database.json");

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
        let jawab;
        if (chats.message) {
            jawab = chats.message ? chats.message.conversation : chats.message.extendedTextMessage.text;
        }
        const kirim = chats.key.remoteJid;
        const orang = chats ? chats.pushName : riky.user.id.split(":")[0];
        const isGroup = chats.key.remoteJid.endsWith("@g.us");

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
                if (jawab.includes("Ass")) {
                    balas("Wallaikumsalam warahmatullahi wabarakatuh");
                }
                if (jawab.includes("Tanggal")) {
                    axios.get("https://api.myquran.com/v2/cal/hijr/?adj=-1").then(res => {
                        balas(`*${res.data.data.date}*`);
                    });
                }
                if (jawab.includes("Quran")) {
                    axios.get("https://api.myquran.com/v2/quran/ayat/acak").then(res => {
                        const ayat = res.data.data.ayat.ayah;
                        const surah = res.data.data.info.surat.nama.id;
                        const arab = res.data.data.ayat.arab;
                        const latin = res.data.data.ayat.latin;
                        const terjemah = res.data.data.ayat.text;
                        const audio = res.data.data.ayat.audio;
                        balas(`${arab}\n_${latin}_\n\n${terjemah}\n${audio}\n\n*Al-Quran (${surah} Ayat ${ayat})*`);
                    });
                }
                if (jawab.includes("Hadis")) {
                    axios.get("https://api.myquran.com/v2/hadits/arbain/acak").then(res => {
                        const judul = res.data.data.judul;
                        const terjemah = res.data.data.indo;
                        balas(`${terjemah}\n\n*${judul}*`);
                    });
                }
                if (jawab.includes("Doa")) {
                    axios.get("https://api.myquran.com/v2/doa/acak").then(res => {
                        const arab = res.data.data.arab;
                        const indo = res.data.data.indo;
                        const judul = res.data.data.judul;
                        balas(`${arab}\n\n${indo}\n\n*${judul}*`);
                    });
                }
                if (jawab.includes("Asmaul")) {
                    axios.get("https://api.myquran.com/v2/husna/acak").then(res => {
                        const arab = res.data.data.arab;
                        const indo = res.data.data.indo;
                        const latin = res.data.data.latin;
                        balas(`${arab}\n\n_${latin}_\n\n*${indo}*`);
                    });
                }

                if (jawab.includes("makasih")) {
                    balas("Iya sama sama :)");
                }
                if (jawab.includes("sahur")) {
                    balas("_udah imsak loh_");
                }
            }

            const reaksi = {
                react: {
                    text: "💖",
                    key: chats.key
                }
            }
            if (!kirim.endsWith("status@broadcast") && !chats.key.fromMe) {
                if (jawab.includes("Allah") || jawab.includes("Muhammad") || jawab.includes("Ass") || jawab.includes("Allhamdullilah") || jawab.includes("Allahuakbar")) {
                    riky.sendMessage(kirim, reaksi);
                }
            }

            if (!isGroup) {
                if (jawab.includes("P") || jawab.includes("Hallo") || jawab.includes("Hai")) {
                    riky.sendMessage(kirim, { audio: { url: "./lib/audio/apa.mp4" }, mimetype: 'audio/mp4' }, { quoted: chats });
                }

                if (jawab.includes("Sayang") || jawab.includes("Yang") || jawab.includes("ky") || jawab.includes("Uy") || jawab.includes("love") || jawab.includes("Lagi") || jawab.includes("Man")) {
                    riky.sendMessage(kirim, { audio: { url: "./lib/audio/siapa.mp4" }, mimetype: 'audio/mp4' }, { quoted: chats });
                }
            }

            if (jawab.includes("menu") || jawab.includes("help") || jawab.includes("semuamenu")) {
                balas("Maaf bot baru di uji coba, menu yang tersedia saat ini:\n\n1.Quran\n2.Hadis\n3.Doa\n4.Tanggal\n5.Asmaul\n\n_Sekian terimakasih_");
            }

        } catch (error) {
            balas(`*Ada yang salah nih*\n${error}`);
        }
    });
}

KynderbotWhatsapp();