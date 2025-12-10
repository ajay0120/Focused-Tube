import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { User, Clock, Shield } from 'lucide-react';

const ProfilePage = () => {
    const auth = useContext(AuthContext);

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
                     <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
                        <h2 className="text-xl font-bold mb-6">Your Interests</h2>
                        <div className="flex flex-wrap gap-2">
                             {auth?.user?.interests?.map((interest: string, i: number) => (
                                <span key={i} className="px-4 py-2 bg-gray-700 rounded-full text-sm text-blue-200">
                                    {interest}
                                </span>
                             )) || <p className="text-gray-500">No interests added yet.</p>}
                        </div>
                     </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
