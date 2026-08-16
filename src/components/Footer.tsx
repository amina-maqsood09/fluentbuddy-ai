function Footer() {
    return (
        <footer id="about" className="max-w-6xl mx-auto px-6 py-10 text-center">
            <p className="text-sm text-brand-slate-secondary">
                © {new Date().getFullYear()} FluentBuddy AI — built as an AI/ML capstone project.
            </p>
        </footer>
    )
}

export default Footer