import { useState, useEffect } from 'react'
import { Shield, Activity, Filter, Calendar, User as UserIcon, AlertCircle } from 'lucide-react'
import api from '../services/api'
import { useToast } from '../context/ToastContext'

export default function Settings() {
    const { showToast } = useToast()
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        entity: '',
        action: '',
        page: 1,
        limit: 50
    })

    useEffect(() => {
        fetchLogs()
    }, [filters])

    const fetchLogs = async () => {
        try {
            const params = new URLSearchParams()
            if (filters.entity) params.append('entity', filters.entity)
            if (filters.action) params.append('action', filters.action)
            params.append('page', filters.page)
            params.append('limit', filters.limit)

            const res = await api.get(`/audit?${params}`)
            setLogs(res.data.logs)
        } catch (error) {
            console.error(error)
            showToast('Loglar yüklenemedi', 'error')
        } finally {
            setLoading(false)
        }
    }

    const getActionColor = (action) => {
        switch(action) {
            case 'CREATE': return 'bg-green-100 text-green-700'
            case 'UPDATE': return 'bg-blue-100 text-blue-700'
            case 'DELETE': return 'bg-red-100 text-red-700'
            case 'LOGIN': return 'bg-purple-100 text-purple-700'
            case 'LOGOUT': return 'bg-gray-100 text-gray-700'
            case 'ASSIGN': return 'bg-yellow-100 text-yellow-700'
            case 'TRANSACTION': return 'bg-orange-100 text-orange-700'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    const getStatusIcon = (status) => {
        switch(status) {
            case 'success': return <div className="w-2 h-2 bg-green-500 rounded-full" />
            case 'error': return <div className="w-2 h-2 bg-red-500 rounded-full" />
            case 'warning': return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            default: return <div className="w-2 h-2 bg-gray-500 rounded-full" />
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('tr-TR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Sistem Denetim Kayıtları</h1>
                    <p className="text-slate-500">Tüm sistem işlemlerinin detaylı kaydı.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg">
                    <Shield size={20} />
                    <span className="font-medium">Audit Log Aktif</span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <Filter size={20} className="text-slate-500" />
                    <select
                        className="input-field"
                        value={filters.entity}
                        onChange={(e) => setFilters({...filters, entity: e.target.value, page: 1})}
                    >
                        <option value="">Tüm Tablolar</option>
                        <option value="User">Kullanıcılar</option>
                        <option value="Project">Projeler</option>
                        <option value="Employee">Çalışanlar</option>
                        <option value="Material">Malzemeler</option>
                        <option value="Equipment">Ekipman</option>
                        <option value="Supplier">Tedarikçiler</option>
                    </select>

                    <select
                        className="input-field"
                        value={filters.action}
                        onChange={(e) => setFilters({...filters, action: e.target.value, page: 1})}
                    >
                        <option value="">Tüm İşlemler</option>
                        <option value="CREATE">Oluşturma</option>
                        <option value="UPDATE">Güncelleme</option>
                        <option value="DELETE">Silme</option>
                        <option value="LOGIN">Giriş</option>
                        <option value="LOGOUT">Çıkış</option>
                        <option value="ASSIGN">Atama</option>
                    </select>

                    <button 
                        onClick={() => setFilters({ entity: '', action: '', page: 1, limit: 50 })}
                        className="btn-secondary py-2 px-4"
                    >
                        Temizle
                    </button>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Durum</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Tarih</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Kullanıcı</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">İşlem</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Tablo</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Açıklama</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <Activity className="animate-spin" size={20} />
                                            Yükleniyor...
                                        </div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <AlertCircle size={48} className="text-slate-300" />
                                            <p>Henüz kayıt bulunamadı</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center">
                                                {getStatusIcon(log.status)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Calendar size={16} />
                                                {formatDate(log.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <UserIcon size={16} className="text-slate-400" />
                                                <span className="text-sm font-medium text-slate-800">
                                                    {log.userName || log.User?.name || 'Sistem'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600 font-mono">{log.entity}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-700 max-w-md truncate">
                                                {log.description || '-'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-slate-500 font-mono">
                                                {log.ipAddress?.replace('::ffff:', '') || '-'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
                        <p className="text-sm text-slate-600">
                            Toplam <strong>{logs.length}</strong> kayıt gösteriliyor
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilters({...filters, page: filters.page - 1})}
                                disabled={filters.page === 1}
                                className="btn-secondary py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Önceki
                            </button>
                            <button
                                onClick={() => setFilters({...filters, page: filters.page + 1})}
                                disabled={logs.length < filters.limit}
                                className="btn-secondary py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sonraki
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
