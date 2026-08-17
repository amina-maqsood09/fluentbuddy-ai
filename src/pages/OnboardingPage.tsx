import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'

const goals = ['Everyday conversation', 'University', 'Job interviews', 'Professional communication', 'Travel', 'General improvement']
const levels = ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced']

function OnboardingPage() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [goal, setGoal] = useState('')
    const [level, setLevel] = useState('')
    const [learningGoal, setLearningGoal] = useState('')
    const [saving, setSaving] = useState(false)

    async function handleFinish() {
        const user = auth.currentUser
        if (!user) {
            navigate('/login')
            return
        }
        setSaving(true)
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                englishGoal: goal,
                englishLevel: level,
                learningGoal,
            })
            navigate('/dashboard')
        } catch (err) {
            console.error(err)
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-brand-offwhite flex items-center justify-center px-6">
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-8">
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-brand-indigo' : 'bg-slate-200'}`}
                        />
                    ))}
                </div>

                {step === 1 && (
                    <div>
                        <h2 className="font-heading text-xl font-semibold text-brand-slate-text">
                            What is your English goal?
                        </h2>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {goals.map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setGoal(g)}
                                    className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition ${goal === g
                                            ? 'border-brand-indigo bg-brand-indigo/5 text-brand-indigo'
                                            : 'border-slate-200 text-brand-slate-text hover:border-brand-indigo'
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            disabled={!goal}
                            className="mt-8 w-full bg-brand-indigo text-white font-medium py-2.5 rounded-lg hover:bg-brand-indigo-dark transition disabled:opacity-40"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className="font-heading text-xl font-semibold text-brand-slate-text">
                            What is your English level?
                        </h2>
                        <div className="mt-6 flex flex-col gap-3">
                            {levels.map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLevel(l)}
                                    className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition ${level === l
                                            ? 'border-brand-indigo bg-brand-indigo/5 text-brand-indigo'
                                            : 'border-slate-200 text-brand-slate-text hover:border-brand-indigo'
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="px-4 py-2.5 rounded-lg border border-slate-300 text-brand-slate-text font-medium hover:border-brand-indigo transition"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!level}
                                className="flex-1 bg-brand-indigo text-white font-medium py-2.5 rounded-lg hover:bg-brand-indigo-dark transition disabled:opacity-40"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h2 className="font-heading text-xl font-semibold text-brand-slate-text">
                            What is your learning goal?
                        </h2>
                        <p className="mt-1 text-sm text-brand-slate-secondary">
                            e.g. "I want to become more confident speaking English."
                        </p>
                        <textarea
                            value={learningGoal}
                            onChange={(e) => setLearningGoal(e.target.value)}
                            rows={4}
                            className="mt-4 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-indigo resize-none"
                            placeholder="Write your goal here..."
                        />
                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setStep(2)}
                                className="px-4 py-2.5 rounded-lg border border-slate-300 text-brand-slate-text font-medium hover:border-brand-indigo transition"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleFinish}
                                disabled={!learningGoal || saving}
                                className="flex-1 bg-brand-indigo text-white font-medium py-2.5 rounded-lg hover:bg-brand-indigo-dark transition disabled:opacity-40"
                            >
                                {saving ? 'Saving...' : 'Finish'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OnboardingPage