// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';

// const Register = () => {
//   const navigate = useNavigate();
//   const { register } = useAuth();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     password_confirm: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     if (formData.password !== formData.password_confirm) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//       await register(formData);
//       setSuccess('Registration successful! Please log in with your credentials.');
//       setTimeout(() => {
//         navigate('/login');
//       }, 2000);
//     } catch (error) {
//       const errorMessage = error.detail || 
//                           error.name?.[0] || 
//                           error.email?.[0] || 
//                           error.password?.[0] ||
//                           error.non_field_errors?.[0] ||
//                           'Registration failed. Please try again.';
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ 
//       maxWidth: '500px', 
//       margin: '2rem auto', 
//       padding: '2rem',
//       border: '1px solid #ddd',
//       borderRadius: '8px',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//     }}>
//   <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Join FocusMate</h2>
      
//       {error && (
//         <div style={{
//           backgroundColor: '#ffebee',
//           color: '#c62828',
//           padding: '1rem',
//           borderRadius: '4px',
//           marginBottom: '1rem'
//         }}>
//           {error}
//         </div>
//       )}

//       {success && (
//         <div style={{
//           backgroundColor: '#e8f5e8',
//           color: '#2e7d32',
//           padding: '1rem',
//           borderRadius: '4px',
//           marginBottom: '1rem'
//         }}>
//           {success}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '1rem' }}>
//           <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
//             Full Name
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             style={{
//               width: '100%',
//               padding: '0.75rem',
//               border: '1px solid #ddd',
//               borderRadius: '4px',
//               fontSize: '1rem'
//             }}
//           />
//         </div>
        
//         <div style={{ marginBottom: '1rem' }}>
//           <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
//             Email Address
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             style={{
//               width: '100%',
//               padding: '0.75rem',
//               border: '1px solid #ddd',
//               borderRadius: '4px',
//               fontSize: '1rem'
//             }}
//           />
//         </div>
        
//         <div style={{ marginBottom: '1rem' }}>
//           <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             style={{
//               width: '100%',
//               padding: '0.75rem',
//               border: '1px solid #ddd',
//               borderRadius: '4px',
//               fontSize: '1rem'
//             }}
//           />
//         </div>
        
//         <div style={{ marginBottom: '1rem' }}>
//           <label htmlFor="password_confirm" style={{ display: 'block', marginBottom: '0.5rem' }}>
//             Confirm Password
//           </label>
//           <input
//             type="password"
//             id="password_confirm"
//             name="password_confirm"
//             value={formData.password_confirm}
//             onChange={handleChange}
//             required
//             style={{
//               width: '100%',
//               padding: '0.75rem',
//               border: '1px solid #ddd',
//               borderRadius: '4px',
//               fontSize: '1rem'
//             }}
//           />
//         </div>
        
//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             width: '100%',
//             padding: '0.75rem',
//             backgroundColor: 'black',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             fontSize: '1rem',
//             cursor: loading ? 'not-allowed' : 'pointer',
//             opacity: loading ? 0.7 : 1
//           }}
//         >
//           {loading ? 'Creating Account...' : 'Create Account'}
//         </button>
        
//         <div style={{ textAlign: 'center', marginTop: '1rem' }}>
//           <span>Already have an account? </span>
//           <button
//             type="button"
//             onClick={() => navigate('/login')}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: '#1976d2',
//               textDecoration: 'underline',
//               cursor: 'pointer'
//             }}
//           >
//             Sign in here
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Register.css'; // Import the professional CSS

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
      await register(formData);
      setSuccess('Registration successful! Please log in with your credentials.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errorMessage = error.detail || 
                          error.name?.[0] || 
                          error.email?.[0] || 
                          error.password?.[0] ||
                          error.non_field_errors?.[0] ||
                          'Registration failed. Please try again.';
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
              placeholder="John Doe"
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
              placeholder="john@example.com"
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
              placeholder="••••••••"
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
              placeholder="••••••••"
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