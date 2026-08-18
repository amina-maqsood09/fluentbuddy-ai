import { useState, useEffect } from 'react'
import { logOut } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getUserStats, getUserConversations, type UserStats } from '../services/statsService'
import { getWeaknessPatterns, getTopWeakness, type WeaknessPattern } from '../services/weaknessService'
import { generateProgressReport } from '../services/pdfService'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function DashboardPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [stats, setStats] = useState<UserStats | null>(null)
    const [level, setLevel] = useState('—')
    const [chartData, setChartData] = useState<{ name: string; mistakes: number }[]>([])
    const [weaknesses, setWeaknesses] = useState<WeaknessPattern[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            if (!user) return
            try {
                const [userStats, userDoc, conversations, weaknessData] = await Promise.all([
                    getUserStats(),
                    getDoc(doc(db, 'users', user.uid)),
                    getUserConversations(),
                    getWeaknessPatterns(),
                ])
                setStats(userStats)
                setLevel(userDoc.data()?.englishLevel || '—')
                setWeaknesses(weaknessData)

                const sorted = [...conversations].reverse()
                const data = sorted.slice(-8).map((conv, i) => ({
                    name: `#${i + 1}`,
                    mistakes: (conv.messages || []).filter((m: any) => m.correction?.hasMistake).length,
                }))
                setChartData(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [user])

    async function handleLogout() {
        await logOut()
        navigate('/login')
    }

    function handleDownloadReport() {
        if (!stats) return
        generateProgressReport(user?.displayName || 'Student', level, stats, weaknesses)
    }

    const accuracyPercent =
        stats && stats.totalConversations > 0 ? Math.max(0, 100 - stats.totalMistakes * 3) : 0

    const topWeakness = getTopWeakness(weaknesses)

    return (
        <div className="min-h-screen bg-brand-offwhite">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                    <h1 className="font-heading text-2xl font-semibold text-brand-slate-text">
                        Good to see you, {user?.displayName || 'there'} 👋
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleDownloadReport}
                            disabled={loading}
                            className="text-sm font-medium text-brand-slate-secondary hover:text-brand-indigo transition disabled:opacity-40"
                        >
                            📄 Download Report
                        </button>
                        <button
                            onClick={() => navigate('/history')}
                            className="text-sm font-medium text-brand-slate-secondary hover:text-brand-indigo transition"
                        >
                            History
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-brand-slate-secondary hover:text-brand-indigo transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Current Level', value: level },
                        { label: 'Conversations', value: loading ? '...' : stats?.totalConversations ?? 0 },
                        { label: 'Vocabulary', value: loading ? '...' : `${stats?.vocabularyCount ?? 0} words` },
                        { label: 'Grammar Accuracy', value: loading ? '...' : `${accuracyPercent}%` },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-5">
                            <p className="text-xs text-brand-slate-secondary">{stat.label}</p>
                            <p className="mt-1 text-xl font-semibold text-brand-slate-text">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {!loading && topWeakness && (
                    <div className="mt-8 bg-white border border-brand-amber/40 rounded-xl p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-brand-slate-secondary">Recurring weakness detected</p>
                                <p className="mt-1 text-lg font-semibold text-brand-slate-text">
                                    You frequently make mistakes with <span className="text-brand-amber">{topWeakness.topic}</span>
                                </p>
                                <p className="mt-1 text-sm text-brand-slate-secondary">
                                    Found in {topWeakness.count} of your recent messages. Let's practice this topic today.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/topics?focus=${encodeURIComponent(topWeakness.topic)}`)}
                            className="mt-4 bg-brand-amber text-white font-medium px-5 py-2.5 rounded-lg hover:bg-amber-600 transition text-sm"
                        >
                            Practice this now
                        </button>

                        {weaknesses.length > 1 && (
                            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                                {weaknesses.slice(1, 5).map((w) => (
                                    <span key={w.topic} className="text-xs bg-slate-100 text-brand-slate-secondary px-2.5 py-1 rounded-full">
                                        {w.topic} · {w.count}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {!loading && chartData.length > 1 && (
                    <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6">
                        <p className="text-sm font-medium text-brand-slate-text mb-4">
                            Mistakes per conversation (recent sessions)
                        </p>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} allowDecimals={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="mistakes" stroke="#4338CA" strokeWidth={2} dot={{ fill: '#4338CA' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate('/topics')}
                        className="bg-brand-indigo text-white font-medium px-6 py-3 rounded-lg hover:bg-brand-indigo-dark transition"
                    >
                        💬 Start Conversation
                    </button>
                    <button
                        onClick={() => navigate('/challenge')}
                        className="border border-brand-amber text-brand-amber font-medium px-6 py-3 rounded-lg hover:bg-amber-50 transition"
                    >
                        🎯 Daily Challenge
                    </button>
                    <button
                        onClick={() => navigate('/interview-select')}
                        className="border border-slate-300 text-brand-slate-text font-medium px-6 py-3 rounded-lg hover:border-brand-indigo hover:text-brand-indigo transition"
                    >
                        💼 Interview Mode
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage