import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Filter from './pages/Filter';
import Results from './pages/Results';
import CourseDetails from './pages/CourseDetails';
import AdvancedSearch from './pages/AdvancedSearch';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { authService } from './services/authService';
import { teeTimeMonitor } from './services/teeTimeMonitor';
import { notificationService } from './services/notificationService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    setIsAuthenticated(authService.isAuthenticated());
    
    // Start monitoring if authenticated
    if (authService.isAuthenticated()) {
      teeTimeMonitor.startMonitoring();
    }
    
    setIsLoading(false);

    // Track app opens for notification logic
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      if (user) {
        notificationService.trackUserActivity(user.id, 'app_open');
      }
    }
  }, []);

  // Handle authentication changes
  const handleLogin = () => {
    setIsAuthenticated(true);
    teeTimeMonitor.startMonitoring();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    teeTimeMonitor.stopMonitoring();
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/signup" element={<SignUp onSignUp={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
              <Route path="/filter" element={<Filter />} />
              <Route path="/results" element={<Results />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/advanced-search" element={<AdvancedSearch />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;