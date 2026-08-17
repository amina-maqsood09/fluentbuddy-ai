import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import type { Message } from '../types/chat'

function HistoryDetailPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [conversation, setConversation] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        getDoc(doc(db, 'conversations', id))
            .then((snap) => {
                if (snap.exists()) setConversation({ id: snap.id, ...snap.data() })
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-offwhite flex items-center justify-center">
                <p className="text-sm text-brand-slate-secondary">Loading...</p>
            </div>
        )
    }

    if (!conversation) {
        return (
            <div className="min-h-screen bg-brand-offwhite flex items-center justify-center">
                <p className="text-sm text-brand-slate-secondary">Conversation not found.</p>
            </div>
        )
    }

    const messages: Message[] = conversation.messages || []

    return (
        <div className="min-h-screen bg-brand-offwhite">
            <div className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => navigate('/history')}
                    className="text-sm font-medium text-brand-slate-secondary hover:text-brand-indigo transition"
                >
                    ← Back to History
                </button>
                <span className="text-sm font-medium text-brand-slate-text">{conversation.topic}</span>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id}>
                        <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm ${msg.sender === 'user'
                                        ? 'bg-brand-indigo text-white'
                                        : 'bg-white border border-slate-200 text-brand-slate-text'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>

                        {msg.correction?.hasMistake && (
                            <div className="mt-2 max-w-[80%] bg-amber-50 border border-brand-amber/30 rounded-lg p-3 text-xs">
                                {msg.correction.lessonTitle && (
                                    <span className="inline-block bg-brand-amber/20 text-amber-800 font-medium px-2 py-0.5 rounded mb-2">
                                        📘 {msg.correction.lessonTitle}
                                    </span>
                                )}
                                <p className="text-brand-slate-secondary">Your sentence</p>
                                <p className="text-brand-slate-text mt-0.5">{msg.correction.original}</p>
                                <p className="text-brand-slate-secondary mt-2">Better version</p>
                                <p className="text-brand-success font-medium mt-0.5">{msg.correction.corrected}</p>
                                <p className="text-brand-slate-secondary mt-2">{msg.correction.explanation}</p>
                            </div>
                        )}

                        {msg.newVocabulary && msg.newVocabulary.length > 0 && (
                            <div className="mt-2 max-w-[80%] flex flex-wrap gap-2">
                                {msg.newVocabulary.map((v) => (
                                    <div key={v.word} className="bg-indigo-50 border border-brand-indigo/20 rounded-lg px-3 py-2 text-xs">
                                        <span className="font-medium text-brand-indigo">{v.word}</span>
                                        <span className="text-brand-slate-secondary"> — {v.meaning}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HistoryDetailPage