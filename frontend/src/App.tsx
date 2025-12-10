import { Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import OnboardingPage from './Pages/OnboardingPage';
import ProfilePage from './Pages/ProfilePage';
import SearchPage from './Pages/SearchPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

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
            path="/search" 
            element={
                <ProtectedRoute>
                    <SearchPage />
                </ProtectedRoute>
            } 
        />
        </Routes>
    </AuthProvider>
  );
}

export default App;

