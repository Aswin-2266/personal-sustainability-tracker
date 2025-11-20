import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

import './styles/AuthContext.css'; 

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Define API Base URL

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false); // ADDED: Submitting state
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); 
    
    setIsSubmitting(true); // Set submitting state
    
    try {
      await login(formData.email, formData.password); 
      // Successful login, navigate. isSubmitting state is reset on component unmount.
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      setIsSubmitting(false); // Reset submitting state on failure
    }
  };

  return (
    <div className="auth-page-container"> 
      <h1 className="app-title"> 
        PERSONAL SUSTAINABILITY TRACKER
      </h1>
      <div className="auth-form-card"> 
        <h2>Log In</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email" 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group password-group"> 
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper"> 
              <input
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button" 
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)} 
                aria-label={showPassword ? 'Hide password' : 'Show password'} 
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className="auth-button"
            disabled={isSubmitting} // Disable button when submitting
          >
            {isSubmitting ? 'Logging In...' : 'Log In'} {/* Conditional button text */}
          </button> 
        </form>
        <p className="auth-link-text"> 
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;