import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()

    return (
        <nav className="sticky top-0 z-50 bg-brand-offwhite/90 backdrop-blur-sm border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <span className="font-heading text-xl font-semibold text-brand-indigo">
                    FluentBuddy AI
                </span>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-slate-secondary">
                    <a href="#features" className="hover:text-brand-indigo transition">Features</a>
                    <a href="#how-it-works" className="hover:text-brand-indigo transition">How it Works</a>
                    <a href="#about" className="hover:text-brand-indigo transition">About</a>
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/login" className="text-sm font-medium text-brand-slate-text hover:text-brand-indigo transition">
                        Login
                    </Link>
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-brand-indigo text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-indigo-dark transition"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar