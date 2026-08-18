import { useState, useEffect } from 'react'
import { logOut } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getUserStats, getUserConversations, type UserStats } from '../services/statsService'
import { getWeaknessPatterns, getTopWeakness, type WeaknessPattern } from '../services/weaknessService'
import { generateProgressReport } from '../services/pdfService'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TargetIcon, ChatIcon, BookIcon, ChartIcon, FlameIcon, BriefcaseIcon } from '../components/icons'
import MascotCharacter from '../components/MascotCharacter'

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

    const statCards = [
        { label: 'Current Level', value: level, icon: TargetIcon },
        { label: 'Conversations', value: loading ? '...' : stats?.totalConversations ?? 0, icon: ChatIcon },
        { label: 'Vocabulary', value: loading ? '...' : `${stats?.vocabularyCount ?? 0} words`, icon: BookIcon },
        { label: 'Grammar Accuracy', value: loading ? '...' : `${accuracyPercent}%`, icon: ChartIcon },
    ]

    const buttonStyles = {
        primary:
            'bg-indigo-700 text-white shadow-lg shadow-indigo-700/25 hover:bg-indigo-800 hover:shadow-xl hover:shadow-indigo-700/30 hover:-translate-y-1',
        accent:
            'bg-white text-amber-700 border border-amber-300 shadow-sm hover:bg-amber-50 hover:shadow-md hover:-translate-y-1',
        outline:
            'bg-white text-slate-700 border border-slate-200 shadow-sm hover:border-indigo-300 hover:text-indigo-700 hover:shadow-md hover:-translate-y-1',
    }

    const actionButtons = [
        {
            label: 'Start Conversation',
            icon: ChatIcon,
            onClick: () => navigate('/topics'),
            variant: 'primary' as const,
            iconBg: 'bg-white/15',
        },
        {
            label: 'Daily Challenge',
            icon: FlameIcon,
            onClick: () => navigate('/challenge'),
            variant: 'accent' as const,
            iconBg: 'bg-amber-50',
        },
        {
            label: 'Interview Mode',
            icon: BriefcaseIcon,
            onClick: () => navigate('/interview-select'),
            variant: 'outline' as const,
            iconBg: 'bg-indigo-50',
        },
    ]

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200/70">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-heading font-semibold text-lg shrink-0">
                            {(user?.displayName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="font-heading text-2xl font-semibold text-slate-900">
                                Good to see you, {user?.displayName || 'there'} <span className="inline-block">👋</span>
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">Here's how your practice is going.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                        <button
                            onClick={() => navigate('/profile')}
                            className="text-sm font-medium text-slate-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                            Profile
                        </button>
                        <button
                            onClick={handleDownloadReport}
                            disabled={loading}
                            className="text-sm font-medium text-slate-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-40"
                        >
                            Download Report
                        </button>
                        <button
                            onClick={() => navigate('/history')}
                            className="text-sm font-medium text-slate-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                            History
                        </button>
                        <div className="w-px h-5 bg-slate-200 mx-1" />
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statCards.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={stat.label}
                                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:shadow-slate-900/5 hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700">
                                    <Icon className="w-4 h-4" />
                                </div>
                                <p className="mt-3 text-xs font-medium text-slate-500">{stat.label}</p>
                                <p className="mt-1 text-xl font-heading font-semibold text-slate-900">{stat.value}</p>
                            </div>
                        )
                    })}
                </div>

                {!loading && topWeakness && (
                    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-amber-700">Recurring weakness detected</p>
                                <p className="mt-1 text-lg font-heading font-semibold text-slate-900">
                                    You frequently make mistakes with <span className="text-amber-600">{topWeakness.topic}</span>
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    Found in {topWeakness.count} of your recent messages. Let's practice this topic today.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/topics?focus=${encodeURIComponent(topWeakness.topic)}`)}
                            className="mt-4 bg-amber-500 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-amber-600 transition-colors text-sm"
                        >
                            Practice this now
                        </button>

                        {weaknesses.length > 1 && (
                            <div className="mt-4 pt-4 border-t border-amber-200/60 flex flex-wrap gap-2">
                                {weaknesses.slice(1, 5).map((w) => (
                                    <span key={w.topic} className="text-xs bg-white text-slate-600 px-2.5 py-1 rounded-full border border-amber-200/60">
                                        {w.topic} · {w.count}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {!loading && chartData.length > 1 && (
                    <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6">
                        <p className="text-sm font-medium text-slate-900 mb-4">
                            Mistakes per conversation (recent sessions)
                        </p>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="mistakeFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4338CA" stopOpacity={0.25} />
                                        <stop offset="100%" stopColor="#4338CA" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} allowDecimals={false} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="mistakes"
                                    stroke="#4338CA"
                                    strokeWidth={2.5}
                                    fill="url(#mistakeFill)"
                                    dot={{ fill: '#4338CA', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {!loading && chartData.length <= 1 && (
                    <div className="mt-6 bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center">
                        <p className="text-sm text-slate-500">
                            Complete a couple more conversations to see your mistake trend here.
                        </p>
                    </div>
                )}

                <div className="mt-6 flex flex-wrap gap-4">
                    {actionButtons.map((btn) => {
                        const Icon = btn.icon
                        return (
                            <button
                                key={btn.label}
                                onClick={btn.onClick}
                                className={`group flex items-center gap-3 font-semibold pl-4 pr-6 py-3.5 rounded-2xl transition-all duration-200 ${buttonStyles[btn.variant]}`}
                            >
                                <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${btn.iconBg}`}>
                                    <Icon className="w-[18px] h-[18px]" />
                                </span>
                                {btn.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Peeking mascot, bottom-right corner */}
            <div className="fixed bottom-0 right-8 md:right-16 pointer-events-none translate-y-[20%] z-0">
                <MascotCharacter className="w-28 md:w-36 opacity-95 drop-shadow-lg" />
            </div>
        </div>
    )
}

export default DashboardPage