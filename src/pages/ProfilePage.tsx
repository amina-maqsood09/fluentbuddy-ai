import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getUserStats, type UserStats } from '../services/statsService'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { logOut } from '../services/authService'

const levels = ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced']

function ProfilePage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [stats, setStats] = useState<UserStats | null>(null)
    const [level, setLevel] = useState('')
    const [goal, setGoal] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function loadData() {
            if (!user) return
            try {
                const [userStats, userDoc] = await Promise.all([
                    getUserStats(),
                    getDoc(doc(db, 'users', user.uid)),
                ])
                setStats(userStats)
                setLevel(userDoc.data()?.englishLevel || '')
                setGoal(userDoc.data()?.englishGoal || '')
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [user])

    async function handleUpdateLevel(newLevel: string) {
        if (!user) return
        setSaving(true)
        try {
            await updateDoc(doc(db, 'users', user.uid), { englishLevel: newLevel })
            setLevel(newLevel)
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    async function handleLogout() {
        await logOut()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-2xl mx-auto px-6 py-10">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-sm font-medium text-slate-500 hover:text-indigo-700 transition-colors"
                >
                    ← Back to Dashboard
                </button>

                <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {/* Header banner */}
                    <div className="h-20 bg-gradient-to-r from-indigo-600 to-indigo-800" />

                    <div className="px-6 pb-6">
                        {/* Avatar overlapping the banner */}
                        <div className="-mt-10 flex items-end gap-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-heading font-semibold text-2xl border-4 border-white shadow-md shrink-0">
                                {(user?.displayName || 'U')[0].toUpperCase()}
                            </div>
                            <div className="pb-1">
                                <p className="font-heading text-lg font-semibold text-slate-900">
                                    {user?.displayName}
                                </p>
                                <p className="text-sm text-slate-500">{user?.email}</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 grid grid-cols-3 gap-3">
                            {[
                                { label: 'Sessions', value: loading ? '...' : stats?.totalConversations ?? 0 },
                                { label: 'Words Learned', value: loading ? '...' : stats?.vocabularyCount ?? 0 },
                                { label: 'Goal', value: goal || '—' },
                            ].map((item) => (
                                <div key={item.label} className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                                    <p className="text-xs text-slate-500">{item.label}</p>
                                    <p className="mt-1 text-base font-heading font-semibold text-slate-900 truncate" title={String(item.value)}>
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* English Level */}
                        <div className="mt-8">
                            <p className="text-sm font-semibold text-slate-900 mb-3">English Level</p>
                            <div className="flex flex-wrap gap-2">
                                {levels.map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => handleUpdateLevel(l)}
                                        disabled={saving}
                                        className={`text-xs font-medium px-3.5 py-2 rounded-full border transition-colors disabled:opacity-50 ${level === l
                                                ? 'bg-indigo-700 text-white border-indigo-700 shadow-sm'
                                                : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-700'
                                            }`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="mt-8 w-full border border-red-200 text-red-600 font-medium py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage