import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Card, CardContent, Box, Alert, LinearProgress, List, ListItem, ListItemText, Chip } from '@mui/material';
import {
  TrendingUp,
  School,
  Today,
  Timer,
  Assignment,
  CheckCircle,
} from '@mui/icons-material';
import { statisticsService } from '../services/api';

const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box color={`${color}.main`}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Statistics = () => {
  const [studyStats, setStudyStats] = useState(null);
  const [productivityStats, setProductivityStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const [studyData, productivityData] = await Promise.all([
        statisticsService.getStudyStatistics(),
        statisticsService.getProductivitySummary(),
      ]);
      setStudyStats(studyData);
      setProductivityStats(productivityData);
    } catch (error) {
      setError('Failed to load statistics');
      console.error('Statistics error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading statistics...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Statistics & Analytics
      </Typography>

      {/* Study Statistics */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Study Performance (Last 7 Days)
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sessions"
            value={studyStats?.total_sessions || 0}
            icon={null}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Time"
            value={`${Math.round((studyStats?.total_minutes || 0) / 60 * 10) / 10}h`}
            icon={null}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Session"
            value={`${studyStats?.average_session_length || 0}min`}
            icon={null}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Daily Avg"
            value={`${Math.round((studyStats?.total_minutes || 0) / 7 / 60 * 10) / 10}h`}
            icon={null}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Daily Breakdown */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Daily Study Breakdown
        </Typography>
        {studyStats?.daily_stats && Object.keys(studyStats.daily_stats).length > 0 ? (
          <List>
            {Object.entries(studyStats.daily_stats).map(([date, stats]) => (
              <ListItem key={date} divider>
                <ListItemText
                  primary={new Date(date).toLocaleDateString()}
                  secondary={
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="body2">
                        {stats.sessions} sessions
                      </Typography>
                      <Typography variant="body2">
                        {Math.round(stats.total_minutes / 60 * 10) / 10} hours
                      </Typography>
                      <Box sx={{ flexGrow: 1, ml: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(stats.total_minutes / 480) * 100} // Assuming 8 hours as max
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="textSecondary">
            No study data available for the last 7 days
          </Typography>
        )}
      </Paper>

      {/* Productivity Statistics
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Productivity Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Today color="primary" />
                <Typography variant="h6">Today's Progress</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2">
                  Completed Tasks: {productivityStats?.today?.completed || 0}
                </Typography>
                <Typography variant="body2">
                  Total: {productivityStats?.today?.total || 0}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={productivityStats?.today?.completion_rate || 0}
                sx={{ height: 10, borderRadius: 5, mb: 1 }}
                color="primary"
              />
              <Typography variant="h5" align="center">
                {productivityStats?.today?.completion_rate || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Assignment color="secondary" />
                <Typography variant="h6">This Week's Progress</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2">
                  Completed Tasks: {productivityStats?.this_week?.completed || 0}
                </Typography>
                <Typography variant="body2">
                  Total: {productivityStats?.this_week?.total || 0}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={productivityStats?.this_week?.completion_rate || 0}
                sx={{ height: 10, borderRadius: 5, mb: 1 }}
                color="secondary"
              />
              <Typography variant="h5" align="center">
                {productivityStats?.this_week?.completion_rate || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid> */}

      {/* Performance Insights */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance Insights
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box p={2} bgcolor="lightblue" borderRadius={2} color="primary.contrastText">
              <Typography variant="subtitle1" gutterBottom>
                Study Consistency
              </Typography>
              <Typography variant="body2">
                {studyStats?.total_sessions >= 5 
                  ? "Great consistency! You've been studying regularly."
                  : "Try to maintain a more consistent study schedule."
                }
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box p={2} bgcolor="lightblue" borderRadius={2} color="secondary.contrastText">
              <Typography variant="subtitle1" gutterBottom>
                Task Completion
              </Typography>
              <Typography variant="body2">
                {(productivityStats?.today?.completion_rate || 0) >= 80
                  ? "Excellent! You're completing most of your planned tasks."
                  : "Focus on completing more of your daily plans."
                }
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box p={2} bgcolor="lightblue" borderRadius={2} color="success.contrastText">
              <Typography variant="subtitle1" gutterBottom>
                Study Duration
              </Typography>
              <Typography variant="body2">
                {(studyStats?.average_session_length || 0) >= 45
                  ? "Good focus! Your study sessions are well-paced."
                  : "Consider longer study sessions for better focus."
                }
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Statistics;
