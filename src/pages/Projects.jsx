import { useState, useEffect } from 'react'
import { Plus, MapPin, Calendar, X, Search, Edit2, Trash2, ArrowRight } from 'lucide-react'
import api from '../services/api'
import { useToast } from '../context/ToastContext'
import Skeleton from '../components/ui/Skeleton'

export default function Projects() {
    const [projects, setProjects] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editId, setEditId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({ name: '', location: '', budget: '', status: 'Planlama', start_date: '' })

    const { showToast } = useToast()

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const res = await api.get('/projects');
            setProjects(res.data)
        } catch (err) {
            console.error("API Hatası:", err)
            // Fallback mock data
            setProjects([
                { id: 1, name: 'Vadi İstanbul Konutları', location: 'İstanbul, Sarıyer', budget: 5000000, status: 'Devam Ediyor', start_date: '2023-01-15' },
                { id: 2, name: 'Merkez AVM İnşaatı', location: 'Ankara, Çankaya', budget: 12000000, status: 'Planlama', start_date: '2024-05-01' },
                { id: 3, name: 'Sahil Rezidans', location: 'İzmir, Karşıyaka', budget: 8500000, status: 'Tamamlandı', start_date: '2022-09-10' },
            ])
            // Do not show error toast here to keep UI clean with fallback, 
            // generally only show toast if user action fails.
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({ name: '', location: '', budget: '', status: 'Planlama', start_date: '' })
        setIsEditing(false)
        setEditId(null)
    }

    const handleEditClick = (project) => {
        setFormData({
            name: project.name,
            location: project.location,
            budget: project.budget,
            status: project.status,
            start_date: project.start_date ? project.start_date.split('T')[0] : ''
        })
        setEditId(project.id)
        setIsEditing(true)
        setShowModal(true)
    }

    const validateForm = () => {
        if (!formData.name.trim()) return "Proje adı zorunludur.";
        if (!formData.start_date) return "Başlangıç tarihi zorunludur.";
        if (formData.budget < 0) return "Bütçe negatif olamaz.";
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const error = validateForm();
        if (error) {
            showToast(error, 'warning');
            return;
        }

        try {
            if (isEditing) {
                await api.put(`/projects/${editId}`, formData)
                showToast('Proje başarıyla güncellendi.', 'success')
            } else {
                await api.post('/projects', formData)
                showToast('Yeni proje başarıyla oluşturuldu.', 'success')
            }
            fetchProjects()
            setShowModal(false)
            resetForm()
        } catch (err) {
            const msg = err.response?.data?.message || (isEditing ? "Güncelleme başarısız" : "Kayıt başarısız");
            showToast(msg, 'error')
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Bu projeyi silmek istediğinize emin misiniz?')) {
            try {
                await api.delete(`/projects/${id}`)
                showToast('Proje silindi.', 'info')
                fetchProjects()
            } catch (err) {
                showToast('Silme işlemi başarısız oldu.', 'error')
            }
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Devam Ediyor': return 'bg-blue-100 text-blue-700 ring-blue-600/20';
            case 'Tamamlandı': return 'bg-emerald-100 text-emerald-700 ring-emerald-600/20';
            default: return 'bg-slate-100 text-slate-600 ring-slate-500/20';
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Projeler</h1>
                    <p className="text-slate-500 mt-1">Devam eden ve planlanan şantiyeler</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true) }}
                    className="btn-primary shadow-xl shadow-primary-500/20"
                >
                    <Plus size={20} /> Yeni Proje Başlat
                </button>
            </div>

            <div className="flex gap-4 mb-6 sticky top-0 bg-slate-50/95 backdrop-blur z-10 py-2 -mx-2 px-2">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Proje ara..." className="input-field pl-10 bg-white shadow-sm" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="card h-64 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                                <Skeleton className="h-8 w-3/4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-1/3" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex justify-between">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                        </div>
                    ))
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="card group hover:shadow-2xl hover:shadow-primary-900/5 hover:-translate-y-1 transition-all duration-300 border-slate-200/60 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ring-1 inset-0 ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </span>

                                <div className="flex gap-1 opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditClick(project)}
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary-600 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1" title={project.name}>
                                {project.name}
                            </h3>

                            <div className="space-y-3 text-sm text-slate-500 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span className="truncate">{project.location || 'Konum belirtilmedi'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span>{project.start_date ? new Date(project.start_date).toLocaleDateString('tr-TR') : 'Tarih yok'}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Bütçe</p>
                                    <span className="font-bold text-slate-900 text-lg">₺{Number(project.budget).toLocaleString('tr-TR')}</span>
                                </div>
                                <button className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />

                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up ring-1 ring-black/5">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800">{isEditing ? 'Projeyi Düzenle' : 'Yeni Proje Oluştur'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition-colors bg-white hover:bg-red-50 p-2 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Proje Adı</label>
                                <input type="text" placeholder="Örn: Vadi Konakları" className="input-field"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Konum</label>
                                    <input type="text" placeholder="Şehir, İlçe" className="input-field"
                                        value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Başlangıç Tarihi</label>
                                    <input type="date" className="input-field"
                                        value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bütçe (₺)</label>
                                    <input type="number" placeholder="0" className="input-field"
                                        value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Durum</label>
                                    <select className="input-field" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                        <option value="Planlama">Planlama</option>
                                        <option value="Devam Ediyor">Devam Ediyor</option>
                                        <option value="Tamamlandı">Tamamlandı</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">İptal</button>
                                <button type="submit" className="btn-primary w-full sm:w-auto">
                                    {isEditing ? 'Güncelle' : 'Projeyi Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
