import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 


import './styles/AuthContext.css'; 

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
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
    
    try {
      await login(formData.email, formData.password); 
      navigate('/dashboard'); 
    } catch (err) {
      
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-page-container"> {/* Main container for auth pages, styled by Auth.css */}
      <h1 className="app-title"> {/* App title, styled by Auth.css */}
        PERSONAL SUSTAINABILITY TRACKER
      </h1>
      <div className="auth-form-card"> {/* Card for the login form, styled by Auth.css */}
        <h2>Log In</h2>
        {/* Display error message if present */}
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
          <div className="form-group password-group"> {/* Group for password input and toggle */}
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper"> {/* Wrapper for input and eye icon */}
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
                {/* Dynamically render eye icon based on showPassword state */}
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="auth-button">Log In</button> {/* Styled by Auth.css */}
        </form>
        <p className="auth-link-text"> {/* Styled by Auth.css */}
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
