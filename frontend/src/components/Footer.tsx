import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black/90 py-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} FocusedTube. AI-Driven Digital Well-being.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
