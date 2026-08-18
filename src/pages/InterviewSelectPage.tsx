import { useNavigate } from 'react-router-dom'

const types = ['Software Engineering', 'Frontend Developer', 'Internship', 'General HR']

function InterviewSelectPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-brand-offwhite">
            <div className="max-w-2xl mx-auto px-6 py-10">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-sm font-medium text-brand-slate-secondary hover:text-brand-indigo transition"
                >
                    ← Back to Dashboard
                </button>

                <h1 className="font-heading text-2xl font-semibold text-brand-slate-text text-center mt-6">
                    Choose interview type
                </h1>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    {types.map((type) => (
                        <button
                            key={type}
                            onClick={() => navigate(`/interview?type=${encodeURIComponent(type)}`)}
                            className="bg-white border border-slate-200 rounded-xl p-6 text-sm font-medium text-brand-slate-text hover:border-brand-indigo hover:text-brand-indigo transition text-center"
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default InterviewSelectPage