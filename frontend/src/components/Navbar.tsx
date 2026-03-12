import React from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const auth = React.useContext(AuthContext);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-tr from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 ring-1 ring-white/10 group-hover:scale-105 transition-transform">
                            <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                            FocusedTube
                        </span>
                    </Link>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            <a href="/#features" className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors border border-transparent hover:border-white/10 hover:bg-white/5">Features</a>
                            <a href="/#about" className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors border border-transparent hover:border-white/10 hover:bg-white/5">About</a>
                            
                            {auth?.user ? (
                                <>
                                    <Link to="/search" className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors border border-transparent hover:border-white/10 hover:bg-white/5">
                                        Search
                                    </Link>
                                    <Link to="/profile" className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 ring-1 ring-white/10 hover:scale-105 transition-transform" title="Profile">
                                        {auth.user.name ? auth.user.name.charAt(0).toUpperCase() : <Play className="w-4 h-4" />}
                                    </Link>
                                    <button 
                                        onClick={auth.logout}
                                        className="bg-red-500/15 text-red-200 px-4 py-2 rounded-full text-sm font-bold border border-red-400/30 hover:bg-red-500/25 hover:text-white transition-colors cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors border border-transparent hover:border-white/10 hover:bg-white/5">
                                        Login
                                    </Link>
                                    <Link to="/register" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-purple-700 transition-colors">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

