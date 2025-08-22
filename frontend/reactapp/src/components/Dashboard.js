import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const StatCard = ({ title, value, icon, color = '#2c3e50', colorRgb = '44, 62, 80' }) => (
  <div
    className="stat-card"
    style={{ '--card-color': color, '--card-color-rgb': colorRgb }}
    role="region"
    aria-label={title}
  >
    <div className="stat-card-content">
      <div className="stat-card-info">
        <div className="stat-card-title">{title}</div>
        <div className="stat-card-value">{value}</div>
      </div>
      <div className="stat-card-icon" style={{ color }}>
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
    } catch (err) {
      setError(' Failed to load dashboard data.');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">
        Welcome, {user?.first_name || user?.username}!
      </h1>

      {/* Stats Section */}
      <div className="stats-grid">
        <StatCard title="Total Notes" value={dashboardData?.total_notes || 0}  color="#000" colorRgb="37, 99, 235" />
        <StatCard title="Today's Plans" value={`${dashboardData?.completed_plans_today || 0}/${dashboardData?.total_daily_plans || 0}`}  color="#000" colorRgb="124, 58, 237" />
        <StatCard title="Study Time" value={`${Math.round((dashboardData?.total_study_time || 0) / 60 * 10) / 10}h`}  color="#000" colorRgb="8, 145, 178" />
        <StatCard title="Active Goals" value={dashboardData?.active_goals || 0}  color="#000" colorRgb="22, 163, 74" />
        <StatCard title="Study Sessions" value={dashboardData?.total_study_sessions || 0}  color="#000" colorRgb="234, 88, 12" />
      </div>

      {/* Content Section */}
      <div className="content-grid">
        {/* Recent Notes */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Recent Notes</h3>
            <button onClick={() => navigate('/notes')} className="card-link">View All Notes →</button>
          </div>
          {dashboardData?.recent_notes?.length > 0 ? (
            <div className="item-list">
              {dashboardData.recent_notes.map((note) => (
                <div key={note.id} className="list-item">
                  <div className="item-title">{note.title}</div>
                  <div className="item-meta">
                    <span className="category-tag">{note.category}</span>
                    <span className="item-date">{formatDate(note.updated_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"> No notes created yet. Start taking notes!</div>
          )}
        </div>

        {/* Today's Plans */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Today's Plans</h3>
            <button onClick={() => navigate('/daily-plans')} className="card-link">Manage Plans →</button>
          </div>
          {dashboardData?.today_plans?.length > 0 ? (
            <div className="item-list">
              {dashboardData.today_plans.map((plan) => (
                <div key={plan.id} className={`list-item ${plan.is_completed ? 'completed-task' : ''}`}>
                  <div className="item-title">{plan.title}</div>
                  <div className="item-meta">
                    <span className={`priority-badge ${getPriorityClass(plan.priority)}`}>{plan.priority}</span>
                  </div>
                  {plan.description && <div className="item-description">{plan.description}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"> No plans scheduled for today.</div>
          )}
        </div>
      </div>

      {/* Study Sessions */}
      <div className="dashboard-card full-width-card">
        <div className="card-header">
          <h3 className="card-title">Recent Study Sessions</h3>
          <button onClick={() => navigate('/study-sessions')} className="card-link">View All Sessions →</button>
        </div>
        {dashboardData?.recent_study_sessions?.length > 0 ? (
          <div className="item-list">
            {dashboardData.recent_study_sessions.map((session) => (
              <div key={session.id} className="list-item">
                <div className="item-title"> {session.subject}</div>
                <div className="session-info">
                  <span className="session-duration"> {session.duration_minutes} minutes</span>
                  {session.rating && <span className="session-rating"> {session.rating}/5</span>}
                  <span className="item-date"> {formatDate(session.session_date)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state"> No study sessions recorded yet.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
