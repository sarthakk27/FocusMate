// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

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

//     try {
//       await login(formData);
//       navigate('/dashboard');
//     } catch (error) {
//       setError(error.detail || error.non_field_errors?.[0] || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ 
//       maxWidth: '400px', 
//       margin: '2rem auto', 
//       padding: '2rem',
//       border: '1px solid #ddd',
//       borderRadius: '8px',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//     }}>
//   <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login to FocusMate</h2>
      
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

//       <form onSubmit={handleSubmit}>
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
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
        
//         <div style={{ textAlign: 'center', marginTop: '1rem' }}>
//           <span>Don't have an account? </span>
//           <button
//             type="button"
//             onClick={() => navigate('/register')}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: '#1976d2',
//               textDecoration: 'underline',
//               cursor: 'pointer'
//             }}
//           >
//             Sign up here
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css'; // Import the neobrutalism CSS

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.detail || error.non_field_errors?.[0] || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login to FocusMate</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
            placeholder="your@email.com"
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
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="signup-section">
          <span className="signup-text">Don't have an account? </span>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="signup-button"
          >
            Sign up here
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;