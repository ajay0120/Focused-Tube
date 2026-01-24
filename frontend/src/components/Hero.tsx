import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Hero: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="relative overflow-hidden bg-black text-white pt-20 pb-24 lg:pt-32 lg:pb-36">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[30%] -right-[10%] w-[70rem] h-[70rem] bg-purple-900/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-[30%] -left-[10%] w-[70rem] h-[70rem] bg-blue-900/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up">
                    <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
                    <span className="text-sm font-medium text-gray-300">AI-Powered Production System</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                    Take Control of <br /> Your Viewing Experience.
                </h1>

                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10">
                    AI-driven filtering and recommendations to prioritize your productivity and digital well-being. Stop the scroll, start the growth.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        onClick={() => navigate('/search')}
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-all transform hover:scale-105"
                    >
                        Get Started <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => {
                            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-white/10 border border-white/10 rounded-full hover:bg-white/20 transition-all"
                    >
                        Learn More
                    </button>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-white/10 bg-white/5 rounded-2xl backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-blue-500/10 rounded-xl mb-3">
                            <Zap className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold">Strict Filtering</h3>
                        <p className="text-gray-400 text-sm">NLP-based distraction removal</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-purple-500/10 rounded-xl mb-3">
                            <ShieldCheck className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold">Digital Well-being</h3>
                        <p className="text-gray-400 text-sm">Track & control screen time</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-green-500/10 rounded-xl mb-3">
                            <Zap className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold">Hybrid-Rec Engine</h3>
                        <p className="text-gray-400 text-sm">Relevance over engagement</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
