import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTodaysChallenge, evaluateChallenge } from '../services/challengeService'

function ChallengePage() {
    const navigate = useNavigate()
    const prompt = getTodaysChallenge()
    const [answer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    async function handleSubmit() {
        if (!answer.trim()) return
        setLoading(true)
        try {
            const data = await evaluateChallenge(prompt, answer)
            setResult(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
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

                <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Today's Challenge</p>
                    <h1 className="mt-2 font-heading text-xl font-semibold text-slate-900">
                        Write about: "{prompt}"
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Write a short paragraph (aim for 3-5 sentences).
                    </p>

                    {!result && (
                        <>
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                rows={6}
                                className="mt-4 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
                                placeholder="Write your answer here..."
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !answer.trim()}
                                className="mt-4 w-full bg-indigo-700 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-800 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Evaluating...' : 'Submit'}
                            </button>
                        </>
                    )}

                    {result && (
                        <div className="mt-6">
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Grammar', value: result.grammarScore },
                                    { label: 'Vocabulary', value: result.vocabularyScore },
                                    { label: 'Clarity', value: result.clarityScore },
                                ].map((s) => (
                                    <div key={s.label} className="bg-slate-50 rounded-lg p-3 text-center">
                                        <p className="text-xs text-slate-500">{s.label}</p>
                                        <p className="mt-1 text-lg font-semibold text-indigo-700">{s.value}%</p>
                                    </div>
                                ))}
                            </div>

                            {result.whatWentWell?.length > 0 && (
                                <div className="mt-5">
                                    <p className="text-sm font-medium text-emerald-600">What you did well</p>
                                    <ul className="mt-1 space-y-1">
                                        {result.whatWentWell.map((point: string, i: number) => (
                                            <li key={i} className="text-sm text-slate-600">• {point}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {result.improve?.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-amber-600">Improve</p>
                                    <ul className="mt-1 space-y-1">
                                        {result.improve.map((point: string, i: number) => (
                                            <li key={i} className="text-sm text-slate-600">• {point}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <button
                                onClick={() => navigate('/dashboard')}
                                className="mt-6 w-full border border-slate-300 text-slate-700 font-medium py-2.5 rounded-lg hover:border-indigo-400 hover:text-indigo-700 transition-colors"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChallengePage