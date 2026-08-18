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
        <div className="min-h-screen bg-brand-offwhite">
            <div className="max-w-2xl mx-auto px-6 py-10">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-sm font-medium text-brand-slate-secondary hover:text-brand-indigo transition"
                >
                    ← Back to Dashboard
                </button>

                <div className="mt-6 bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-brand-indigo text-white flex items-center justify-center text-xl font-semibold">
                            {(user?.displayName || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="font-heading text-lg font-semibold text-brand-slate-text">
                                {user?.displayName}
                            </p>
                            <p className="text-sm text-brand-slate-secondary">{user?.email}</p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                        {[
                            { label: 'Sessions', value: loading ? '...' : stats?.totalConversations ?? 0 },
                            { label: 'Words Learned', value: loading ? '...' : stats?.vocabularyCount ?? 0 },
                            { label: 'Goal', value: goal || '—' },
                        ].map((item) => (
                            <div key={item.label} className="bg-brand-offwhite rounded-lg p-3 text-center">
                                <p className="text-xs text-brand-slate-secondary">{item.label}</p>
                                <p className="mt-1 text-sm font-semibold text-brand-slate-text truncate">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <p className="text-sm font-medium text-brand-slate-text mb-2">English Level</p>
                        <div className="flex flex-wrap gap-2">
                            {levels.map((l) => (
                                <button
                                    key={l}
                                    onClick={() => handleUpdateLevel(l)}
                                    disabled={saving}
                                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${level === l
                                            ? 'bg-brand-indigo text-white border-brand-indigo'
                                            : 'border-slate-300 text-brand-slate-secondary hover:border-brand-indigo'
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="mt-8 w-full border border-red-200 text-red-600 font-medium py-2.5 rounded-lg hover:bg-red-50 transition text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage