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
  Rating,
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
  School,
  AccessTime,
} from '@mui/icons-material';
import { studySessionsService } from '../services/api';

const StudySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    duration_minutes: '',
    notes: '',
  // rating: null,
    session_date: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await studySessionsService.getAllSessions();
      setSessions(data);
    } catch (error) {
      setError('Failed to load study sessions');
      console.error('Study sessions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (session = null) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        subject: session.subject,
        duration_minutes: session.duration_minutes.toString(),
        notes: session.notes,
        rating: session.rating,
        session_date: new Date(session.session_date).toISOString().slice(0, 16),
      });
    } else {
      setEditingSession(null);
      setFormData({
        subject: '',
        duration_minutes: '',
        notes: '',
        rating: null,
        session_date: new Date().toISOString().slice(0, 16),
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSession(null);
    setFormData({
      subject: '',
      duration_minutes: '',
      notes: '',
      rating: null,
      session_date: new Date().toISOString().slice(0, 16),
    });
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        duration_minutes: parseInt(formData.duration_minutes),
        session_date: new Date(formData.session_date).toISOString(),
      };

      if (editingSession) {
        await studySessionsService.updateSession(editingSession.id, submitData);
      } else {
        await studySessionsService.createSession(submitData);
      }
      handleCloseDialog();
      fetchSessions();
    } catch (error) {
      setError('Failed to save study session');
      console.error('Save session error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this study session?')) {
      try {
        await studySessionsService.deleteSession(id);
        fetchSessions();
      } catch (error) {
        setError('Failed to delete session');
        console.error('Delete session error:', error);
      }
    }
  };

  const getTotalStudyTime = () => {
    return sessions.reduce((total, session) => total + session.duration_minutes, 0);
  };

  // Removed rating logic

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading study sessions...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Study Sessions
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Session
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <School color="primary" />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Sessions
                  </Typography>
                  <Typography variant="h5">
                    {sessions.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AccessTime color="secondary" />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Study Time
                  </Typography>
                  <Typography variant="h5">
                    {Math.round(getTotalStudyTime() / 60 * 10) / 10}h
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
  {/* Removed rating card */}
      </Grid>

      {/* Sessions Grid */}
      <Grid container spacing={3}>
        {sessions.map((session) => (
          <Grid item xs={12} sm={6} md={4} key={session.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="div">
                    {session.subject}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(session)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(session.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body2">
                    {session.duration_minutes} minutes
                  </Typography>
                </Box>

                {/* Removed session rating display */}

                <Typography variant="body2" color="text.secondary" paragraph>
                  {session.notes || 'No notes'}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {new Date(session.session_date).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {sessions.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No study sessions yet. Record your first session!
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
          {editingSession ? 'Edit Study Session' : 'Record New Study Session'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Subject"
            fullWidth
            variant="outlined"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Duration (minutes)"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Session Date & Time"
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={formData.session_date}
            onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            sx={{ mb: 2 }}
          />
          {/* Removed rating input from dialog */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSession ? 'Update' : 'Record'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudySessions;
