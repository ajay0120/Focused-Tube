import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Search, Loader, ShieldAlert } from 'lucide-react';
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
    const auth = useContext(AuthContext);
    const [query, setQuery] = useState('');
    const [videos, setVideos] = useState<Video[]>([]);
    const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [blockedCount, setBlockedCount] = useState(0);
    const [searchBlocked, setSearchBlocked] = useState(false);

    // Robust blocking check: matches exact keywords or word variations (singular/plural)
    const checkIfBlocked = (text: string, disinterests: string[]) => {
        const textLower = text.toLowerCase();
        const keywords = disinterests.map(d => d.toLowerCase());
        
        return keywords.some(keyword => {
            // 1. Direct match: text contains keyword
            if (textLower.includes(keyword)) return true;
            
            // 2. Word match: check if a word in text is a variation of keyword or vice versa
            // e.g. "prank" (in text) matches "pranks" (keyword)
            const words = textLower.match(/\w+/g) || [];
            return words.some(word => 
                (word.length >= 3 && keyword.includes(word)) || 
                (keyword.length >= 3 && word.includes(keyword))
            );
        });
    };

    const filterVideos = (videosToFilter: Video[]) => {
        if (!auth?.user?.disinterests || auth.user.disinterests.length === 0) {
            setBlockedCount(0);
            return videosToFilter;
        }

        const disinterests = auth.user.disinterests.map(d => d.toLowerCase());
        let blocked = 0;

        const filtered = videosToFilter.filter(video => {
            const title = video.title.toLowerCase();
            const description = video.description.toLowerCase();
            
            const hasDisinterest = disinterests.some(keyword => 
                title.includes(keyword) || description.includes(keyword)
            );

            if (hasDisinterest) {
                blocked++;
                return false;
            }
            return true;
        });

        setBlockedCount(blocked);
        return filtered;
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (auth?.user?.interests && auth.user.interests.length > 0) {
                setLoading(true);
                try {
                     const q = auth.user.interests[0];
                     const data = await searchVideos(q);
                     setRecommendedVideos(filterVideos(data));
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

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setSearchBlocked(false);

        // Check for disinterests in query
        if (auth?.user?.disinterests) {
             const isBlocked = checkIfBlocked(query, auth.user.disinterests);

             if (isBlocked) {
                 setSearchBlocked(true);
                 setLoading(false);
                 setVideos([]);
                 auth?.incrementBlockedCount(); // Increment blocked count in DB
                 return;
             }
        }

        try {
            const data = await searchVideos(query);
            setVideos(filterVideos(data));
        } catch (err) {
            setError('Failed to fetch videos. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Re-filter when disinterests change (e.g. if user edits profile in another tab, though context update might lag without refresh)
    // Actually, we should depend on auth.user.disinterests for the initial load filter
    useEffect(() => {
        if (videos.length > 0) {
             setVideos(prev => filterVideos(prev)); // This might filter already filtered list, which is fine but better to refetch. 
             // Ideally we shouldn't re-filter purely on client without original list, but for now let's just apply to new fetches.
             // The fetchRecommendations effect already depends on user, so it will re-run.
        }
    }, [auth?.user?.disinterests]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8 mt-16">
                 <div className="max-w-4xl mx-auto text-center mb-6">
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Find Focused Content
                    </h1>
                    <p className="text-gray-400 text-lg mb-6">
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
                 {searchBlocked ? (
                    <div className="flex flex-col items-center justify-center mt-12 text-center animate-in fade-in zoom-in duration-300">
                        <div className="bg-red-500/10 p-6 rounded-full mb-6 ring-1 ring-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                            <ShieldAlert className="w-16 h-16 text-red-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Content Blocked</h2>
                        <p className="text-gray-300 text-lg max-w-lg mb-8">
                            This search matches topics in your <strong>disinterests</strong> list. 
                            <br />
                            We've blocked these results to help you avoid distractions.
                        </p>
                        <button 
                            onClick={() => { setSearchBlocked(false); setQuery(''); }}
                            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition duration-200 border border-gray-700 hover:border-gray-600"
                        >
                            Clear Search
                        </button>
                    </div>
                 ) : loading ? (
                    <div className="flex justify-center mt-12">
                        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
                    </div>
                 ) : error ? (
                    <div className="text-center text-red-500 mt-12">{error}</div>
                 ) : videos.length > 0 ? (
                    <>
                        <h2 className="text-2xl font-bold mb-6">Search Results</h2>
                        {blockedCount > 0 && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
                                <span className="mr-2">🛡️</span>
                                {blockedCount} video{blockedCount !== 1 ? 's' : ''} {blockedCount !== 1 ? 'were' : 'was'} hidden because {blockedCount !== 1 ? 'they' : 'it'} matched your disinterests.
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {videos.map((video) => (
                                <div key={video.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-blue-500 transition duration-300 group">
                                    <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                                        <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white group-hover:text-blue-400 transition">{video.title}</h3>
                                            <p className="text-sm text-gray-400 mb-4">{video.channelTitle}</p>
                                            <p className="text-sm text-gray-500 line-clamp-3">{video.description}</p>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </>
                 ) : (
                    <div className="mt-12">
                         {recommendedVideos.length > 0 ? (
                            <>
                                <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
                                {blockedCount > 0 && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
                                        <span className="mr-2">🛡️</span>
                                        {blockedCount} recommendation{blockedCount !== 1 ? 's' : ''} {blockedCount !== 1 ? 'were' : 'was'} hidden based on your disinterests.
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {recommendedVideos.map((video) => (
                                        <div key={video.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-blue-500 transition duration-300 group">
                                            <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                                                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                                                <div className="p-6">
                                                    <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white group-hover:text-blue-400 transition">{video.title}</h3>
                                                    <p className="text-sm text-gray-400 mb-4">{video.channelTitle}</p>
                                                    <p className="text-sm text-gray-500 line-clamp-3">{video.description}</p>
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </>
                         ) : (
                            <div className="text-center text-gray-500">
                                <p>Start searching or add interests to your profile to get recommendations!</p>
                            </div>
                         )}
                    </div>
                 )}
            </main>
        </div>
    );
};

export default SearchPage;
