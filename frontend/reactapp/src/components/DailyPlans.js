import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Box,
  Alert,
  Fab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  RadioButtonUnchecked,
  Today,
} from '@mui/icons-material';
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
      <Container sx={{ mt: 4 }}>
        <Typography>Loading daily plans...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" gutterBottom>
            Daily Plans
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Plan
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Date Selector */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Today />
            <TextField
              type="date"
              label="Select Date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              InputLabelProps={{ shrink: true }}
            />
            <Typography variant="body1">
              {plans.length} plans for {selectedDate.toLocaleDateString()}
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Pending Plans */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Pending Plans ({pendingPlans.length})
              </Typography>
              {pendingPlans.length > 0 ? (
                <List>
                  {pendingPlans.map((plan) => (
                    <ListItem key={plan.id} divider>
                      <IconButton
                        onClick={() => toggleCompletion(plan)}
                        color="primary"
                      >
                        <RadioButtonUnchecked />
                      </IconButton>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1">
                              {plan.title}
                            </Typography>
                            <Chip
                              label={plan.priority}
                              size="small"
                              color={getPriorityColor(plan.priority)}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {plan.description}
                            </Typography>
                            {plan.estimated_duration && (
                              <Typography variant="caption" color="text.secondary">
                                Estimated: {plan.estimated_duration} minutes
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleOpenDialog(plan)}
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(plan.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No pending plans for this date
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Completed Plans */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Completed Plans ({completedPlans.length})
              </Typography>
              {completedPlans.length > 0 ? (
                <List>
                  {completedPlans.map((plan) => (
                    <ListItem key={plan.id} divider>
                      <IconButton
                        onClick={() => toggleCompletion(plan)}
                        color="success"
                      >
                        <CheckCircle />
                      </IconButton>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                              variant="body1"
                              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                            >
                              {plan.title}
                            </Typography>
                            <Chip
                              label={plan.priority}
                              size="small"
                              color={getPriorityColor(plan.priority)}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {plan.description}
                            </Typography>
                            {plan.completed_at && (
                              <Typography variant="caption" color="text.secondary">
                                Completed: {new Date(plan.completed_at).toLocaleString()}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(plan.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No completed plans for this date
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

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
            {editingPlan ? 'Edit Plan' : 'Create New Plan'}
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
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Planned Date"
              type="date"
              value={formData.planned_date.toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, planned_date: new Date(e.target.value) })}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Estimated Duration (minutes)"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.estimated_duration}
              onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingPlan ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  };

export default DailyPlans;
