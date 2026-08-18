import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MascotCharacter from './MascotCharacter'

const WAVE_BARS = [
    { h: 14, delay: '0s' },
    { h: 24, delay: '0.15s' },
    { h: 36, delay: '0.3s' },
    { h: 48, delay: '0.1s' },
    { h: 30, delay: '0.4s' },
    { h: 42, delay: '0.2s' },
    { h: 20, delay: '0.5s' },
    { h: 32, delay: '0.05s' },
]

const DEMO_EXAMPLES = [
    {
        userLine: 'I am go to market yesterday',
        aiReply: 'Nice! What did you buy there?',
        corrected: 'I went to the market yesterday.',
        highlight: 'went',
        note: 'Use past tense "went" for completed actions.',
    },
    {
        userLine: 'Where you are going tomorrow?',
        aiReply: "Sounds exciting! Tell me more.",
        corrected: 'Where are you going tomorrow?',
        highlight: 'are',
        note: 'In questions, the verb comes before the subject.',
    },
    {
        userLine: 'I am interested on this topic',
        aiReply: "Great! Let's explore it together.",
        corrected: 'I am interested in this topic.',
        highlight: 'in',
        note: 'Use "interested in", not "interested on".',
    },
    {
        userLine: 'She is a honest person',
        aiReply: "That's a wonderful quality to have.",
        corrected: 'She is an honest person.',
        highlight: 'an',
        note: '"Honest" starts with a vowel sound, so use "an".',
    },
]

function Hero() {
    const navigate = useNavigate()
    const [activeIndex, setActiveIndex] = useState(0)
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false)
            setTimeout(() => {
                setActiveIndex((prev) => (prev + 1) % DEMO_EXAMPLES.length)
                requestAnimationFrame(() => setVisible(true))
            }, 400)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    const scrollToDemo = () => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
    }

    const example = DEMO_EXAMPLES[activeIndex]

    return (
        <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 overflow-hidden">
            <div
                className="wave-bar pointer-events-none absolute inset-x-0 top-4 flex justify-center gap-2.5 opacity-30"
                aria-hidden="true"
            >
                {WAVE_BARS.map((bar, i) => (
                    <span
                        key={i}
                        className="wave-bar w-2 rounded-full bg-gradient-to-t from-indigo-700 to-indigo-400 origin-center"
                        style={{
                            height: `${bar.h}px`,
                            animation: 'wave-pulse 1.6s ease-in-out infinite',
                            animationDelay: bar.delay,
                        }}
                    />
                ))}
            </div>

            <div className="relative text-center">
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full mb-6">
                    AI-powered conversation practice
                </span>

                <h1 className="font-heading text-5xl md:text-6xl font-semibold text-slate-900 leading-[1.05] tracking-tight">
                    Speak. Learn. Improve.
                </h1>
                <p className="mt-5 text-lg text-slate-600 max-w-xl mx-auto">
                    Your personal AI companion for becoming more confident in English.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-indigo-700 text-white font-medium px-7 py-3.5 rounded-xl shadow-md shadow-indigo-700/25 hover:bg-indigo-800 transition-all"
                    >
                        Start Learning
                    </button>
                    <button
                        onClick={scrollToDemo}
                        className="border border-slate-300 text-slate-900 font-medium px-7 py-3.5 rounded-xl hover:border-indigo-700 hover:text-indigo-700 transition-colors"
                    >
                        See how it works
                    </button>
                </div>
            </div>

            {/* Mascot + chat preview, side by side on desktop */}
            <div className="relative mt-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
                <button
                    onClick={() => navigate('/signup')}
                    className="relative group shrink-0 cursor-pointer bg-transparent border-none p-0"
                    aria-label="Start learning with FluentBuddy"
                >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-md shadow-slate-900/5 text-xs font-medium text-slate-700 whitespace-nowrap group-hover:border-indigo-300 transition-colors z-10">
                        Hi! Ready to practice? 👋
                        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45" />
                    </div>
                    <MascotCharacter className="w-40 md:w-48 group-hover:scale-105 transition-transform" />
                </button>

                <div className="w-full max-w-md">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/5 p-5 text-left min-h-[260px]">
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-medium text-slate-500">Live practice session</span>
                            </div>
                            <div className="flex gap-1">
                                {DEMO_EXAMPLES.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIndex ? 'bg-indigo-600' : 'bg-slate-200'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="relative overflow-hidden">
                            <div
                                className="transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: visible ? 'translateX(0)' : 'translateX(-30px)',
                                    opacity: visible ? 1 : 0,
                                }}
                            >
                                <div className="flex justify-end mb-3">
                                    <div className="bg-indigo-700 text-white text-sm rounded-2xl rounded-br-sm px-4 py-2 max-w-[85%]">
                                        {example.userLine}
                                    </div>
                                </div>

                                <div className="flex justify-start mb-3">
                                    <div className="bg-slate-100 text-slate-800 text-sm rounded-2xl rounded-bl-sm px-4 py-2 max-w-[85%]">
                                        {example.aiReply}
                                    </div>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                    <p className="text-xs font-medium text-amber-700 mb-1">Better version</p>
                                    <p className="text-sm text-slate-800">
                                        "{example.corrected.split(example.highlight)[0]}
                                        <span className="text-emerald-600 font-medium">{example.highlight}</span>
                                        {example.corrected.split(example.highlight)[1]}"
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1.5">
                                        {example.note}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero