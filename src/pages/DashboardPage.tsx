import { logOut } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function DashboardPage() {
    const navigate = useNavigate()
    const { user } = useAuth()

    async function handleLogout() {
        await logOut()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-brand-offwhite">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                    <h1 className="font-heading text-2xl font-semibold text-brand-slate-text">
                        Good to see you, {user?.displayName || 'there'} 👋
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-brand-slate-secondary hover:text-brand-indigo transition"
                    >
                        Logout
                    </button>
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Current Level', value: '—' },
                        { label: 'Learning Streak', value: '0 days' },
                        { label: 'Vocabulary', value: '0 words' },
                        { label: 'Grammar Accuracy', value: '—' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-5">
                            <p className="text-xs text-brand-slate-secondary">{stat.label}</p>
                            <p className="mt-1 text-xl font-semibold text-brand-slate-text">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => navigate('/topics')}
                    className="mt-10 bg-brand-indigo text-white font-medium px-6 py-3 rounded-lg hover:bg-brand-indigo-dark transition"
                >
                    💬 Start Conversation
                </button>
            </div>
        </div>
    )
}

export default DashboardPage