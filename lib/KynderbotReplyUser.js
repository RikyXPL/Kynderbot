exports.run = async (riky, jawab, kirim, chats) => {

    const axios = require("axios");
    const database = require("./database.json");

    if (jawab.includes("Ass") || jawab.includes("Assalamu'alaikum")) {
        riky.sendMessage(kirim, { text: database.teks.salam }, { quoted: chats });
    }

    if (jawab.includes("Tanggal") || jawab.includes("tanggal") || jawab.includes("Hari")) {
        axios.get("https://api.myquran.com/v2/cal/hijr/?adj=-1").then(res => {
            riky.sendMessage(kirim, { text:`*${res.data.data.date}*` }, { quoted: chats });
        });
    }
    
    if (jawab.includes("Quran") || jawab.includes("quran") || jawab.includes("Al-Quran")) {
        axios.get("https://api.myquran.com/v2/quran/ayat/acak").then(res => {
            const ayat = res.data.data.ayat.ayah;
            const surah = res.data.data.info.surat.nama.id;
            const arab = res.data.data.ayat.arab;
            const latin = res.data.data.ayat.latin;
            const terjemah = res.data.data.ayat.text;
            const audio = res.data.data.ayat.audio;
            riky.sendMessage(kirim, { text:`${arab}\n_${latin}_\n\n${terjemah}\n${audio}\n\n*Al-Quran (${surah} Ayat ${ayat})*` }, { quoted: chats });
        });
    }
    
    if (jawab.includes("Hadis") || jawab.includes("hadis") || jawab.includes("Al-Hadis")) {
        axios.get("https://api.myquran.com/v2/hadits/arbain/acak").then(res => {
            const judul = res.data.data.judul;
            const terjemah = res.data.data.indo;
            riky.sendMessage(kirim, { text:`${terjemah}\n\n*${judul}*` }, { quoted: chats });
        });
    }

    if (jawab.includes("Doa") || jawab.includes("doa") || jawab.includes("Al-Doa")) {
        axios.get("https://api.myquran.com/v2/doa/acak").then(res => {
            const arab = res.data.data.arab;
            const indo = res.data.data.indo;
            const judul = res.data.data.judul;
            riky.sendMessage(kirim, { text:`${arab}\n\n${indo}\n\n*${judul}*` }, { quoted: chats });
        });
    }

    if (jawab.includes("Asmaul") || jawab.includes("asmaul") || jawab.includes("Asmaul Husna") || jawab.includes("husna")) {
        axios.get("https://api.myquran.com/v2/husna/acak").then(res => {
            const arab = res.data.data.arab;
            const indo = res.data.data.indo;
            const latin = res.data.data.latin;
            riky.sendMessage(kirim, { text:`${arab}\n\n_${latin}_\n\n*${indo}*` }, { quoted: chats });
        });
    }

    if (jawab.includes("makasih") || jawab.includes("Terimakasihku") || jawab.includes("thank you") || jawab.includes("Thank you") || jawab.includes("thank you very much")) {
        riky.sendMessage(kirim, { text: database.teks.makasih }, { quoted: chats });
    }

    if (jawab.includes("sahur") || jawab.includes("Sahur") || jawab.includes("Sahurmu") || jawab.includes("Sahurku")) {
        riky.sendMessage(kirim, { text: database.teks.imsak }, { quoted: chats });
    }
}