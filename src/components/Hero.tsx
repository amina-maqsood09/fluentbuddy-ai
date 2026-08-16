function Hero() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-slate-text leading-tight">
                Speak. Learn. Improve.
            </h1>
            <p className="mt-4 text-lg text-brand-slate-secondary max-w-xl mx-auto">
                Your personal AI companion for becoming more confident in English.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-brand-indigo text-white font-medium px-6 py-3 rounded-lg hover:bg-brand-indigo-dark transition">
                    Start Learning
                </button>
                <button className="border border-slate-300 text-brand-slate-text font-medium px-6 py-3 rounded-lg hover:border-brand-indigo hover:text-brand-indigo transition">
                    Try AI Conversation
                </button>
            </div>
        </section>
    )
}

export default Hero