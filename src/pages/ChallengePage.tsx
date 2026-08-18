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
        <div className="min-h-screen bg-brand-offwhite">
            <div className="max-w-2xl mx-auto px-6 py-10">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-sm font-medium text-brand-slate-secondary hover:text-brand-indigo transition"
                >
                    ← Back to Dashboard
                </button>

                <div className="mt-6 bg-white border border-slate-200 rounded-xl p-6">
                    <p className="text-xs font-medium text-brand-amber uppercase">Today's Challenge</p>
                    <h1 className="mt-2 font-heading text-xl font-semibold text-brand-slate-text">
                        Write about: "{prompt}"
                    </h1>
                    <p className="mt-1 text-sm text-brand-slate-secondary">
                        Write a short paragraph (aim for 3-5 sentences).
                    </p>

                    {!result && (
                        <>
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                rows={6}
                                className="mt-4 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-indigo resize-none"
                                placeholder="Write your answer here..."
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !answer.trim()}
                                className="mt-4 w-full bg-brand-indigo text-white font-medium py-2.5 rounded-lg hover:bg-brand-indigo-dark transition disabled:opacity-50"
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
                                    <div key={s.label} className="bg-brand-offwhite rounded-lg p-3 text-center">
                                        <p className="text-xs text-brand-slate-secondary">{s.label}</p>
                                        <p className="mt-1 text-lg font-semibold text-brand-indigo">{s.value}%</p>
                                    </div>
                                ))}
                            </div>

                            {result.whatWentWell?.length > 0 && (
                                <div className="mt-5">
                                    <p className="text-sm font-medium text-brand-success">What you did well</p>
                                    <ul className="mt-1 space-y-1">
                                        {result.whatWentWell.map((point: string, i: number) => (
                                            <li key={i} className="text-sm text-brand-slate-secondary">• {point}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {result.improve?.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-brand-amber">Improve</p>
                                    <ul className="mt-1 space-y-1">
                                        {result.improve.map((point: string, i: number) => (
                                            <li key={i} className="text-sm text-brand-slate-secondary">• {point}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <button
                                onClick={() => navigate('/dashboard')}
                                className="mt-6 w-full border border-slate-300 text-brand-slate-text font-medium py-2.5 rounded-lg hover:border-brand-indigo transition"
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