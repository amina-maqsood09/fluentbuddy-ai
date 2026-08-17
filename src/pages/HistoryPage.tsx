import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserConversations } from '../services/statsService'

function HistoryPage() {
    const navigate = useNavigate()
    const [conversations, setConversations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getUserConversations()
            .then(setConversations)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    function formatDate(iso: string) {
        const date = new Date(iso)
        return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
    }

    function mistakeCount(conv: any) {
        return (conv.messages || []).filter((m: any) => m.correction?.hasMistake).length
    }

    return (
        <div className="min-h-screen bg-brand-offwhite">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-sm font-medium text-brand-slate-secondary hover:text-brand-indigo transition"
                >
                    ← Back to Dashboard
                </button>

                <h1 className="font-heading text-2xl font-semibold text-brand-slate-text mt-4">
                    Learning History
                </h1>

                {loading && (
                    <p className="mt-6 text-sm text-brand-slate-secondary">Loading...</p>
                )}

                {!loading && conversations.length === 0 && (
                    <div className="mt-8 bg-white border border-slate-200 rounded-xl p-8 text-center">
                        <p className="text-brand-slate-secondary text-sm">
                            No conversations yet. Start practicing to see your history here.
                        </p>
                        <button
                            onClick={() => navigate('/topics')}
                            className="mt-4 bg-brand-indigo text-white font-medium px-5 py-2.5 rounded-lg hover:bg-brand-indigo-dark transition"
                        >
                            Start Conversation
                        </button>
                    </div>
                )}

                <div className="mt-6 space-y-3">
                    {conversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => navigate(`/history/${conv.id}`)}
                            className="w-full text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-brand-indigo transition flex items-center justify-between"
                        >
                            <div>
                                <p className="font-medium text-brand-slate-text">{conv.topic}</p>
                                <p className="text-xs text-brand-slate-secondary mt-1">
                                    {formatDate(conv.createdAt)} · {(conv.messages || []).length} messages
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-brand-slate-secondary">Mistakes found</p>
                                <p className="text-sm font-medium text-brand-slate-text">{mistakeCount(conv)}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default HistoryPage