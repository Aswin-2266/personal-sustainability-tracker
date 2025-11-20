import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 


import './styles/AuthContext.css'; 

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  // REMOVED: success state (navigating immediately)
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false); // ADDED: Submitting state
  const { register } = useAuth();
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
    // REMOVED: setSuccess(''); 

    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setIsSubmitting(true); // Set submitting state

    try {
      await register(formData.username, formData.email, formData.password); 
      
      // MODIFIED: Navigate immediately after successful registration to prevent double-click issue
      navigate('/login'); 
      
    } catch (err) {
      
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      setIsSubmitting(false); // Reset submitting state on failure
    }
  };

  return (
    <div className="auth-page-container">
      <h1 className="app-title"> 
        PERSONAL SUSTAINABILITY TRACKER
      </h1>
      <div className="auth-form-card"> 
        <h2>Sign Up</h2>
        {/* REMOVED: success message display */}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username" 
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
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
          <div className="form-group password-group"> 
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper"> 
              <input
                id="confirmPassword" 
                type={showConfirmPassword ? 'text' : 'password'} 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button" 
                className="show-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} 
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className="auth-button"
            disabled={isSubmitting} // Disable button when submitting
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'} {/* Conditional button text */}
          </button>
        </form>
        <p className="auth-link-text"> 
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;