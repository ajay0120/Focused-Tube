import { Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Future routes can be added here */}
    </Routes>
  );
}

export default App;

