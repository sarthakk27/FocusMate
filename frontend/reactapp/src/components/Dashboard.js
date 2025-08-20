import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const StatCard = ({ title, value, icon, color = '#1976d2' }) => (
  <div style={{
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          {title}
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
          {value}
        </div>
      </div>
      <div style={{ color }}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#d32f2f';
      case 'medium': return '#ed6c02';
      case 'low': return '#2e7d32';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '2rem auto', 
        padding: '0 1rem',
        display: 'flex', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          color: '#1976d2',
          fontSize: '1.125rem'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '2rem auto', 
        padding: '0 1rem'
      }}>
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '1rem',
          borderRadius: '4px',
          border: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '2rem auto', 
      padding: '0 1rem'
    }}>
      <h1 style={{ 
        fontSize: '2.125rem', 
        fontWeight: '400', 
        marginBottom: '2rem',
        color: '#333'
      }}>
        Welcome back, {user?.first_name || user?.username}!
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {/* Statistics Cards */}
        <StatCard
          title="Total Notes"
          value={dashboardData?.total_notes || 0}
          icon=""
          color="#1976d2"
        />
        
        <StatCard
          title="Today's Plans"
          value={`${dashboardData?.completed_plans_today || 0}/${dashboardData?.total_daily_plans || 0}`}
          icon=""
          color="#9c27b0"
        />
        
        <StatCard
          title="Study Time (hrs)"
          value={Math.round((dashboardData?.total_study_time || 0) / 60 * 10) / 10}
          icon=""
          color="#0288d1"
        />
        
        <StatCard
          title="Active Goals"
          value={dashboardData?.active_goals || 0}
          icon=""
          color="#2e7d32"
        />
        
        <StatCard
          title="Study Sessions"
          value={dashboardData?.total_study_sessions || 0}
          icon=""
          color="#ed6c02"
        />
        
        <StatCard
          title="Upcoming Reminders"
          value={dashboardData?.upcoming_reminders || 0}
          icon=""
          color="#d32f2f"
        />
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        {/* Recent Notes */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1rem' 
          }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#333' }}>Recent Notes</h3>
            <button
              onClick={() => navigate('/notes')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1976d2',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              View All
            </button>
          </div>
          {dashboardData?.recent_notes?.length > 0 ? (
            <div>
              {dashboardData.recent_notes.map((note) => (
                <div key={note.id} style={{
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    {note.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      border: '1px solid #ddd'
                    }}>
                      {note.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>
                      {new Date(note.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#666' }}>No notes yet</div>
          )}
        </div>

        {/* Today's Plans */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1rem' 
          }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#333' }}>Today's Plans</h3>
            <button
              onClick={() => navigate('/daily-plans')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1976d2',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              View All
            </button>
          </div>
          {dashboardData?.today_plans?.length > 0 ? (
            <div>
              {dashboardData.today_plans.map((plan) => (
                <div key={plan.id} style={{
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      textDecoration: plan.is_completed ? 'line-through' : 'none',
                      color: plan.is_completed ? '#666' : '#333'
                    }}>
                      {plan.title}
                    </span>
                    <span style={{
                      backgroundColor: getPriorityColor(plan.priority),
                      color: 'white',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem'
                    }}>
                      {plan.priority}
                    </span>
                  </div>
                  <div style={{ color: '#666', fontSize: '0.875rem' }}>
                    {plan.description}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#666' }}>No plans for today</div>
          )}
        </div>
      </div>

      {/* Recent Study Sessions */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '1.5rem'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1rem' 
        }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#333' }}>Recent Study Sessions</h3>
          <button
            onClick={() => navigate('/study-sessions')}
            style={{
              background: 'none',
              border: 'none',
              color: '#1976d2',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            View All
          </button>
        </div>
        {dashboardData?.recent_study_sessions?.length > 0 ? (
          <div>
            {dashboardData.recent_study_sessions.map((session) => (
              <div key={session.id} style={{
                padding: '0.75rem 0',
                borderBottom: '1px solid #eee'
              }}>
                <div style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  {session.subject}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#666' }}>
                  <span>Duration: {session.duration_minutes} minutes</span>
                  {session.rating && (
                    <span>Rating: {session.rating}/5</span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: '#999' }}>
                    {new Date(session.session_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#666' }}>No study sessions yet</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
