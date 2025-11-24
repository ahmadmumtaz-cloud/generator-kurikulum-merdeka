import { SetupData } from './types';

export const JENJANG_OPTIONS = ['TK/PAUD', 'SD/MI', 'SMP/MTs', 'SMA/MA', 'SMK'];

export const KELAS_OPTIONS: Record<string, string[]> = {
    'TK/PAUD': ['Kelompok Bermain', 'Kelompok A (4-5 Tahun)', 'Kelompok B (5-6 Tahun)'],
    'SD/MI': ['1', '2', '3', '4', '5', '6'],
    'SMP/MTs': ['7', '8', '9'],
    'SMA/MA': ['10', '11', '12'],
    'SMK': ['10', '11', '12']
};

export const MAPEL_OPTIONS: Record<string, string[]> = {
    'TK/PAUD': [
        'Nilai Agama dan Budi Pekerti',
        'Jati Diri',
        'Literasi dan STEAM',
        'Tema: Diriku',
        'Tema: Keluargaku',
        'Tema: Lingkungan',
        'Tema: Binatang',
        'Tema: Tanaman',
        'Tema: Kendaraan',
        'Tema: Alam Semesta',
        'Tema: Negaraku',
        'Projek Penguatan Profil Pelajar Pancasila'
    ],
    'SD/MI': [
        'Pendidikan Agama dan Budi Pekerti',
        'Pendidikan Pancasila',
        'Bahasa Indonesia',
        'Matematika',
        'IPAS (IPA & IPS)',
        'Bahasa Inggris',
        'Seni dan Budaya',
        'PJOK',
        'Prakarya'
    ],
    'SMP/MTs': [
        'Pendidikan Agama dan Budi Pekerti',
        'Pendidikan Pancasila',
        'Bahasa Indonesia',
        'Matematika',
        'IPA',
        'IPS',
        'Bahasa Inggris',
        'Seni Budaya',
        'PJOK',
        'Informatika',
        'Prakarya'
    ],
    'SMA/MA': [
        'Pendidikan Agama dan Budi Pekerti',
        'Pendidikan Pancasila',
        'Bahasa Indonesia',
        'Matematika',
        'Bahasa Inggris',
        'Fisika',
        'Kimia',
        'Biologi',
        'Ekonomi',
        'Sosiologi',
        'Sejarah',
        'Geografi',
        'Seni Budaya',
        'PJOK',
        'Informatika'
    ],
    'SMK': [
        'Pendidikan Agama dan Budi Pekerti',
        'Pendidikan Pancasila',
        'Bahasa Indonesia',
        'Matematika',
        'Bahasa Inggris',
        'Sejarah',
        'Seni Budaya',
        'PJOK',
        'Informatika',
        'Projek Kreatif dan Kewirausahaan',
        'Dasar-dasar Kejuruan',
        'Konsentrasi Keahlian'
    ]
};

export const MATERI_SAMPLES: Record<string, string[]> = {
    'Matematika': ['Bilangan Bulat', 'Pecahan', 'Geometri', 'Aljabar', 'Statistika', 'Trigonometri', 'Kalkulus Dasar'],
    'Bahasa Indonesia': ['Teks Narasi', 'Teks Deskripsi', 'Teks Argumentasi', 'Puisi', 'Drama', 'Karya Ilmiah'],
    'Pendidikan Pancasila': ['Pancasila sebagai Dasar Negara', 'UUD 1945', 'Bhinneka Tunggal Ika', 'NKRI', 'Hak dan Kewajiban'],
    'Pendidikan Agama dan Budi Pekerti': ['Akhlak Mulia', 'Sejarah Peradaban', 'Kitab Suci', 'Fiqih/Hukum Agama'],
    'IPAS (IPA & IPS)': ['Makhluk Hidup dan Lingkungannya', 'Wujud Zat dan Perubahannya', 'Sejarah Daerahku', 'Kegiatan Ekonomi'],
    'IPA': ['Sistem Organ', 'Listrik Dinamis', 'Pewarisan Sifat', 'Bioteknologi'],
    'IPS': ['Interaksi Sosial', 'Lembaga Sosial', 'Perdagangan Internasional', 'Perubahan Sosial Budaya'],
    'Fisika': ['Besaran dan Satuan', 'Kinematika', 'Dinamika', 'Fluida', 'Termodinamika'],
    'Kimia': ['Struktur Atom', 'Ikatan Kimia', 'Stoikiometri', 'Laju Reaksi'],
    'Biologi': ['Sel', 'Jaringan', 'Metabolisme', 'Genetika', 'Evolusi'],
    'Bahasa Inggris': ['Descriptive Text', 'Recount Text', 'Narrative Text', 'Procedure Text', 'Analytical Exposition'],
    'Tema: Diriku': ['Identitas Diri', 'Anggota Tubuh', 'Kesukaanku', 'Panca Indra'],
    'Tema: Alam Semesta': ['Benda Langit', 'Gejala Alam', 'Siang dan Malam'],
    'Tema: Binatang': ['Binatang Peliharaan', 'Binatang Ternak', 'Binatang Buas', 'Serangga']
};

export const DOCUMENT_TYPES = [
    { id: 'modul', name: 'Modul Ajar', icon: 'BookOpen', color: '#6366F1' },
    { id: 'kktp', name: 'KKTP', icon: 'Star', color: '#F59E0B' },
    { id: 'atp', name: 'ATP', icon: 'Zap', color: '#10B981' },
    { id: 'prota', name: 'Program Tahunan', icon: 'FileText', color: '#8B5CF6' },
    { id: 'promes', name: 'Program Semester', icon: 'FileText', color: '#EC4899' }
];

export const ADMINISTRASI_TYPES = [
    { id: 'jadwal', name: 'Jadwal Mengajar', icon: 'Calendar', color: '#3B82F6', desc: 'Jadwal mengajar per semester' },
    { id: 'absensi', name: 'Daftar Hadir', icon: 'Users', color: '#10B981', desc: 'Rekapitulasi kehadiran siswa' },
    { id: 'nilai', name: 'Daftar Nilai', icon: 'Star', color: '#F59E0B', desc: 'Leger nilai siswa' },
    { id: 'jurnal', name: 'Jurnal Mengajar', icon: 'Book', color: '#8B5CF6', desc: 'Catatan harian pembelajaran' },
    { id: 'analisis', name: 'Analisis Hasil', icon: 'CheckSquare', color: '#EC4899', desc: 'Analisis penilaian' },
    { id: 'remedial', name: 'Program Remedial', icon: 'Edit', color: '#EF4444', desc: 'Program perbaikan nilai' }
];

// NOTE: Content generators are now handled by AI in gemini.ts, 
// but these function signatures are kept for type compatibility if needed locally.
export const GENERATE_DOC_CONTENT = (type: string, data: SetupData): string => {
    return "Konten akan digenerate oleh AI...";
};

export const GENERATE_ADMIN_CONTENT = (typeId: string, data: SetupData): string => {
    return "Konten akan digenerate oleh AI...";
};