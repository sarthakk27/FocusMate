import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Register.css'; 

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return requirements;
  };

  const passwordRequirements = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordRequirements).every(req => req);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    console.log("Form data:", formData);

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError('Please ensure your password meets all requirements');
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting to register with:", formData);
      await register(formData);
      setSuccess('Registration successful! Please log in with your credentials.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error("Registration error caught:", error);
      let errorMessage;
      if (typeof error === 'object') {
        errorMessage = error.detail || 
                      (error.name && error.name[0]) || 
                      (error.email && error.email[0]) || 
                      (error.password && error.password[0]) ||
                      (error.non_field_errors && error.non_field_errors[0]) ||
                      JSON.stringify(error);
      } else {
        errorMessage = error || 'Registration failed. Please try again.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Join FocusMate</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              
            />
            {formData.password && (
              <div className="password-requirements">
                <strong>Password Requirements:</strong>
                <ul>
                  <li className={passwordRequirements.minLength ? 'requirement-met' : 'requirement-unmet'}>
                    At least 8 characters
                  </li>
                  <li className={passwordRequirements.hasUpperCase ? 'requirement-met' : 'requirement-unmet'}>
                    One uppercase letter
                  </li>
                  <li className={passwordRequirements.hasLowerCase ? 'requirement-met' : 'requirement-unmet'}>
                    One lowercase letter
                  </li>
                  <li className={passwordRequirements.hasNumber ? 'requirement-met' : 'requirement-unmet'}>
                    One number
                  </li>
                  <li className={passwordRequirements.hasSpecialChar ? 'requirement-met' : 'requirement-unmet'}>
                    One special character
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="form-field">
            <label htmlFor="password_confirm" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="password_confirm"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              required
              className="form-input"
              
            />
            {formData.password_confirm && formData.password !== formData.password_confirm && (
              <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Passwords do not match
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="submit-button"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className="signin-section">
            <span className="signin-text">Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="signin-button"
            >
              Sign in here
            </button>
          </div>
        </form>
    </div>
  );
};

export default Register;