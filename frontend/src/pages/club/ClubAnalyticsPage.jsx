import { useEffect, useState } from 'react';
import { getClubAnalytics } from '../../services/analyticsService';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Divider
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function ClubAnalyticsPage({ clubId }) {
  // clubId is passed as a prop from ClubContent component
  // If clubId is not provided, the component will show an error
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (clubId) {
      loadClubAnalytics();
    }
  }, [clubId]);

  const loadClubAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClubAnalytics(parseInt(clubId));
      setAnalytics(data);
    } catch (err) {
      console.error('Error loading club analytics:', err);
      setError(err.message || 'Failed to load club analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!analytics) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">No analytics data available for this club.</Alert>
      </Container>
    );
  }

  // Prepare chart data to match the image
  const eventsOverTimeData = analytics.events_over_time?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    events: item.events
  })) || [];

  const recentAttendanceData = analytics.recent_attendance?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    attendance: item.attendance
  })) || [];

  const eventsDistributionData = analytics.events_distribution?.map(item => ({
    name: item.month,
    value: item.count,
    percentage: item.percentage
  })) || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
        {analytics.club_name} Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Event performance and engagement metrics.
      </Typography>

      <Grid container spacing={3}>
        {/* Key Metrics - Match the image */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Events
              </Typography>
              <Typography variant="h4">
                {analytics.total_events || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Attendance
              </Typography>
              <Typography variant="h4">
                {analytics.average_attendance?.toFixed(1) || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Attendance
              </Typography>
              <Typography variant="h4">
                {analytics.total_attendance || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Engagement
              </Typography>
              <Typography variant="h4">
                {analytics.engagement_level || 'Low'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Events Over Time - Line Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Events Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={eventsOverTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="events" stroke="#8884d8" name="Events" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Attendance - Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Attendance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={recentAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Events Distribution - Pie Chart */}
        {eventsDistributionData.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Events Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={eventsDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {eventsDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe'][index % 6]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Recent Events */}
        {analytics.recent_events && analytics.recent_events.length > 0 && (
          <Grid item xs={12} md={eventsDistributionData.length > 0 ? 6 : 12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Events
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {analytics.recent_events.map((event, index) => (
                    <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < analytics.recent_events.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {event.description || 'Meeting'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

