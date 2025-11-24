import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { ADMINISTRASI_TYPES } from '../constants';
import { Icon } from '../components/Icon';
import { generateAdminContent } from '../services/gemini';

const Administrasi: React.FC = () => {
    const { administrasi, setAdministrasi, setupData, showToast, setIsLoading, isLoading } = useApp();
    const navigate = useNavigate();

    const handleGenerate = async (typeId: string) => {
        if (!setupData.jenjang || !setupData.kelas || !setupData.mapel) {
            showToast('⚠️ Lengkapi setup pembelajaran terlebih dahulu!', '#EF4444');
            navigate('/setup');
            return;
        }

        const type = ADMINISTRASI_TYPES.find(t => t.id === typeId);
        if (!type) return;

        setIsLoading(true);
        try {
            const content = await generateAdminContent(typeId, type.name, setupData);

            const newDoc = {
                id: `admin-${Date.now()}`,
                typeId: typeId,
                name: type.name,
                iconName: type.icon,
                color: type.color,
                jenjang: setupData.jenjang,
                kelas: setupData.kelas,
                mapel: setupData.mapel,
                content: content
            };

            setAdministrasi(prev => [...prev, newDoc]);
            showToast(`✅ ${type.name} berhasil dibuat!`, type.color);
        } catch (error) {
            console.error(error);
            showToast('❌ Gagal membuat dokumen administrasi.', '#EF4444');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (index: number) => {
        const doc = administrasi[index];
        
        // Wrap content in a basic HTML structure for Word compatibility
        const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${doc.name}</title>
        <style>
            body { font-family: 'Times New Roman', serif; font-size: 12pt; }
            h1, h2, h3 { color: #000; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
            td, th { border: 1px solid #000; padding: 5px; }
        </style>
        </head><body>`;
        const postHtml = "</body></html>";
        
        const html = preHtml + doc.content + postHtml;

        const blob = new Blob([html], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Change extension to .doc
        a.download = `${doc.name}_${doc.mapel}_Kelas${doc.kelas}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('📥 File Word berhasil didownload!', '#10B981');
    };

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Administrasi Guru</h2>
                <p className="text-slate-400">Generate dokumen pelengkap administrasi secara otomatis dan realistis dengan AI.</p>
            </div>

            {/* Type Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {ADMINISTRASI_TYPES.map(type => (
                    <button
                        key={type.id}
                        onClick={() => handleGenerate(type.id)}
                        disabled={isLoading}
                        className={`
                            group bg-slate-900 border border-white/10 rounded-2xl p-6 text-left transition-all duration-300
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800 hover:translate-y-[-4px] hover:shadow-xl'}
                        `}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div 
                                className="p-3 rounded-xl shadow-lg"
                                style={{ backgroundColor: `${type.color}22`, color: type.color }}
                            >
                                <Icon name={type.icon} size={24} />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                <Icon name="Sparkles" size={18} />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{type.name}</h3>
                        <p className="text-sm text-slate-400">{type.desc}</p>
                    </button>
                ))}
            </div>

            {/* Generated Documents List */}
            {administrasi.length > 0 && (
                <div className="animate-slideIn">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <Icon name="FolderOpen" size={24} className="text-indigo-400" />
                        Dokumen Administrasi Saya
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {administrasi.map((doc, index) => (
                            <div 
                                key={doc.id}
                                className="bg-slate-900 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-white/30 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div 
                                        className="p-3 rounded-lg bg-opacity-10"
                                        style={{ backgroundColor: `${doc.color}22`, color: doc.color }}
                                    >
                                        <Icon name={doc.iconName} size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{doc.name}</p>
                                        <p className="text-xs text-slate-400">
                                            {doc.jenjang} Kelas {doc.kelas} • {doc.mapel}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDownload(index)}
                                    className="p-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg transition-all"
                                    title="Download Word"
                                >
                                    <Icon name="Download" size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Administrasi;