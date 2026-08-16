import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

function LandingPage() {
    return (
        <div className="min-h-screen bg-brand-offwhite">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Footer />
        </div>
    )
}

export default LandingPage