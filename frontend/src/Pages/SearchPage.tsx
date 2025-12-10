import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Search, Loader } from 'lucide-react';
import { searchVideos } from '../api/video';

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
}

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        try {
            const data = await searchVideos(query);
            setVideos(data);
        } catch (err) {
            setError('Failed to fetch videos. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
                    
                    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                        <input 
                            type="text" 
                            placeholder="What do you want to learn today?" 
                            className="w-full bg-gray-800 text-white rounded-full px-6 py-4 pl-14 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg border border-gray-700 transition duration-200"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                         <Search className="w-6 h-6 text-gray-400 absolute left-5 top-4" />
                         <button type="submit" className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition duration-200 cursor-pointer">
                            Search
                         </button>
                    </form>
                 </div>

                 {/* Results Section */}
                 {loading ? (
                    <div className="flex justify-center mt-12">
                        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
                    </div>
                 ) : error ? (
                    <div className="text-center text-red-500 mt-12">{error}</div>
                 ) : videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos.map((video) => (
                            <div key={video.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-blue-500 transition duration-300">
                                <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold mb-2 line-clamp-2">{video.title}</h3>
                                        <p className="text-sm text-gray-400 mb-4">{video.channelTitle}</p>
                                        <p className="text-sm text-gray-500 line-clamp-3">{video.description}</p>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="text-center text-gray-500 mt-12">
                        <p>Enter a topic to start searching...</p>
                    </div>
                 )}
            </main>
        </div>
    );
};

export default SearchPage;
