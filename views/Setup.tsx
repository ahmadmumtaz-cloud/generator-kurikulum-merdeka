import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { JENJANG_OPTIONS, KELAS_OPTIONS, MAPEL_OPTIONS, DOCUMENT_TYPES } from '../constants';
import { Icon } from '../components/Icon';
import { generateDocumentContent, getCapaianPembelajaran } from '../services/gemini';

const Setup: React.FC = () => {
    const { setupData, setSetupData, setDocuments, showToast, setIsLoading, isLoading } = useApp();
    const navigate = useNavigate();
    const [cpContent, setCpContent] = useState<string>('');
    const [loadingCP, setLoadingCP] = useState(false);

    const handleUpdate = (field: keyof typeof setupData, value: string) => {
        setSetupData(prev => {
            const newData = { ...prev, [field]: value };
            if (field === 'jenjang') {
                newData.kelas = '';
                newData.mapel = '';
            }
            return newData;
        });
        // Reset CP jika mapel berubah
        if (field === 'mapel' || field === 'kelas' || field === 'jenjang') {
            setCpContent('');
        }
    };

    const handleFetchCP = async () => {
        if (!setupData.jenjang || !setupData.kelas || !setupData.mapel) {
            showToast('Lengkapi data Jenjang, Kelas, dan Mapel terlebih dahulu!', '#F59E0B');
            return;
        }

        setLoadingCP(true);
        try {
            const result = await getCapaianPembelajaran(setupData);
            setCpContent(result);
            showToast('✅ Capaian Pembelajaran berhasil diambil!', '#10B981');
        } catch (error) {
            showToast('❌ Gagal mengambil CP.', '#EF4444');
        } finally {
            setLoadingCP(false);
        }
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            // Generate content for each document type in parallel
            const promises = DOCUMENT_TYPES.map(async (type) => {
                const content = await generateDocumentContent(type.id, type.name, setupData);
                return {
                    id: `${type.id}-${Date.now()}`,
                    name: type.name,
                    iconName: type.icon,
                    color: type.color,
                    jenjang: setupData.jenjang,
                    kelas: setupData.kelas,
                    mapel: setupData.mapel,
                    materi: setupData.materi,
                    content: content
                };
            });

            const newDocs = await Promise.all(promises);
            setDocuments(prev => [...prev, ...newDocs]);
            showToast('✨ Semua dokumen berhasil dibuat dengan AI!', '#10B981');
            setTimeout(() => navigate('/documents'), 1000);
        } catch (error) {
            console.error(error);
            showToast('❌ Terjadi kesalahan saat generate dokumen.', '#EF4444');
        } finally {
            setIsLoading(false);
        }
    };

    const currentKelasOptions = setupData.jenjang ? KELAS_OPTIONS[setupData.jenjang] : [];
    const currentMapelOptions = setupData.jenjang ? MAPEL_OPTIONS[setupData.jenjang] : [];

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Setup Pembelajaran</h2>
                <p className="text-slate-400">Atur data pembelajaran untuk menghasilkan dokumen yang spesifik dan akurat menggunakan AI.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Jenjang */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                    <label className="block text-slate-300 font-semibold mb-4">Jenjang Pendidikan</label>
                    <div className="grid grid-cols-3 gap-3">
                        {JENJANG_OPTIONS.map(j => (
                            <button
                                key={j}
                                onClick={() => handleUpdate('jenjang', j)}
                                className={`
                                    p-4 rounded-xl font-bold text-lg transition-all duration-200
                                    ${setupData.jenjang === j 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400' 
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }
                                `}
                            >
                                {j}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Kelas */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                    <label className="block text-slate-300 font-semibold mb-4">Kelas</label>
                    <div className="grid grid-cols-3 gap-3">
                        {currentKelasOptions.length > 0 ? currentKelasOptions.map(k => (
                            <button
                                key={k}
                                onClick={() => handleUpdate('kelas', k)}
                                className={`
                                    p-3 rounded-xl font-bold transition-all duration-200
                                    ${setupData.kelas === k 
                                        ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/30' 
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }
                                `}
                            >
                                {k}
                            </button>
                        )) : (
                            <div className="col-span-3 text-center py-4 text-slate-600 italic">
                                Pilih jenjang terlebih dahulu
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mata Pelajaran */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-6">
                <label className="block text-slate-300 font-semibold mb-4">Mata Pelajaran</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {currentMapelOptions.length > 0 ? currentMapelOptions.map(m => (
                        <button
                            key={m}
                            onClick={() => handleUpdate('mapel', m)}
                            className={`
                                p-3 rounded-xl font-semibold text-left transition-all duration-200
                                ${setupData.mapel === m 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                }
                            `}
                        >
                            {m}
                        </button>
                    )) : (
                        <div className="col-span-4 text-center py-4 text-slate-600 italic">
                            Pilih jenjang terlebih dahulu
                        </div>
                    )}
                </div>
            </div>

            {/* Capaian Pembelajaran & Materi */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-8">
                {/* Header Section for Materi & CP */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
                    <label className="block text-slate-300 font-semibold">
                        Materi / Topik Pembelajaran
                        <span className="block text-xs font-normal text-slate-500 mt-1">
                            Tentukan materi spesifik berdasarkan Capaian Pembelajaran (CP)
                        </span>
                    </label>

                    {setupData.mapel && setupData.kelas && (
                        <button 
                            onClick={handleFetchCP}
                            disabled={loadingCP}
                            className="text-sm bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-indigo-500/30"
                        >
                            {loadingCP ? (
                                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Icon name="BookOpen" size={16} />
                            )}
                            {cpContent ? 'Refresh Data CP' : 'Lihat Capaian Pembelajaran (CP)'}
                        </button>
                    )}
                </div>

                {/* CP Display Area */}
                {cpContent && (
                    <div className="mb-6 p-4 bg-slate-950/50 border border-indigo-500/20 rounded-xl relative">
                        <div className="flex items-center gap-2 mb-2 text-indigo-400 font-semibold text-sm uppercase tracking-wider">
                            <Icon name="FileText" size={16} />
                            Capaian Pembelajaran (Referensi)
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            <pre className="whitespace-pre-wrap font-sans text-slate-300">{cpContent}</pre>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 italic">
                            *Gunakan teks di atas sebagai acuan untuk mengisi kolom materi di bawah.
                        </div>
                    </div>
                )}

                {/* Materi Input */}
                {setupData.mapel ? (
                    <div className="relative">
                        <input
                            type="text"
                            value={setupData.materi}
                            onChange={(e) => handleUpdate('materi', e.target.value)}
                            placeholder="Contoh: Operasi Bilangan Bulat, Ekosistem Sawah, Teks Prosedur..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                            <Icon name="Edit3" size={20} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-slate-600 italic">
                        Pilih mata pelajaran terlebih dahulu
                    </div>
                )}
            </div>

            {/* Generate Action */}
            {setupData.jenjang && setupData.kelas && setupData.mapel && setupData.materi && (
                <div className="bg-gradient-to-r from-indigo-600/20 to-amber-500/20 border-2 border-indigo-500/30 rounded-3xl p-8 text-center animate-fadeIn">
                    <div className="mb-4 inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-xl shadow-indigo-500/30">
                        {isLoading ? <div className="loader border-white"></div> : <Icon name="Sparkles" size={32} className="text-white" />}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        {isLoading ? 'Sedang Membuat Dokumen...' : 'Siap Generate!'}
                    </h3>
                    <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                        Sistem AI akan membuat Modul Ajar, ATP, KKTP, Prota, dan Promes secara otomatis berdasarkan topik "<strong>{setupData.materi}</strong>".
                    </p>
                    <button 
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className={`
                            px-8 py-4 text-lg font-bold rounded-xl shadow-xl transition-all duration-200 flex items-center justify-center gap-3 mx-auto
                            ${isLoading 
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transform hover:scale-105 shadow-indigo-500/40'
                            }
                        `}
                    >
                        <Icon name="Zap" size={24} />
                        {isLoading ? 'Memproses...' : 'Generate Dokumen'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Setup;