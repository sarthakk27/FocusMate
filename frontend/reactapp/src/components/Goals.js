import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  IconButton,
  Box,
  Alert,
  Fab,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  GpsFixed,
  TrendingUp,
} from '@mui/icons-material';
import { goalsService } from '../services/api';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_date: '',
    status: 'not_started',
    progress_percentage: 0,
  });

  const statuses = [
    { value: 'not_started', label: 'Not Started', color: 'default' },
    { value: 'in_progress', label: 'In Progress', color: 'primary' },
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'paused', label: 'Paused', color: 'warning' },
  ];

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await goalsService.getAllGoals();
      setGoals(data);
    } catch (error) {
      setError('Failed to load goals');
      console.error('Goals error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        title: goal.title,
        description: goal.description,
        target_date: goal.target_date,
        status: goal.status,
        progress_percentage: goal.progress_percentage,
      });
    } else {
      setEditingGoal(null);
      setFormData({
        title: '',
        description: '',
        target_date: '',
        status: 'not_started',
        progress_percentage: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      target_date: '',
      status: 'not_started',
      progress_percentage: 0,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingGoal) {
        await goalsService.updateGoal(editingGoal.id, formData);
      } else {
        await goalsService.createGoal(formData);
      }
      handleCloseDialog();
      fetchGoals();
    } catch (error) {
      setError('Failed to save goal');
      console.error('Save goal error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalsService.deleteGoal(id);
        fetchGoals();
      } catch (error) {
        setError('Failed to delete goal');
        console.error('Delete goal error:', error);
      }
    }
  };

  const getStatusInfo = (status) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const getDaysUntilTarget = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today; 
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getOverallProgress = () => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress_percentage, 0);
    return Math.round(totalProgress / goals.length);
  };

  const getGoalsByStatus = () => {
    return statuses.map(status => ({
      ...status,
      count: goals.filter(goal => goal.status === status.value).length
    }));
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading goals...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          My Goals
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Goal
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <GpsFixed color="primary" />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography color="textSecondary" gutterBottom>
                    Overall Progress
                  </Typography>
                  <Typography variant="h6">
                    {getOverallProgress()}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={getOverallProgress()}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp color="secondary" />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Goals by Status
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {getGoalsByStatus().map((statusInfo) => (
                      <Chip
                        key={statusInfo.value}
                        label={`${statusInfo.label}: ${statusInfo.count}`}
                        color={statusInfo.color}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Goals Grid */}
      <Grid container spacing={3}>
        {goals.map((goal) => {
          const statusInfo = getStatusInfo(goal.status);
          const daysUntilTarget = getDaysUntilTarget(goal.target_date);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={goal.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: goal.status === 'completed' ? '2px solid #4caf50' : 'none'
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="div">
                      {goal.title}
                    </Typography>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(goal)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(goal.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  <Chip
                    label={statusInfo.label}
                    color={statusInfo.color}
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {goal.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">Progress</Typography>
                      <Typography variant="body2">{goal.progress_percentage}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={goal.progress_percentage}
                      color={goal.progress_percentage === 100 ? 'success' : 'primary'}
                    />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Target: {new Date(goal.target_date).toLocaleDateString()}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color={daysUntilTarget < 0 ? 'error' : daysUntilTarget < 7 ? 'warning' : 'text.secondary'}
                    >
                      {daysUntilTarget < 0 
                        ? `${Math.abs(daysUntilTarget)} days overdue`
                        : `${daysUntilTarget} days left`
                      }
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {goals.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No goals yet. Set your first goal!
          </Typography>
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <Add />
      </Fab>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGoal ? 'Edit Goal' : 'Create New Goal'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Target Date"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.target_date}
            onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              {statuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Progress Percentage"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.progress_percentage}
            onChange={(e) => setFormData({ 
              ...formData, 
              progress_percentage: Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
            })}
            inputProps={{ min: 0, max: 100 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingGoal ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Goals;
