import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Settings, 
    FileText, 
    HelpCircle, 
    ClipboardList, 
    Menu,
    X,
    Sparkles,
    Loader2
} from 'lucide-react';
import { SetupData, DocumentItem, QuestionItem, AdminItem, ToastNotification } from './types';
import { Icon } from './components/Icon';
import Dashboard from './views/Dashboard';
import Setup from './views/Setup';
import Documents from './views/Documents';
import BankSoal from './views/BankSoal';
import Administrasi from './views/Administrasi';

// --- Global State Context ---
interface AppState {
    setupData: SetupData;
    setSetupData: React.Dispatch<React.SetStateAction<SetupData>>;
    documents: DocumentItem[];
    setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
    bankSoal: QuestionItem[];
    setBankSoal: React.Dispatch<React.SetStateAction<QuestionItem[]>>;
    administrasi: AdminItem[];
    setAdministrasi: React.Dispatch<React.SetStateAction<AdminItem[]>>;
    showToast: (message: string, color?: string) => void;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
};

// --- Custom Hook for Persistence ---
function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const savedData = localStorage.getItem(key);
            return savedData ? JSON.parse(savedData) : defaultValue;
        } catch (error) {
            console.error(`Failed to load ${key} from localStorage:`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Failed to save ${key} to localStorage:`, error);
        }
    }, [key, state]);

    return [state, setState];
}

// --- Components ---

const Sidebar = ({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (v: boolean) => void }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: '/', label: 'Dashboard', icon: LayoutDashboard },
        { id: '/setup', label: 'Setup Pembelajaran', icon: Settings },
        { id: '/documents', label: 'Dokumen Saya', icon: FileText },
        { id: '/banksoal', label: 'Bank Soal', icon: HelpCircle },
        { id: '/administrasi', label: 'Administrasi', icon: ClipboardList },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-50 w-72 
                bg-gradient-to-b from-slate-900 to-slate-950 
                border-r border-white/10 transform transition-transform duration-300 ease-in-out
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="text-indigo-400 w-8 h-8" />
                            <h1 className="text-xl font-bold text-white font-sans leading-tight">
                                Generator<br/>Kurikulum
                            </h1>
                        </div>
                        <p className="text-sm text-amber-500 font-medium">Sistem Administrasi Guru</p>
                    </div>

                    <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        navigate(item.id);
                                        setMobileOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                                        ${isActive 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <item.icon size={20} />
                                    <span className="font-semibold">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-white/10">
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                            <p className="text-xs text-slate-400 text-center">
                                &copy; 2024 Generator Kurikulum Merdeka
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isLoading } = useApp();

    return (
        <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden relative">
            {/* Global Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center animate-fadeIn">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full"></div>
                        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative z-10" />
                    </div>
                    <p className="mt-4 text-white font-semibold text-lg animate-pulse">Sedang Memproses...</p>
                    <p className="text-slate-400 text-sm">AI sedang membuat konten berkualitas untuk Anda</p>
                </div>
            )}

            <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            
            <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
                <header className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-white/10 bg-slate-900">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-indigo-400 w-6 h-6" />
                        <span className="font-bold text-lg">Generator KM</span>
                    </div>
                    <button onClick={() => setMobileOpen(true)} className="p-2 text-slate-300">
                        <Menu size={24} />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
                    <div className="max-w-6xl mx-auto animate-fadeIn">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

const ToastContainer = ({ toasts }: { toasts: ToastNotification[] }) => {
    return (
        <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div 
                    key={toast.id}
                    className="bg-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn pointer-events-auto"
                    style={{ borderLeft: `4px solid ${toast.color}` }}
                >
                    <span className="font-semibold text-slate-900">{toast.message}</span>
                </div>
            ))}
        </div>
    );
};

export default function App() {
    // Use custom hook for persistence on all main state
    const [setupData, setSetupData] = usePersistedState<SetupData>('setupData', { jenjang: '', kelas: '', mapel: '', materi: '' });
    const [documents, setDocuments] = usePersistedState<DocumentItem[]>('documents', []);
    const [bankSoal, setBankSoal] = usePersistedState<QuestionItem[]>('bankSoal', []);
    const [administrasi, setAdministrasi] = usePersistedState<AdminItem[]>('administrasi', []);
    
    const [toasts, setToasts] = useState<ToastNotification[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const showToast = (message: string, color: string = '#10B981') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, color }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    return (
        <AppContext.Provider value={{
            setupData, setSetupData,
            documents, setDocuments,
            bankSoal, setBankSoal,
            administrasi, setAdministrasi,
            showToast,
            isLoading, setIsLoading
        }}>
            <HashRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/setup" element={<Setup />} />
                        <Route path="/documents" element={<Documents />} />
                        <Route path="/banksoal" element={<BankSoal />} />
                        <Route path="/administrasi" element={<Administrasi />} />
                    </Routes>
                </Layout>
                <ToastContainer toasts={toasts} />
            </HashRouter>
        </AppContext.Provider>
    );
}