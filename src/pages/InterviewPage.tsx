import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getInterviewQuestion, evaluateInterview } from '../services/interviewService'

interface Turn {
    question: string
    answer?: string
}

function InterviewPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const interviewType = searchParams.get('type') || 'General HR'

    const [turns, setTurns] = useState<Turn[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(true)
    const [evaluating, setEvaluating] = useState(false)
    const [result, setResult] = useState<any>(null)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        getInterviewQuestion(interviewType, '')
            .then((data) => setTurns([{ question: data.question }]))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false))
    }, [interviewType])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [turns])

    function buildHistory(allTurns: Turn[]) {
        return allTurns
            .map((t) => `Q: ${t.question}${t.answer ? `\nA: ${t.answer}` : ''}`)
            .join('\n\n')
    }

    async function handleAnswer() {
        if (!input.trim() || loading) return

        const updatedTurns = [...turns]
        updatedTurns[updatedTurns.length - 1].answer = input
        setTurns(updatedTurns)
        setInput('')
        setLoading(true)

        try {
            const data = await getInterviewQuestion(interviewType, buildHistory(updatedTurns), input)
            setTurns([...updatedTurns, { question: data.question }])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleFinish() {
        setEvaluating(true)
        try {
            const finished = turns.filter((t) => t.answer)
            const data = await evaluateInterview(interviewType, buildHistory(finished))
            setResult(data)
        } catch (err) {
            console.error(err)
        } finally {
            setEvaluating(false)
        }
    }

    const answeredCount = turns.filter((t) => t.answer).length

    if (result) {
        return (
            <div className="min-h-screen bg-brand-offwhite flex items-center justify-center px-6">
                <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-8">
                    <h2 className="font-heading text-xl font-semibold text-brand-slate-text">Interview Feedback</h2>
                    <p className="text-sm text-brand-slate-secondary mt-1">{interviewType}</p>

                    <table className="w-full mt-6 text-sm">
                        <tbody>
                            {[
                                ['Grammar', result.grammarScore],
                                ['Vocabulary', result.vocabularyScore],
                                ['Clarity', result.clarityScore],
                                ['Confidence', result.confidenceScore],
                            ].map(([label, val]) => (
                                <tr key={label as string} className="border-b border-slate-100">
                                    <td className="py-2 text-brand-slate-secondary">{label}</td>
                                    <td className="py-2 text-right font-medium text-brand-indigo">{val}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {result.whatWentWell?.length > 0 && (
                        <div className="mt-5">
                            <p className="text-sm font-medium text-brand-success">What you did well</p>
                            <ul className="mt-1 space-y-1">
                                {result.whatWentWell.map((p: string, i: number) => (
                                    <li key={i} className="text-sm text-brand-slate-secondary">• {p}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {result.improve?.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-brand-amber">Improve</p>
                            <ul className="mt-1 space-y-1">
                                {result.improve.map((p: string, i: number) => (
                                    <li key={i} className="text-sm text-brand-slate-secondary">• {p}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-6 w-full bg-brand-indigo text-white font-medium py-2.5 rounded-lg hover:bg-brand-indigo-dark transition"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-brand-offwhite flex flex-col">
            <div className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
                <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-brand-slate-secondary hover:text-brand-indigo transition">
                    ← Exit
                </button>
                <span className="text-sm font-medium text-brand-slate-text">{interviewType} Interview</span>
                <button
                    onClick={handleFinish}
                    disabled={answeredCount === 0 || evaluating}
                    className="text-sm font-medium text-brand-amber hover:underline disabled:opacity-40"
                >
                    {evaluating ? 'Evaluating...' : 'Finish & Get Feedback'}
                </button>
            </div>

            <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-6 space-y-4 overflow-y-auto">
                {turns.map((turn, i) => (
                    <div key={i} className="space-y-3">
                        <div className="flex justify-start">
                            <div className="max-w-[80%] bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-brand-slate-text">
                                {turn.question}
                            </div>
                        </div>
                        {turn.answer && (
                            <div className="flex justify-end">
                                <div className="max-w-[80%] bg-brand-indigo text-white rounded-xl px-4 py-2.5 text-sm">
                                    {turn.answer}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-brand-slate-secondary">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="border-t border-slate-200 bg-white px-6 py-4">
                <div className="max-w-3xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAnswer()}
                        placeholder="Type your answer..."
                        className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-indigo"
                    />
                    <button
                        onClick={handleAnswer}
                        disabled={loading}
                        className="bg-brand-indigo text-white font-medium px-5 py-2.5 rounded-lg hover:bg-brand-indigo-dark transition disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InterviewPage