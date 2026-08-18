import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()

    return (
        <nav className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/70" aria-label="Main navigation">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <span className="flex items-center gap-2 font-heading text-xl font-semibold text-slate-900">
                    <span className="flex items-end gap-[3px] h-4" aria-hidden="true">
                        <span className="w-[3px] h-2 rounded-full bg-indigo-700" />
                        <span className="w-[3px] h-4 rounded-full bg-indigo-700" />
                        <span className="w-[3px] h-2.5 rounded-full bg-indigo-700" />
                    </span>
                    FluentBuddy <span className="text-indigo-700">AI</span>
                </span>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <a href="#features" className="hover:text-indigo-700 transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-indigo-700 transition-colors">How it Works</a>
                    <a href="#about" className="hover:text-indigo-700 transition-colors">About</a>
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/login" className="text-sm font-medium text-slate-900 hover:text-indigo-700 transition-colors">
                        Login
                    </Link>
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar