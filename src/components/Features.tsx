import { ChatIcon, CheckPencilIcon, BookIcon, ChartIcon, TargetIcon, FlameIcon } from './icons'

const features = [
    { title: 'AI Conversation', desc: 'Practice real conversations on topics that matter to you.', icon: ChatIcon },
    { title: 'Grammar Correction', desc: 'Get instant, explained corrections — not just right or wrong.', icon: CheckPencilIcon },
    { title: 'Vocabulary Builder', desc: 'Save and master new words from your own conversations.', icon: BookIcon },
    { title: 'Progress Tracking', desc: 'See your grammar, vocabulary, and fluency improve over time.', icon: ChartIcon },
    { title: 'Personalized Learning', desc: 'Lessons that adapt to your recurring mistakes.', icon: TargetIcon },
    { title: 'Daily Challenges', desc: 'A short daily task to keep your practice consistent.', icon: FlameIcon },
]

function Features() {
    return (
        <section id="features" className="max-w-6xl mx-auto px-6 py-20">
            <span className="block text-center text-xs font-semibold tracking-widest uppercase text-indigo-700 mb-3">
                Features
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-slate-900 text-center">
                Everything you need to improve
            </h2>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((f) => {
                    const Icon = f.icon
                    return (
                        <div
                            key={f.title}
                            className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-700/5 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 group-hover:bg-indigo-700 group-hover:text-white transition-colors duration-200">
                                <Icon className="w-5 h-5" />
                            </div>
                            <h3 className="mt-4 font-heading font-semibold text-slate-900">
                                {f.title}
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default Features