import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import TrackerForm from './components/TrackerForm';
// import ReportPage from './components/ReportPage';
import { AuthProvider } from './components/AuthContext';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import ProgressPage from './components/ProgressPage';
import InsightsPage from './components/InsightsPage';
import Community from './components/Community';

// Component to conditionally render the header based on the route
function Header() {
  const location = useLocation();

  // Show the header only on the /dashboard route
  if (location.pathname !== '/dashboard') {
    return null;
  }

  return (
    <center>
      <h1>Personal Sustainability Tracker</h1>
    </center>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Include the Header component here */}
          <Header />
          
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* Public routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/tracker" element={
              <ProtectedRoute>
                <TrackerForm />
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            } />
            <Route path="/insights" element={
              <ProtectedRoute>
                <InsightsPage />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } />
            
            {/* <Route path="/report" element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            } /> */}
            
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
