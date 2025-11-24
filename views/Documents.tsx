import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Icon } from '../components/Icon';

const Documents: React.FC = () => {
    const { documents, showToast } = useApp();
    const navigate = useNavigate();

    const handleDownload = (index: number) => {
        const doc = documents[index];
        
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
        a.download = `${doc.name}_${doc.materi.replace(/\s+/g, '_')}_Kelas${doc.kelas}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('📥 Dokumen Word berhasil didownload!', '#6366F1');
    };

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Dokumen Saya</h2>
                <p className="text-slate-400">Kumpulan dokumen administrasi yang telah digenerate.</p>
            </div>

            {documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc, index) => (
                        <div 
                            key={doc.id}
                            className="group bg-slate-900 border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:translate-y-[-4px] transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div 
                                    className="p-3 rounded-xl shadow-lg transition-colors"
                                    style={{ backgroundColor: `${doc.color}22`, color: doc.color }}
                                >
                                    <Icon name={doc.iconName} size={28} />
                                </div>
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold border border-emerald-500/20">
                                    Siap
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-1">{doc.name}</h3>
                            <p className="text-sm text-slate-500 mb-2">{doc.mapel} - Kelas {doc.kelas}</p>
                            <p className="text-sm font-medium text-amber-500 mb-6 line-clamp-2" title={doc.materi}>
                                {doc.materi}
                            </p>

                            <button 
                                onClick={() => handleDownload(index)}
                                className="w-full py-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <Icon name="Download" size={18} />
                                Download Word
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-900 border-2 border-dashed border-white/10 rounded-3xl p-12 text-center">
                    <div className="inline-block p-6 bg-slate-800 rounded-full mb-6 opacity-50">
                        <Icon name="FileText" size={48} className="text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Belum Ada Dokumen</h3>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                        Dokumen yang Anda buat melalui menu Setup akan muncul di sini.
                    </p>
                    <button 
                        onClick={() => navigate('/setup')}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors inline-flex items-center gap-2"
                    >
                        <Icon name="Settings" size={20} />
                        Pergi ke Setup
                    </button>
                </div>
            )}
        </div>
    );
};

export default Documents;