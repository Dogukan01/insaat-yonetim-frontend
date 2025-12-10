import { useState } from 'react'
import { Building, Users, DollarSign, Activity, TrendingUp, Bell, Check, AlertCircle } from 'lucide-react'

export default function Dashboard() {
    const [showNotifications, setShowNotifications] = useState(false)
    const [showReportToast, setShowReportToast] = useState(false)

    const stats = [
        { label: 'Aktif Projeler', value: '12', icon: Building, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { label: 'Toplam Personel', value: '48', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { label: 'Aylık Bütçe', value: '₺850K', icon: DollarSign, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
        { label: 'Tamamlanma', value: '%64', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    ]

    const handleDownloadReport = () => {
        setShowReportToast(true)
        setTimeout(() => setShowReportToast(false), 3000)
    }

    return (
        <div className="space-y-8 relative">
            {/* Toast Notification */}
            {showReportToast && (
                <div className="fixed top-24 right-8 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in z-50">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Rapor Hazırlandı</h4>
                        <p className="text-xs text-slate-400">PDF dosyası indiriliyor...</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Kontrol Paneli</h1>
                    <p className="text-slate-500 mt-1">Şantiye verileri ve günlük özetler</p>
                </div>
                <div className="flex gap-3 relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`btn-secondary flex items-center gap-2 relative ${showNotifications ? 'bg-slate-100' : ''}`}
                    >
                        <Bell size={18} />
                        <span className="hidden sm:inline">Bildirimler</span>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    {/* Notifications Popover */}
                    {showNotifications && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 animate-fade-in overflow-hidden">
                            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                <h3 className="font-bold text-slate-700">Bildirimler</h3>
                                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold">3 Yeni</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {[
                                    { text: "Yeni beton mikseri sahaya ulaştı.", time: "10 dk önce", type: "info" },
                                    { text: "Vadi Konakları projesi bütçe aşımı!", time: "2 saat önce", type: "alert" },
                                    { text: "Ahmet Yılmaz izin talebi oluşturdu.", time: "5 saat önce", type: "warning" },
                                ].map((notif, i) => (
                                    <div key={i} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                                        <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${notif.type === 'alert' ? 'bg-red-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-primary-500'}`} />
                                        <div>
                                            <p className="text-sm text-slate-700 leading-snug">{notif.text}</p>
                                            <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                                Tümünü Okundu İşaretle
                            </button>
                        </div>
                    )}

                    <button onClick={handleDownloadReport} className="btn-primary shadow-xl shadow-primary-500/20 active:scale-95 transition-transform">
                        <TrendingUp size={18} />
                        Rapor İndir
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className={`card border-l-4 ${stat.border} hover:scale-105 transition-transform duration-300`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Placeholder */}
                <div className="lg:col-span-2 card min-h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-slate-800">Proje İlerlemeleri</h3>
                        <select className="text-sm border-none bg-slate-50 rounded-lg px-2 py-1 outline-none text-slate-500 cursor-pointer">
                            <option>Son 7 Gün</option>
                            <option>Bu Ay</option>
                        </select>
                    </div>
                    <div className="flex-1 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 gap-3 group hover:border-primary-200 transition-colors">
                        <Activity size={32} className="text-slate-300 group-hover:text-primary-300 transition-colors" />
                        <p>Analitik Grafikleri Yakında...</p>
                    </div>
                </div>

                <div className="card flex flex-col">
                    <h3 className="font-bold text-lg text-slate-800 mb-6">Son İşlemler</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-slate-800">Yeni malzeme girişi yapıldı</p>
                                    <p className="text-xs text-slate-500 mt-0.5">2 saat önce</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-auto w-full py-3 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        Tümünü Gör
                    </button>
                </div>
            </div>
        </div>
    )
}
