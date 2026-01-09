import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { User, Clock, Shield, Loader } from 'lucide-react';
import { searchVideos } from '../api/video';

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
}

const ProfilePage = () => {
    const auth = useContext(AuthContext);
    const [recommended, setRecommended] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth?.user?.interests && auth.user.interests.length > 0) {
            const fetchRecommended = async () => {
                setLoading(true);
                try {
                    // Search for the first interest for now
                    const query = auth?.user?.interests?.[0] || 'programming';
                    const data = await searchVideos(query);
                    setRecommended(data.slice(0, 4)); // Show top 4
                } catch (error) {
                    console.error("Failed to fetch recommendations", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRecommended();
        }
    }, [auth?.user?.interests]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8 mt-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-gray-800 rounded-2xl p-8 mb-8 shadow-xl border border-gray-700 flex items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold">
                            {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : <User />}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">
                                {auth?.user?.name}
                            </h1>
                            <p className="text-gray-400">@{auth?.user?.username || 'user'}</p>
                            <div className="flex gap-2 mt-3">
                                <span className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                                    {auth?.user?.role || 'Member'}
                                </span>
                                {auth?.user?.age && (
                                     <span className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                                        Age: {auth.user.age}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <Clock className="w-8 h-8 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-gray-400 text-sm">Total Focus Time</h3>
                                <p className="text-2xl font-bold text-white">0h 0m</p>
                            </div>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <Shield className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-gray-400 text-sm">Distractions Blocked</h3>
                                <p className="text-2xl font-bold text-white">0</p>
                            </div>
                        </div>
                     </div>

                     {/* Interests Section */}
                     <div className="bg-gray-800 rounded-2xl p-8 mb-8 shadow-xl border border-gray-700">
                        <h2 className="text-xl font-bold mb-6">Your Interests</h2>
                        <div className="flex flex-wrap gap-2">
                             {auth?.user?.interests?.map((interest: string, i: number) => (
                                <span key={i} className="px-4 py-2 bg-gray-700 rounded-full text-sm text-blue-200">
                                    {interest}
                                </span>
                             )) || <p className="text-gray-500">No interests added yet.</p>}
                        </div>
                     </div>

                     {/* Recommended Section - NEW */}
                     <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
                        <h2 className="text-xl font-bold mb-6">Recommended for You</h2>
                         {loading ? (
                             <div className="flex justify-center p-8">
                                <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                             </div>
                         ) : recommended.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {recommended.map((video) => (
                                    <div key={video.id} className="bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:ring-2 hover:ring-blue-500 transition duration-200">
                                        <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="flex">
                                            <img src={video.thumbnail} alt={video.title} className="w-32 h-24 object-cover" />
                                            <div className="p-3">
                                                <h3 className="text-sm font-bold text-white line-clamp-2">{video.title}</h3>
                                                <p className="text-xs text-gray-400 mt-1">{video.channelTitle}</p>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                         ) : (
                             <p className="text-gray-500">Add interests to see recommendations.</p>
                         )}
                     </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
