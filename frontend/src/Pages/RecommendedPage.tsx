import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { searchVideos } from '../api/video';
import { Loader, Play, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
}

const RecommendedPage = () => {
    const auth = useContext(AuthContext);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (auth?.user?.interests && auth.user.interests.length > 0) {
                setLoading(true);
                try {
                    // Combine interests or just take the first few
                    // Search the first interest for now to be safe, or iterate.
                    // A better approach for a "feed" is complex, let's stick to the primary interest.
                    const q = auth.user.interests[0];
                    const data = await searchVideos(q);
                    setVideos(data);
                } catch (error) {
                    console.error("Failed to fetch recommendations", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (auth?.user) {
            fetchRecommendations();
        }
    }, [auth?.user]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8 mt-16">
                 <div className="mb-8">
                    <button 
                        onClick={() => navigate('/profile')} 
                        className="flex items-center text-gray-400 hover:text-white transition mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
                    </button>
                    <h1 className="text-3xl font-bold">Recommended For You</h1>
                    <p className="text-gray-400 mt-2">Curated content based on your interests.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
                    </div>
                ) : videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <div key={video.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:ring-2 hover:ring-blue-500 transition duration-200 group">
                                <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="block relative">
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="w-12 h-12 text-white fill-current" />
                                    </div>
                                </a>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-white line-clamp-2 mb-2">{video.title}</h3>
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>{video.channelTitle}</span>
                                        <div className="flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700">
                        <p className="text-xl text-gray-400">No recommendations found.</p>
                        <p className="text-gray-500 mt-2">Try adding more interests to your profile.</p>
                        <button 
                            onClick={() => navigate('/profile')}
                            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-bold transition"
                        >
                            Manage Interests
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RecommendedPage;
