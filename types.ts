export interface SetupData {
    jenjang: string;
    kelas: string;
    mapel: string;
    materi: string;
}

export interface DocumentItem {
    id: string;
    name: string;
    iconName: string; // Mapped to Lucide icon name
    color: string;
    jenjang: string;
    kelas: string;
    mapel: string;
    materi: string;
    content: string;
}

export interface QuestionItem {
    id: string;
    type: string; // Pilihan Ganda | Essay
    category: string; // Reguler | TKA
    difficulty: string;
    mapel: string;
    kelas: string;
    question: string;
    options: string[];
    correctAnswer: number | null;
    answer: string | null;
}

export interface QuestionConfig {
    pgRegular: number;
    pgTka: number;
    essayRegular: number;
    essayTka: number;
}

export interface AdminItem {
    id: string;
    typeId: string;
    name: string;
    iconName: string;
    color: string;
    jenjang: string;
    kelas: string;
    mapel: string;
    content: string;
}

export interface ToastNotification {
    id: number;
    message: string;
    color: string;
}

export type ViewState = 'dashboard' | 'setup' | 'documents' | 'banksoal' | 'administrasi';