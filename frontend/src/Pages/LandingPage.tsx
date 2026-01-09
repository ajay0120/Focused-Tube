import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-900 selection:text-white">
            <Navbar />
            <main>
                <Hero />
                <Features />
                {/* Additional sections like 'How it works' or 'About' can go here */}
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
