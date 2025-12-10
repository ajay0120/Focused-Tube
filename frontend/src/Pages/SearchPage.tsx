import React from 'react';
import Navbar from '../components/Navbar';
import { Search } from 'lucide-react';

const SearchPage = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8 mt-16">
                 <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Find Focused Content
                    </h1>
                    <p className="text-gray-400 text-lg mb-8">
                        Search for educational videos without the distractions.
                    </p>
                    
                    <div className="relative max-w-2xl mx-auto">
                        <input 
                            type="text" 
                            placeholder="What do you want to learn today?" 
                            className="w-full bg-gray-800 text-white rounded-full px-6 py-4 pl-14 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg border border-gray-700 transition duration-200"
                        />
                         <Search className="w-6 h-6 text-gray-400 absolute left-5 top-4" />
                         <button className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition duration-200 cursor-pointer">
                            Search
                         </button>
                    </div>
                 </div>

                 {/* Placeholder for results */}
                 <div className="text-center text-gray-500 mt-12">
                    <p>Enter a topic to start searching...</p>
                 </div>
            </main>
        </div>
    );
};

export default SearchPage;
