import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Icon } from '../components/Icon';
import { generateBulkQuestions, generateExamDocument } from '../services/gemini';
import { QuestionConfig } from '../types';

const BankSoal: React.FC = () => {
    const { bankSoal, setBankSoal, setupData, showToast, setIsLoading, isLoading } = useApp();
    const navigate = useNavigate();

    const [config, setConfig] = useState<QuestionConfig>({
        pgRegular: 0,
        pgTka: 0,
        essayRegular: 0,
        essayTka: 0
    });

    const handleGenerateBulk = async () => {
        if (!setupData.jenjang || !setupData.kelas || !setupData.mapel) {
            showToast('⚠️ Lengkapi setup pembelajaran terlebih dahulu!', '#EF4444');
            navigate('/setup');
            return;
        }

        const total = config.pgRegular + config.pgTka + config.essayRegular + config.essayTka;
        if (total === 0) {
            showToast('⚠️ Masukkan jumlah soal minimal 1.', '#EF4444');
            return;
        }

        setIsLoading(true);
        try {
            const aiQuestions = await generateBulkQuestions(setupData, config);
            
            const newQuestions = aiQuestions.map((q: any) => ({
                id: `soal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: q.type,
                category: q.category,
                difficulty: q.difficulty,
                mapel: setupData.mapel,
                kelas: setupData.kelas,
                question: q.question,
                options: q.options || [],
                correctAnswer: q.correctAnswer ?? null,
                answer: q.answer
            }));

            // Replace or Append? Let's prepend to show newest first, keeping old ones.
            setBankSoal(prev => [...newQuestions, ...prev]);
            showToast(`✅ Berhasil membuat ${newQuestions.length} soal baru!`, '#10B981');
            
            // Reset config (optional)
            setConfig({ pgRegular: 0, pgTka: 0, essayRegular: 0, essayTka: 0 });
        } catch (error) {
            console.error(error);
            showToast('❌ Gagal membuat soal. Coba kurangi jumlah permintaan.', '#EF4444');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteSoal = (id: string) => {
        setBankSoal(prev => prev.filter(s => s.id !== id));
        showToast('🗑️ Soal berhasil dihapus!', '#F59E0B');
    };

    const clearAllSoal = () => {
        if (window.confirm("Apakah Anda yakin ingin menghapus semua soal?")) {
            setBankSoal([]);
            showToast('🗑️ Semua soal berhasil dihapus!', '#F59E0B');
        }
    };

    const handleDownloadPackage = async () => {
        if (bankSoal.length === 0) {
            showToast('⚠️ Belum ada soal untuk didownload.', '#EF4444');
            return;
        }
        
        if (!setupData.mapel) {
            showToast('⚠️ Data setup tidak lengkap.', '#EF4444');
            return;
        }

        setIsLoading(true);
        try {
            const content = await generateExamDocument(setupData, bankSoal);

            // Wrap in HTML with Word-specific styles
            const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>Paket Soal Lengkap</title>
            <style>
                body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
                h1, h2, h3 { color: #000; text-align: center; margin-top: 20px; }
                table { border-collapse: collapse; width: 100%; margin: 15px 0; }
                td, th { border: 1px solid #000; padding: 8px; vertical-align: top; }
                th { background-color: #f0f0f0; text-align: center; font-weight: bold; }
                .page-break { page-break-before: always; }
                .header-doc { text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px; }
            </style>
            </head><body>`;
            const postHtml = "</body></html>";

            const html = preHtml + content + postHtml;
            
            const blob = new Blob([html], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Paket_Soal_Lengkap_${setupData.mapel}_${setupData.kelas}.doc`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast('📦 Paket Soal Lengkap berhasil didownload!', '#6366F1');
        } catch (error) {
            console.error(error);
            showToast('❌ Gagal membuat paket soal.', '#EF4444');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn pb-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Bank Soal AI (Mode SMA/TKA)</h2>
                <p className="text-slate-400">
                    {setupData.mapel ? 
                        `Kelola soal untuk ${setupData.mapel} materi "${setupData.materi || 'Umum'}".` : 
                        'Kelola koleksi soal ujian, termasuk soal HOTS dan TKA.'}
                </p>
            </div>

            {/* Generator Panel */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-600/20 rounded-lg text-indigo-400">
                        <Icon name="Settings" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Konfigurasi Soal</h3>
                        <p className="text-sm text-slate-400">Tentukan komposisi soal yang ingin dibuat</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Input PG Regular */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Pilihan Ganda (Reguler)</label>
                        <input 
                            type="number" 
                            min="0"
                            value={config.pgRegular}
                            onChange={(e) => setConfig({...config, pgRegular: parseInt(e.target.value) || 0})}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    {/* Input PG TKA */}
                    <div>
                        <label className="block text-sm font-semibold text-amber-400 mb-2">PG TKA (HOTS/Analisis)</label>
                        <input 
                            type="number" 
                            min="0"
                            value={config.pgTka}
                            onChange={(e) => setConfig({...config, pgTka: parseInt(e.target.value) || 0})}
                            className="w-full bg-slate-800 border border-amber-500/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                    </div>
                    {/* Input Essay Regular */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Uraian (Reguler)</label>
                        <input 
                            type="number" 
                            min="0"
                            value={config.essayRegular}
                            onChange={(e) => setConfig({...config, essayRegular: parseInt(e.target.value) || 0})}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    {/* Input Essay TKA */}
                    <div>
                        <label className="block text-sm font-semibold text-amber-400 mb-2">Uraian TKA (HOTS/Analisis)</label>
                        <input 
                            type="number" 
                            min="0"
                            value={config.essayTka}
                            onChange={(e) => setConfig({...config, essayTka: parseInt(e.target.value) || 0})}
                            className="w-full bg-slate-800 border border-amber-500/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <button 
                        onClick={handleGenerateBulk}
                        disabled={isLoading}
                        className={`
                            flex-1 py-4 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all
                            ${isLoading 
                                ? 'bg-slate-700 cursor-not-allowed opacity-70' 
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:scale-[1.02] shadow-indigo-500/30'
                            }
                        `}
                    >
                        {isLoading ? (
                            <>
                                <div className="loader w-5 h-5 border-white"></div>
                                <span>Sedang Membuat Soal...</span>
                            </>
                        ) : (
                            <>
                                <Icon name="Sparkles" size={20} />
                                <span>Generate Soal Otomatis</span>
                            </>
                        )}
                    </button>

                    {bankSoal.length > 0 && (
                        <>
                            <button 
                                onClick={handleDownloadPackage}
                                disabled={isLoading}
                                className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all"
                            >
                                <Icon name="Download" size={20} />
                                <span>Download Word</span>
                            </button>
                            <button 
                                onClick={clearAllSoal}
                                disabled={isLoading}
                                className="px-4 py-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl font-bold transition-all border border-rose-500/30"
                                title="Hapus Semua"
                            >
                                <Icon name="Trash2" size={20} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* List */}
            {bankSoal.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-slate-400 text-sm mb-2">
                        <span>Total: {bankSoal.length} Soal</span>
                        <span>
                            PG: {bankSoal.filter(q => q.type.includes('Pilihan Ganda')).length} | 
                            Essay: {bankSoal.filter(q => q.type.includes('Essay') || q.type.includes('Uraian')).length}
                        </span>
                    </div>

                    {bankSoal.map((soal) => (
                        <div 
                            key={soal.id}
                            className="bg-slate-900 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all relative group"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        <span className={`
                                            px-3 py-1 rounded-full text-xs font-bold border
                                            ${soal.category === 'TKA' 
                                                ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                                                : 'bg-indigo-500/20 border-indigo-500 text-indigo-300'}
                                        `}>
                                            {soal.category || 'Reguler'}
                                        </span>
                                        <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-bold border border-white/10">
                                            {soal.type}
                                        </span>
                                        <span className={`
                                            px-3 py-1 rounded-full text-xs font-bold border bg-opacity-20
                                            ${soal.difficulty === 'Mudah' ? 'bg-emerald-500 border-emerald-500 text-emerald-400' : 
                                                soal.difficulty === 'Sedang' ? 'bg-blue-500 border-blue-500 text-blue-400' : 
                                                'bg-rose-500 border-rose-500 text-rose-400'}
                                        `}>
                                            {soal.difficulty}
                                        </span>
                                    </div>
                                    
                                    <p className="text-lg font-medium text-white mb-4 whitespace-pre-line">{soal.question}</p>
                                    
                                    {soal.type.includes('Pilihan Ganda') && soal.options && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                            {soal.options.map((opt, i) => (
                                                <div 
                                                    key={i}
                                                    className={`
                                                        flex items-center gap-3 px-4 py-3 rounded-lg border
                                                        ${i === soal.correctAnswer 
                                                            ? 'bg-emerald-500/10 border-emerald-500/30' 
                                                            : 'bg-white/5 border-transparent'
                                                        }
                                                    `}
                                                >
                                                    <span className={`font-bold ${i === soal.correctAnswer ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                        {String.fromCharCode(65 + i)}.
                                                    </span>
                                                    <span className={i === soal.correctAnswer ? 'text-white' : 'text-slate-300'}>
                                                        {opt}
                                                    </span>
                                                    {i === soal.correctAnswer && <Icon name="Check" size={16} className="text-emerald-400 ml-auto" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex items-start gap-2">
                                            <Icon name="Key" size={16} className="text-amber-500 mt-1" />
                                            <div>
                                                <span className="text-xs text-amber-500 font-bold uppercase tracking-wider block mb-1">Pembahasan / Kunci Jawaban</span>
                                                <p className="text-sm text-slate-300 leading-relaxed">{soal.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => deleteSoal(soal.id)}
                                    className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-colors opacity-100 lg:opacity-0 group-hover:opacity-100"
                                    title="Hapus Soal"
                                >
                                    <Icon name="Trash2" size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-900 border-2 border-dashed border-white/10 rounded-3xl p-12 text-center">
                    <div className="inline-block p-6 bg-slate-800 rounded-full mb-6 opacity-50">
                        <Icon name="HelpCircle" size={48} className="text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Belum Ada Soal</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                        Gunakan panel konfigurasi di atas untuk membuat paket soal lengkap sesuai kebutuhan.
                    </p>
                </div>
            )}
        </div>
    );
};

export default BankSoal;