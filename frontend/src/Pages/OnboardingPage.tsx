import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const OnboardingPage = () => {
    const [interests, setInterests] = useState<string[]>([]);
    const [disinterests, setDisinterests] = useState<string[]>([]);
    const [currentInterest, setCurrentInterest] = useState('');
    const [currentDisinterest, setCurrentDisinterest] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAddInterest = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentInterest && interests.length < 10 && !interests.includes(currentInterest)) {
            setInterests([...interests, currentInterest]);
            setCurrentInterest('');
        }
    };

    const handleAddDisinterest = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentDisinterest && disinterests.length < 10 && !disinterests.includes(currentDisinterest)) {
            setDisinterests([...disinterests, currentDisinterest]);
            setCurrentDisinterest('');
        }
    };

    const removeInterest = (interest: string) => {
        setInterests(interests.filter(i => i !== interest));
    };

    const removeDisinterest = (disinterest: string) => {
        setDisinterests(disinterests.filter(d => d !== disinterest));
    };

    const handleSubmit = async () => {
        if (interests.length > 0 && disinterests.length > 0 && age) {
             try {
                await auth?.updateUserProfile({
                    interests,
                    disinterests,
                    age: Number(age),
                    onboardingCompleted: true
                });
                navigate('/profile');
             } catch (error) {
                 console.error(error);
             }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
                    Personalize Your Experience
                </h2>
                <div className="space-y-8">
                    {/* Age Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">How old are you?</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                            placeholder="Age"
                        />
                    </div>

                    {/* Interests Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">What are you interested in? (Add up to 10)</label>
                        <form onSubmit={handleAddInterest} className="flex gap-2">
                            <input
                                type="text"
                                value={currentInterest}
                                onChange={(e) => setCurrentInterest(e.target.value)}
                                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                placeholder="e.g., Coding, Music, Tech"
                            />
                            <button type="submit" disabled={interests.length >= 10} className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer">Add</button>
                        </form>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {interests.map((interest, idx) => (
                                <span key={idx} className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    {interest}
                                    <button onClick={() => removeInterest(interest)} className="hover:text-white cursor-pointer">&times;</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Disinterests Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">What are you NOT interested in? (Add up to 10)</label>
                        <form onSubmit={handleAddDisinterest} className="flex gap-2">
                             <input
                                type="text"
                                value={currentDisinterest}
                                onChange={(e) => setCurrentDisinterest(e.target.value)}
                                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 text-white"
                                placeholder="e.g., Politics, Clickbait"
                            />
                             <button type="submit" disabled={disinterests.length >= 10} className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 cursor-pointer">Add</button>
                        </form>
                         <div className="flex flex-wrap gap-2 mt-4">
                            {disinterests.map((disinterest, idx) => (
                                <span key={idx} className="bg-red-900 text-red-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    {disinterest}
                                     <button onClick={() => removeDisinterest(disinterest)} className="hover:text-white cursor-pointer">&times;</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!age || interests.length === 0 || disinterests.length === 0}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Complete Setup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
