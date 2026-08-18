import { MicIcon, SparkleIcon, CheckPencilIcon, BookIcon, TrendingUpIcon } from './icons'

const steps = [
    { label: 'Practice', icon: MicIcon },
    { label: 'AI analyzes your response', icon: SparkleIcon },
    { label: 'Get feedback', icon: CheckPencilIcon },
    { label: 'Learn from mistakes', icon: BookIcon },
    { label: 'Track improvement', icon: TrendingUpIcon },
]

function HowItWorks() {
    return (
        <section id="how-it-works" className="bg-white border-y border-slate-200">
            <div className="max-w-6xl mx-auto px-6 py-20">
                <span className="block text-center text-xs font-semibold tracking-widest uppercase text-indigo-700 mb-3">
                    The process
                </span>
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-slate-900 text-center">
                    How it works
                </h2>

                <div className="relative mt-16 flex flex-col md:flex-row items-start justify-between gap-10 md:gap-4">
                    <div
                        className="hidden md:block absolute top-7 left-0 right-0 h-px bg-slate-200"
                        style={{ marginInline: '2.75rem' }}
                        aria-hidden="true"
                    />

                    {steps.map((step, i) => {
                        const Icon = step.icon
                        return (
                            <div key={step.label} className="relative flex-1 flex flex-col items-center text-center">
                                <div className="relative z-10 w-14 h-14 rounded-full bg-indigo-700 text-white flex items-center justify-center shadow-sm shadow-indigo-700/30">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="mt-2 text-xs font-semibold text-indigo-700">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <p className="mt-1 text-sm text-slate-600 max-w-[130px]">
                                    {step.label}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks