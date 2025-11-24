import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Icon } from '../components/Icon';

const Dashboard: React.FC = () => {
    const { documents, bankSoal, administrasi, setupData } = useApp();
    const navigate = useNavigate();

    const isSetupComplete = setupData.jenjang && setupData.kelas && setupData.mapel && setupData.materi;
    
    const stats = [
        { label: 'Total Dokumen', value: documents.length, icon: 'FileText', color: '#6366F1' },
        { label: 'Bank Soal', value: bankSoal.length, icon: 'HelpCircle', color: '#10B981' },
        { label: 'Administrasi', value: administrasi.length, icon: 'ClipboardList', color: '#F59E0B' },
        { label: 'Setup Status', value: isSetupComplete ? 'Siap' : 'Belum', icon: 'Settings', color: isSetupComplete ? '#10B981' : '#EF4444' }
    ];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
                <p className="text-slate-400">Ringkasan aktivitas dan status pembelajaran Anda.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div 
                        key={idx} 
                        className="group bg-slate-900 border border-white/10 rounded-2xl p-6 hover:translate-y-[-4px] hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div 
                                className="p-3 rounded-xl shadow-lg"
                                style={{ backgroundColor: `${stat.color}22`, color: stat.color }}
                            >
                                <Icon name={stat.icon} size={26} />
                            </div>
                            <span className="text-4xl font-bold text-white">{stat.value}</span>
                        </div>
                        <p className="text-slate-400 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Active Learning Setup */}
            {isSetupComplete ? (
                <div className="bg-gradient-to-br from-indigo-500/10 to-amber-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Icon name="BookOpen" size={24} className="text-indigo-400" />
                        <h3 className="text-xl font-bold text-white">Pembelajaran Aktif</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Jenjang</p>
                            <p className="text-lg font-bold text-amber-400">{setupData.jenjang}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Kelas</p>
                            <p className="text-lg font-bold text-amber-400">{setupData.kelas}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Mata Pelajaran</p>
                            <p className="text-lg font-bold text-amber-400">{setupData.mapel}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Materi</p>
                            <p className="text-lg font-bold text-amber-400 truncate" title={setupData.materi}>{setupData.materi}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-900 border-2 border-dashed border-white/10 rounded-2xl p-8 text-center mb-8">
                    <div className="inline-block p-4 bg-slate-800 rounded-full mb-4">
                        <Icon name="Settings" size={32} className="text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Belum Ada Setup Pembelajaran</h3>
                    <p className="text-slate-400 mb-6">Mulai dengan mengisi data di menu Setup Pembelajaran</p>
                    <button 
                        onClick={() => navigate('/setup')}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors"
                    >
                        Mulai Setup
                    </button>
                </div>
            )}

            {/* Recent Documents */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Dokumen Terbaru</h3>
                <div className="space-y-3">
                    {documents.length > 0 ? (
                        documents.slice(0, 5).map((doc) => (
                            <div 
                                key={doc.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div 
                                        className="p-2 rounded-lg"
                                        style={{ backgroundColor: `${doc.color}22`, color: doc.color }}
                                    >
                                        <Icon name={doc.iconName} size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{doc.name}</p>
                                        <p className="text-xs text-slate-400">{doc.materi}</p>
                                    </div>
                                </div>
                                <span 
                                    className="px-3 py-1 rounded-full text-xs font-bold"
                                    style={{ backgroundColor: doc.color, color: '#000' }}
                                >
                                    Siap
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-8 text-slate-500">Belum ada dokumen yang dibuat</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;