import React from 'react';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white', padding: '0 1rem' }}>
       <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>Welcome to FocusMate</h1>
       <p style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: '2rem', textAlign: 'center' }}>
         FocusMate is your personal productivity companion. Organize your study sessions, track your goals, manage daily plans, and analyze your progress with beautiful statistics. Join a community of focused learners and achievers!
       </p>
       <div style={{ display: 'flex', gap: '1.5rem' }}>
         <button onClick={() => navigate('/login')} style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', background: 'white', color: '#1976d2', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>Login</button>
         <button onClick={() => navigate('/register')} style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', background: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>Register</button>
       </div>
       <div style={{ marginTop: '3rem', fontSize: '1rem', color: 'rgba(255,255,255,0.85)' }}>
         <p>Discover features like:</p>
         <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto', color: 'white', fontSize: '1.05rem', lineHeight: '1.7' }}>
           <li>Study session tracking</li>
           <li>Goal management</li>
           <li>Daily planning</li>
           <li>Detailed statistics & analytics</li>
           <li>Easy note-taking and file uploads</li>
         </ul>
       </div>

    </div>
  );
};

export default Home;
