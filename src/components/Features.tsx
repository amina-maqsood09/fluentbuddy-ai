const features = [
    { title: 'AI Conversation', desc: 'Practice real conversations on topics that matter to you.' },
    { title: 'Grammar Correction', desc: 'Get instant, explained corrections — not just right or wrong.' },
    { title: 'Vocabulary Builder', desc: 'Save and master new words from your own conversations.' },
    { title: 'Progress Tracking', desc: 'See your grammar, vocabulary, and fluency improve over time.' },
    { title: 'Personalized Learning', desc: 'Lessons that adapt to your recurring mistakes.' },
    { title: 'Daily Challenges', desc: 'A short daily task to keep your practice consistent.' },
]

function Features() {
    return (
        <section id="features" className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-brand-slate-text text-center">
                Everything you need to improve
            </h2>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((f) => (
                    <div
                        key={f.title}
                        className="bg-white border border-slate-200 rounded-xl p-6 hover:border-brand-indigo transition"
                    >
                        <h3 className="font-heading font-semibold text-brand-slate-text">
                            {f.title}
                        </h3>
                        <p className="mt-2 text-sm text-brand-slate-secondary">
                            {f.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Features