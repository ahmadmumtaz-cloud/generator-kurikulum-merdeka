import { GoogleGenAI, Type } from "@google/genai";
import { SetupData, QuestionItem, QuestionConfig } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const TEXT_MODEL = 'gemini-2.5-flash';

// Helper: Determine Phase based on Class/Level
const determinePhase = (jenjang: string, kelas: string): string => {
    // Logic Fase Kurikulum Merdeka
    if (jenjang === 'TK/PAUD') return 'Fondasi';
    
    // Convert kelas string to number for comparison if possible
    const kelasNum = parseInt(kelas);

    if (jenjang === 'SD/MI') {
        if (kelasNum <= 2) return 'A';
        if (kelasNum <= 4) return 'B';
        return 'C';
    }
    
    if (jenjang === 'SMP/MTs') return 'D';
    
    if (jenjang === 'SMA/MA' || jenjang === 'SMK') {
        if (kelasNum === 10) return 'E';
        return 'F';
    }

    return 'Umum';
};

export const getCapaianPembelajaran = async (data: SetupData): Promise<string> => {
    const fase = determinePhase(data.jenjang, data.kelas);
    
    const prompt = `
        Tuliskan seluruh **Capaian Pembelajaran (CP) Kurikulum Merdeka** secara lengkap pada jenjang/sekolah ${data.jenjang} 
        untuk kelas ${data.kelas} (fase ${fase}), mata pelajaran ${data.mapel}.

        Struktur output harus berbentuk **markdown dengan heading per sub-bab (kelas, elemen, atau capaian kompetensi)**. 
        Jabarkan CP secara detil dan terstruktur, mulai dari rasional mapel, tujuan, elemen, hingga indikator/uraian capaian di setiap kelas serta fase yang berlaku. Tampilkan jika tersedia:
        - Rasional atau pengantar mapel/fase
        - Daftar elemen kompetensi (misal: literasi, numerasi, adab, pemrograman, dsb)
        - Deskripsi CP per elemen dan tahun/kelas
        - Indikator kemampuan minimum sesuai dokumen resmi Kurikulum Merdeka

        Gunakan format seperti di bawah ini:

        # Capaian Pembelajaran (CP) Kurikulum Merdeka
        ## ${data.jenjang} — ${data.mapel} — Kelas ${data.kelas} (Fase ${fase})

        ### Rasional Mata Pelajaran
        [Uraian ringkas rasional pentingnya mempelajari mapel ini di fase & jenjang tersebut.]

        ### Tujuan Umum
        - [Tujuan umum capaian pembelajaran pada kelas/fase/mapel ini]

        ### Elemen/Komponen Dasar
        - [Daftar elemen/kompetensi inti]
        - ...

        ### Capaian Pembelajaran Per Elemen Per Kelas
        #### Elemen: {Elemen 1}
        - Kelas {Kelas}/{Fase}:
            - [Deskripsi/jabaran CP detil per fase/kelas]
        
        #### Elemen: {Elemen berikutnya}
        - [dst...]

        ---

        Tampilkan dalam **format markdown yang rapi dan berskala jenjang**.
        Selalu adaptasi istilah dan kompetensi sesuai dokumen resmi Kemendikbud/Kemenag.
    `;

    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt
        });
        return response.text || "Gagal mengambil data CP.";
    } catch (error) {
        console.error("AI CP Generation Error:", error);
        throw new Error("Gagal mengambil CP.");
    }
};

export const generateDocumentContent = async (docType: string, docName: string, data: SetupData): Promise<string> => {
    const fase = determinePhase(data.jenjang, data.kelas);
    const prompt = `
        Bertindaklah sebagai ahli kurikulum profesional untuk Kurikulum Merdeka di Indonesia.
        Buatkan dokumen lengkap "${docName}" untuk:
        - Jenjang: ${data.jenjang}
        - Kelas: ${data.kelas} (Fase ${fase})
        - Mata Pelajaran: ${data.mapel}
        - Materi Pokok: ${data.materi}

        Instruksi Penting:
        1. **Output HARUS dalam format HTML murni** (gunakan tag <h1>, <h2>, <p>, <ul>, <li>, <strong>, <table>, <tr>, <td>, dll).
        2. **JANGAN** gunakan Markdown (seperti ** atau ##).
        3. **JANGAN** sertakan block code \`\`\`html. Langsung output raw HTML.
        4. Gunakan CSS inline sederhana jika perlu untuk tabel (misal: border="1" style="border-collapse: collapse; width: 100%;").
        5. Mengikuti format resmi Kurikulum Merdeka terbaru (termasuk Profil Pelajar Pancasila).
        6. Bahasa Indonesia formal dan pedagogis.
        7. Lengkap dengan detail (Capaian Pembelajaran Fase ${fase}, Tujuan Pembelajaran, Langkah Kegiatan, Asesmen).
    `;

    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt
        });
        return response.text || "Gagal menghasilkan konten. Silakan coba lagi.";
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Gagal menghubungi layanan AI.");
    }
};

export const generateBulkQuestions = async (data: SetupData, config: QuestionConfig) => {
    const totalQuestions = config.pgRegular + config.pgTka + config.essayRegular + config.essayTka;
    const fase = determinePhase(data.jenjang, data.kelas);
    
    if (totalQuestions === 0) throw new Error("Jumlah soal tidak boleh kosong");

    const prompt = `
        Buatkan paket soal latihan (${totalQuestions} butir) untuk siswa:
        - Jenjang: ${data.jenjang}
        - Kelas: ${data.kelas} (Fase ${fase})
        - Mapel: ${data.mapel}
        - Materi: ${data.materi}

        Komposisi Soal:
        1. Pilihan Ganda (Reguler): ${config.pgRegular} soal. (Pemahaman konsep dasar).
        2. Pilihan Ganda TKA (Tes Kemampuan Akademik): ${config.pgTka} soal. (HOTS, Analisis, Studi Kasus, Penalaran Mendalam).
        3. Uraian/Essay (Reguler): ${config.essayRegular} soal.
        4. Uraian/Essay TKA (Tes Kemampuan Akademik): ${config.essayTka} soal. (HOTS, Problem Solving).

        Output HARUS berupa Array JSON valid dengan skema berikut:
        [
          {
            "type": "string (Pilihan Ganda | Essay)",
            "category": "string (Reguler | TKA)",
            "difficulty": "string (Mudah | Sedang | Sulit)",
            "question": "string (Teks pertanyaan)",
            "options": ["string (Opsi A)", "string (Opsi B)", "string (Opsi C)", "string (Opsi D)"] (Wajib ada isi jika Pilihan Ganda, Array kosong [] jika Essay),
            "correctAnswer": number (index 0-3 untuk jawaban benar jika PG, null jika Essay),
            "answer": "string (Kunci jawaban lengkap / Pembahasan)"
          }
        ]
        
        Pastikan soal TKA benar-benar menguji kemampuan berpikir tingkat tinggi (HOTS) sesuai Fase ${fase}.
    `;

    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING },
                            category: { type: Type.STRING },
                            difficulty: { type: Type.STRING },
                            question: { type: Type.STRING },
                            options: { 
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            correctAnswer: { type: Type.NUMBER, nullable: true },
                            answer: { type: Type.STRING }
                        },
                        required: ["type", "category", "difficulty", "question", "options", "answer"]
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("Empty response from AI");
        
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Question Error:", error);
        throw error;
    }
};

export const generateAdminContent = async (adminType: string, adminName: string, data: SetupData): Promise<string> => {
    const fase = determinePhase(data.jenjang, data.kelas);
    const prompt = `
        Buatkan dokumen administrasi guru "${adminName}" yang realistis dan siap pakai.
        Konteks:
        - Guru Mapel: ${data.mapel}
        - Kelas: ${data.kelas} (${data.jenjang} - Fase ${fase})
        - Materi Saat Ini: ${data.materi}
        - Waktu: Semester berjalan (Tahun 2024/2025)

        Instruksi:
        1. **Output HARUS dalam format HTML murni** (gunakan <table>, <tr>, <td>, <th>, <h3>, <p>, dll).
        2. **Gunakan Tabel HTML** dengan border="1" untuk data seperti Absensi, Nilai, atau Jadwal agar rapi di Microsoft Word.
        3. Buat data dummy yang terlihat nyata.
        4. Berikan saran tindak lanjut atau catatan guru.
        5. **JANGAN** gunakan Markdown.
        6. **JANGAN** sertakan block code \`\`\`html.
    `;

    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt
        });
        return response.text || "Gagal menghasilkan dokumen administrasi.";
    } catch (error) {
        console.error("AI Admin Generation Error:", error);
        throw new Error("Gagal membuat dokumen administrasi.");
    }
};

export const generateExamDocument = async (data: SetupData, questions: QuestionItem[]): Promise<string> => {
    // Prepare question context string
    const questionsContext = questions.map((q, i) => 
        `No ${i+1}. [${q.type} - ${q.category}] ${q.question} \nOpsi: ${q.options.join(', ')} \nKunci: ${q.answer}`
    ).join('\n\n');

    const prompt = `
        Bertindaklah sebagai pembuat soal profesional. Saya memiliki daftar pertanyaan berikut:
        ${questionsContext}

        Buatkan dokumen "Paket Evaluasi Lengkap" dalam format HTML murni yang rapi untuk di-export ke Word.
        Dokumen harus mencakup bagian-bagian berikut secara berurutan (gunakan page break antar bagian jika memungkinkan):

        1. **RINGKASAN MATERI**: Buatkan ringkasan singkat padat tentang materi "${data.materi}" (${data.mapel} Kelas ${data.kelas}) sebagai bahan belajar siswa sebelum ujian.
        
        2. **KISI-KISI SOAL**: Tabel berisi No, Kompetensi Dasar (karang yang relevan dengan Kurikulum Merdeka), Materi, Indikator Soal, Kategori (Reguler/TKA), Bentuk Soal, dan No Soal.

        3. **NASKAH SOAL**: Tampilkan soal-soal di atas dalam format siap cetak untuk siswa. (Jangan sertakan kunci jawaban di bagian ini). Berikan header kop sekolah dummy. Pisahkan bagian Pilihan Ganda dan Uraian.

        4. **KUNCI JAWABAN & PEMBAHASAN**: Daftar kunci jawaban lengkap dengan pembahasan detail untuk setiap nomor.

        5. **ANALISIS SOAL KUALITATIF**: Tabel analisis butir soal (Materi, Konstruksi, Bahasa) yang menyatakan soal layak digunakan.

        6. **RUBRIK PENILAIAN**: Pedoman penskoran (skor benar/salah untuk PG, rubrik penilaian untuk Essay).

        **Instruksi Teknis:**
        - Output HANYA HTML raw. Tanpa markdown \`\`\`.
        - Gunakan <style> untuk mengatur font Times New Roman, border tabel (collapse), dan page-break.
        - Gunakan tabel HTML dengan border="1" agar terlihat jelas di Word.
        - Pastikan konten relevan dengan materi "${data.materi}".
    `;

    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt
        });
        return response.text || "Gagal membuat paket soal.";
    } catch (error) {
        console.error("AI Exam Package Error:", error);
        throw new Error("Gagal membuat paket soal lengkap.");
    }
};