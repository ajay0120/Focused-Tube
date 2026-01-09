import React, { useContext } from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const auth = React.useContext(AuthContext);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-gradient-to-tr from-purple-600 to-blue-600 p-2 rounded-lg">
                            <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            FocusedTube
                        </span>
                    </Link>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-8">
                            <a href="/#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
                            <a href="/#about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">About</a>
                            
                            {auth?.user ? (
                                <>
                                    <Link to="/search" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        Search
                                    </Link>
                                    <Link to="/profile" className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold hover:scale-105 transition-transform" title="Profile">
                                        {auth.user.name ? auth.user.name.charAt(0).toUpperCase() : <Play className="w-4 h-4" />}
                                    </Link>
                                    <button 
                                        onClick={auth.logout}
                                        className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-red-700 transition-colors cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        Login
                                    </Link>
                                    <Link to="/register" className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
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
