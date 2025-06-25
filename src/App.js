import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import TrackerForm from './components/TrackerForm';
import { AuthProvider } from './components/AuthContext';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import ProgressPage from './components/ProgressPage';
import InsightsPage from './components/InsightsPage';
import Community from './components/Community';

import './App.css'; 


function Header() {
  const location = useLocation();

  
  
  if (location.pathname !== '/dashboard' && 
      location.pathname !== '/tracker' && 
      location.pathname !== '/progress' &&
      location.pathname !== '/insights' &&
      location.pathname !== '/community') { 
    return null; 
  }

  return (
    <div className="app-main-title-container"> {}
      <h1 className="app-main-title">Personal Sustainability Tracker</h1>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {}
          <Header />
          
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            {}
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