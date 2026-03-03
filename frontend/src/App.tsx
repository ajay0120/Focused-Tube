import { Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import OnboardingPage from './Pages/OnboardingPage';
import ProfilePage from './Pages/ProfilePage';
import RecommendedPage from './Pages/RecommendedPage';
import Dashboard from './Pages/Dashboard';
import SearchPage from './Pages/SearchPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Watch from './Pages/Watch';

function App() {
  return (
    <AuthProvider>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
            path="/onboarding" 
            element={
                <ProtectedRoute>
                    <OnboardingPage />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/profile" 
            element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/recommended" 
            element={
                <ProtectedRoute>
                    <RecommendedPage />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/dashboard" 
            element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/search" 
            element={
                <ProtectedRoute>
                    <SearchPage />
                </ProtectedRoute>
            } 
        />
        <Route path="/watch/:id" element={<Watch />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;

