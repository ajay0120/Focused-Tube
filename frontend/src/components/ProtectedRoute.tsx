import { useContext } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const auth = useContext(AuthContext);

    if (auth?.loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
    }

    if (!auth?.user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
