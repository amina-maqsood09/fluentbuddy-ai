const steps = ['Practice', 'AI analyzes your response', 'Get feedback', 'Learn from mistakes', 'Track improvement']

function HowItWorks() {
    return (
        <section id="how-it-works" className="bg-white border-y border-slate-200">
            <div className="max-w-6xl mx-auto px-6 py-20">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-brand-slate-text text-center">
                    How it works
                </h2>

                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    {steps.map((step, i) => (
                        <div key={step} className="flex items-center gap-3">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-10 h-10 rounded-full bg-brand-indigo text-white flex items-center justify-center font-medium text-sm">
                                    {i + 1}
                                </div>
                                <p className="mt-2 text-sm text-brand-slate-secondary max-w-[120px]">
                                    {step}
                                </p>
                            </div>
                            {i < steps.length - 1 && (
                                <span className="hidden md:block text-brand-slate-secondary">→</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks