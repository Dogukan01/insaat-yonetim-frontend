import { useState, useEffect } from 'react'
import { UserPlus, Phone, Briefcase, X, Search, Filter } from 'lucide-react'
import api from '../services/api'
import { useToast } from '../context/ToastContext'

export default function Employees() {
    const [employees, setEmployees] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({ name: '', role: '', phone: '', daily_rate: '' })
    const { showToast } = useToast()

    useEffect(() => {
        api.get('/employees')
            .then(res => setEmployees(res.data))
            .catch(() => {
                // Mock Data
                setEmployees([
                    { id: 1, name: 'Ahmet Yılmaz', role: 'Şantiye Şefi', phone: '0555 123 45 67', daily_rate: 2500 },
                    { id: 2, name: 'Mehmet Demir', role: 'Usta', phone: '0532 987 65 43', daily_rate: 1800 },
                    { id: 3, name: 'Ayşe Kaya', role: 'Mimar', phone: '0505 555 22 11', daily_rate: 3000 },
                ])
                // Silent fallback or use toast if preferred, keeping silent for list load
            })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        api.post('/employees', formData)
            .then(res => {
                setEmployees([...employees, res.data])
                setShowModal(false)
                setFormData({ name: '', role: '', phone: '', daily_rate: '' })
                showToast('Personel başarıyla eklendi.', 'success')
            })
            .catch(err => showToast("Hata: " + err.message, 'error'))
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Çalışan Ekibi</h1>
                    <p className="text-slate-500 mt-1">Personel listesi ve yönetimi</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary shadow-xl shadow-primary-500/20">
                    <UserPlus size={20} /> Yeni Çalışan Ekle
                </button>
            </div>

            <div className="card border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 overflow-hidden p-0">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="İsim veya rol ara..." className="input-field pl-10 bg-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">İsim</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Görevi</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Telefon</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Günlük Ücret</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {employees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 shadow-inner group-hover:from-primary-100 group-hover:to-primary-200 group-hover:text-primary-700 transition-all">
                                            {emp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{emp.name}</div>
                                            <div className="text-xs text-slate-400">ID: #{emp.id}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className="flex items-center gap-2 bg-slate-100 w-fit px-3 py-1 rounded-full text-xs font-medium text-slate-700">
                                            <Briefcase size={12} className="text-slate-400" /> {emp.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <div className="flex items-center gap-2 font-mono text-sm text-slate-500">
                                            <Phone size={14} className="text-slate-400" /> {emp.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-700">
                                        {emp.daily_rate ? `₺${emp.daily_rate}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-emerald-100 ring-1 ring-emerald-500/20 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">Aktif</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />

                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up ring-1 ring-black/5">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800">Yeni Personel Kaydı</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition-colors bg-white hover:bg-red-50 p-2 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
                                    <input type="text" placeholder="Örn: Ahmet Yılmaz" className="input-field"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Görevi</label>
                                        <input type="text" placeholder="Örn: Usta" className="input-field"
                                            value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                                        <input type="tel" placeholder="05XX XXX XX XX" className="input-field"
                                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Günlük Ücret (₺)</label>
                                    <input type="number" placeholder="0.00" className="input-field"
                                        value={formData.daily_rate} onChange={e => setFormData({ ...formData, daily_rate: e.target.value })} />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">İptal</button>
                                <button type="submit" className="btn-primary w-full sm:w-auto">
                                    Kaydet ve Ekle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
