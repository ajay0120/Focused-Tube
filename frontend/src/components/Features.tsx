import React from 'react';
import { Brain, Filter, BarChart3, Lock, Smartphone, Youtube } from 'lucide-react';

const features = [
    {
        name: 'AI-Driven Content Filtering',
        description: 'Advanced NLP-based engine using BERT to analyze video titles, descriptions, and transcripts. We effectively perceive and filter out sensitive or distracting content.',
        icon: Filter,
        color: 'bg-blue-500/10 text-blue-400'
    },
    {
        name: 'Hybrid Recommendation Engine',
        description: 'Combines Collaborative and Content-Based Filtering to prioritize relevance. We suggest videos that align with your goals, not just what keeps you watching.',
        icon: Brain,
        color: 'bg-purple-500/10 text-purple-400'
    },
    {
        name: 'Well-being Analytics Dashboard',
        description: 'Visualize your consumption trends. Track screen time and get insights to help you manage your digital habits effectively.',
        icon: BarChart3,
        color: 'bg-pink-500/10 text-pink-400'
    },
    {
        name: 'Contextual Understanding',
        description: 'Our filtering goes beyond simple keywords. Any video is analyzed for context to ensure only safe, productive content reaches you.',
        icon: Lock,
        color: 'bg-green-500/10 text-green-400'
    },
    {
        name: 'Cross-Device Accessibility',
        description: 'Seamless experience across all your devices. Your focus settings and recommendations travel with you.',
        icon: Smartphone,
        color: 'bg-orange-500/10 text-orange-400'
    },
    {
        name: 'Enhanced YouTube Experience',
        description: 'The vast library of YouTube, but curated for your growth. Turn the platform into a learning tool.',
        icon: Youtube,
        color: 'bg-red-500/10 text-red-400'
    },
];

const Features: React.FC = () => {
    return (
        <div id="features" className="bg-black py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-400">Core Capabilities</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Designed for Focus. Built for Growth.
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-400">
                        FocusedTube re-engineers the video consumption experience to put you back in control.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col items-start">
                                <div className={`rounded-lg p-3 ${feature.color} ring-1 ring-white/10 mb-5`}>
                                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                                </div>
                                <dt className="text-xl font-semibold leading-7 text-white">
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-400">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Features;
