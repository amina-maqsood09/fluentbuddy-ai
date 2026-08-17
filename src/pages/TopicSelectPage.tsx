import { useNavigate } from 'react-router-dom'
import { logOut } from '../services/authService'

const topics = [
    'Daily Life', 'University', 'Friends', 'Travel',
    'Technology', 'Job Interview', 'Workplace', 'Free Conversation',
]

function TopicSelectPage() {
    const navigate = useNavigate()

    function selectTopic(topic: string) {
        navigate(`/chat?topic=${encodeURIComponent(topic)}`)
    }

    return (
        <div className="min-h-screen bg-brand-offwhite">
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm font-medium text-brand-slate-secondary hover:text-brand-indigo transition"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <h1 className="font-heading text-2xl font-semibold text-brand-slate-text text-center">
                    What do you want to talk about?
                </h1>
                <p className="mt-2 text-sm text-brand-slate-secondary text-center">
                    Pick a topic to start practicing
                </p>

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {topics.map((topic) => (
                        <button
                            key={topic}
                            onClick={() => selectTopic(topic)}
                            className="bg-white border border-slate-200 rounded-xl p-5 text-sm font-medium text-brand-slate-text hover:border-brand-indigo hover:text-brand-indigo transition text-center"
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TopicSelectPage