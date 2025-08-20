import React, { useState, useEffect } from 'react';
// All MUI imports removed. Use HTML and CSS instead.
// All MUI icon imports removed. Use Unicode or SVG alternatives.
import { dailyPlansService } from '../services/api';

const DailyPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    planned_date: new Date(),
    estimated_duration: '',
  });

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  useEffect(() => {
    fetchPlans();
  }, [selectedDate]);

  const fetchPlans = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const data = await dailyPlansService.getDailyPlans(dateStr);
      setPlans(data);
    } catch (error) {
      setError('Failed to load daily plans');
      console.error('Daily plans error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        title: plan.title,
        description: plan.description,
        priority: plan.priority,
        planned_date: new Date(plan.planned_date),
        estimated_duration: plan.estimated_duration || '',
      });
    } else {
      setEditingPlan(null);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        planned_date: selectedDate,
        estimated_duration: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlan(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      planned_date: new Date(),
      estimated_duration: '',
    });
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        planned_date: formData.planned_date.toISOString().split('T')[0],
        estimated_duration: formData.estimated_duration ? parseInt(formData.estimated_duration) : null,
      };

      if (editingPlan) {
        await dailyPlansService.updateDailyPlan(editingPlan.id, submitData);
      } else {
        await dailyPlansService.createDailyPlan(submitData);
      }
      handleCloseDialog();
      fetchPlans();
    } catch (error) {
      setError('Failed to save daily plan');
      console.error('Save plan error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await dailyPlansService.deleteDailyPlan(id);
        fetchPlans();
      } catch (error) {
        setError('Failed to delete plan');
        console.error('Delete plan error:', error);
      }
    }
  };

  const toggleCompletion = async (plan) => {
    try {
      await dailyPlansService.toggleCompletion(plan.id, !plan.is_completed);
      fetchPlans();
    } catch (error) {
      setError('Failed to update plan');
      console.error('Toggle completion error:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const completedPlans = plans.filter(plan => plan.is_completed);
  const pendingPlans = plans.filter(plan => !plan.is_completed);

  if (loading) {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <h2>Loading daily plans...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '2rem' }}>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Daily Plans</h2>
        <button className="btn" style={{ padding: '0.5rem 1.5rem', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleOpenDialog()}>
          + Add Plan
        </button>
      </div>

      {error && (
        <div className="alert" style={{ background: '#fdecea', color: '#d32f2f', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>
      )}

      {/* Date Selector */}
      <div className="date-selector" style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '1.5rem' }}></span>
        <input type="date" value={selectedDate.toISOString().split('T')[0]} onChange={(e) => setSelectedDate(new Date(e.target.value))} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
        <span style={{ fontSize: '1rem' }}>{plans.length} plans for {selectedDate.toLocaleDateString()}</span>
      </div>

      <div className="plans-grid" style={{ display: 'flex', gap: '2rem' }}>
        {/* Pending Plans */}
        <div className="pending-plans" style={{ flex: 1, background: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Pending Plans ({pendingPlans.length})</h3>
          {pendingPlans.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {pendingPlans.map((plan) => (
                <li key={plan.id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '0.75rem 0' }}>
                  <button title="Mark as completed" style={{ background: 'none', border: 'none', color: '#1976d2', fontSize: '1.2rem', marginRight: '0.5rem', cursor: 'pointer' }} onClick={() => toggleCompletion(plan)}>
                    ○
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{plan.title}</span>
                      <span style={{ fontSize: '0.85rem', background: getPriorityColor(plan.priority), color: '#fff', borderRadius: '12px', padding: '0.2rem 0.7rem' }}>{plan.priority}</span>
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#555' }}>{plan.description}</div>
                    {plan.estimated_duration && (
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>Estimated: {plan.estimated_duration} minutes</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button title="Edit" style={{ background: 'none', border: 'none', color: '#1976d2', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => handleOpenDialog(plan)}>
                      ✎
                    </button>
                    <button title="Delete" style={{ background: 'none', border: 'none', color: '#d32f2f', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => handleDelete(plan.id)}>
                      🗑
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: '#888', textAlign: 'center', padding: '2rem 0' }}>No pending plans for this date</div>
          )}
        </div>

        {/* Completed Plans */}
        <div className="completed-plans" style={{ flex: 1, background: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Completed Plans ({completedPlans.length})</h3>
          {completedPlans.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {completedPlans.map((plan) => (
                <li key={plan.id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '0.75rem 0' }}>
                  <button title="Mark as pending" style={{ background: 'none', border: 'none', color: '#388e3c', fontSize: '1.2rem', marginRight: '0.5rem', cursor: 'pointer' }} onClick={() => toggleCompletion(plan)}>
                    ●
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1rem', textDecoration: 'line-through', color: '#888' }}>{plan.title}</span>
                      <span style={{ fontSize: '0.85rem', background: getPriorityColor(plan.priority), color: '#fff', borderRadius: '12px', padding: '0.2rem 0.7rem' }}>{plan.priority}</span>
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#555' }}>{plan.description}</div>
                    {plan.completed_at && (
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>Completed: {new Date(plan.completed_at).toLocaleString()}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button title="Delete" style={{ background: 'none', border: 'none', color: '#d32f2f', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => handleDelete(plan.id)}>
                      🗑
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: '#888', textAlign: 'center', padding: '2rem 0' }}>No completed plans for this date</div>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      {openDialog && (
        <div className="dialog-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="dialog" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', minWidth: '350px', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            <h3 style={{ marginBottom: '1rem' }}>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h3>
            <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Priority</label>
                <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Planned Date</label>
                <input type="date" value={formData.planned_date.toISOString().split('T')[0]} onChange={e => setFormData({ ...formData, planned_date: new Date(e.target.value) })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Estimated Duration (minutes)</label>
                <input type="number" value={formData.estimated_duration} onChange={e => setFormData({ ...formData, estimated_duration: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" style={{ padding: '0.5rem 1.5rem', background: '#eee', color: '#333', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }} onClick={handleCloseDialog}>Cancel</button>
                <button type="submit" className="btn" style={{ padding: '0.5rem 1.5rem', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>{editingPlan ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyPlans;
