import { useEffect, useState } from 'react';
import { 
  getNetworkUsers, 
  getConnections, 
  sendConnectionRequest, 
  acceptConnection,
  getNetworkSuggestions,
  getNetworkStats 
} from '../services/networkingService';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

export default function NetworkingPage() {
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0=discover, 1=connections, 2=suggestions
  const [connectionStatusFilter, setConnectionStatusFilter] = useState('accepted');

  useEffect(() => {
    loadNetworkData();
  }, [activeTab, connectionStatusFilter]);

  const loadNetworkData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 0) {
        // Discover tab
        const usersData = await getNetworkUsers(searchQuery, 50, true);
        if (usersData) {
          setUsers(usersData.users || []);
        } else {
          setUsers([]);
        }
      } else if (activeTab === 1) {
        // Connections tab
        const connectionsData = await getConnections(connectionStatusFilter);
        if (connectionsData) {
          setConnections(connectionsData.connections || []);
        } else {
          setConnections([]);
        }
      } else if (activeTab === 2) {
        // Suggestions tab
        const suggestionsData = await getNetworkSuggestions(20);
        if (suggestionsData) {
          setSuggestions(suggestionsData.suggestions || []);
        } else {
          setSuggestions([]);
        }
      }

      // Always load stats
      const statsData = await getNetworkStats();
      if (statsData) {
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error loading network data:', err);
      setError('Failed to load network data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    await loadNetworkData();
  };

  const handleConnect = async (userId) => {
    const result = await sendConnectionRequest(userId);
    if (result) {
      await loadNetworkData();
      alert('Connection request sent!');
    } else {
      alert('Failed to send connection request');
    }
  };

  const handleAccept = async (connectionId) => {
    const result = await acceptConnection(connectionId);
    if (result) {
      await loadNetworkData();
      alert('Connection accepted!');
    } else {
      alert('Failed to accept connection');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading && !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Page Title */}
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}
        >
          Network & Connect
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 4, textAlign: 'center' }}
        >
          Connect with other club members and expand your network
        </Typography>

        {/* Stats Cards */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Connections"
                value={stats.total_connections || 0}
                subtitle="Total connections"
                icon="🤝"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Sent"
                value={stats.pending_sent || 0}
                subtitle="Awaiting response"
                icon="📤"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Received"
                value={stats.pending_received || 0}
                subtitle="Requests to review"
                icon="📥"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Club Memberships"
                value={stats.club_memberships || 0}
                subtitle="Active clubs"
                icon="🏛️"
              />
            </Grid>
          </Grid>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="network tabs">
            <Tab icon={<SearchIcon />} iconPosition="start" label="Discover Users" />
            <Tab icon={<PeopleIcon />} iconPosition="start" label="My Connections" />
            <Tab icon={<ConnectWithoutContactIcon />} iconPosition="start" label="Suggestions" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            {/* Search Bar */}
            <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name, username, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                sx={{ maxWidth: 600 }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ minWidth: 120 }}
              >
                Search
              </Button>
            </Box>

            {/* Users Grid */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : users.length > 0 ? (
              <Grid container spacing={3}>
                {users.map((user) => (
                  <Grid item xs={12} sm={6} md={4} key={user.id}>
                    <UserCard user={user} onConnect={handleConnect} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="body1" color="text.secondary">
                  No users found. Try a different search or generate mock data.
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            {/* Filter */}
            <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={connectionStatusFilter}
                  label="Filter"
                  onChange={(e) => setConnectionStatusFilter(e.target.value)}
                >
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="all">All</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Connections Grid */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : connections.length > 0 ? (
              <Grid container spacing={3}>
                {connections.map((conn) => (
                  <Grid item xs={12} sm={6} md={4} key={conn.id}>
                    <ConnectionCard connection={conn} onAccept={handleAccept} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="body1" color="text.secondary">
                  No connections found.
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : suggestions.length > 0 ? (
              <Grid container spacing={3}>
                {suggestions.map((suggestion) => (
                  <Grid item xs={12} sm={6} md={4} key={suggestion.id}>
                    <SuggestionCard suggestion={suggestion} onConnect={handleConnect} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="body1" color="text.secondary">
                  No suggestions available. Join some clubs to get suggestions!
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}

// Stat Card Component
function StatCard({ title, value, subtitle, icon }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {subtitle}
            </Typography>
          </Box>
          <Typography variant="h3">{icon}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// User Card Component
function UserCard({ user, onConnect }) {
  const connectionStatus = user.connection_status;
  const isConnected = connectionStatus?.status === 'accepted';
  const isPending = connectionStatus?.status === 'pending';
  const isPendingSent = isPending && connectionStatus?.is_sent;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {user.full_name || `${user.first_name} ${user.last_name}` || user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
            {user.headline && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {user.headline}
              </Typography>
            )}
          </Box>
        </Box>

        {user.skills && user.skills.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Skills:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {user.skills.slice(0, 3).map((skill, idx) => (
                <Chip
                  key={idx}
                  label={skill}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          {!isConnected && !isPending && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => onConnect(user.id)}
            >
              Connect
            </Button>
          )}
          {isPendingSent && (
            <Button fullWidth variant="outlined" disabled>
              Pending
            </Button>
          )}
          {isPending && !isPendingSent && (
            <Button fullWidth variant="outlined" color="warning" disabled>
              Request Received
            </Button>
          )}
          {isConnected && (
            <Button fullWidth variant="outlined" color="success" disabled>
              Connected
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

// Connection Card Component
function ConnectionCard({ connection, onAccept }) {
  const { user, status, is_sent, message } = connection;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {user.full_name || user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
            {user.headline && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {user.headline}
              </Typography>
            )}
          </Box>
        </Box>

        {status === 'pending' && !is_sent && (
          <Box>
            {message && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                "{message}"
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={() => onAccept(connection.id)}
            >
              Accept Request
            </Button>
          </Box>
        )}

        {status === 'pending' && is_sent && (
          <Typography variant="body2" color="warning.main">
            Pending your response
          </Typography>
        )}

        {status === 'accepted' && (
          <Chip label="Connected" color="success" />
        )}
      </CardContent>
    </Card>
  );
}

// Suggestion Card Component
function SuggestionCard({ suggestion, onConnect }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {suggestion.full_name || suggestion.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{suggestion.username}
            </Typography>
            {suggestion.headline && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {suggestion.headline}
              </Typography>
            )}
          </Box>
        </Box>

        {suggestion.common_clubs && suggestion.common_clubs.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Common Clubs ({suggestion.common_clubs_count}):
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {suggestion.common_clubs.slice(0, 3).map((club, idx) => (
                <Chip
                  key={idx}
                  label={club}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={() => onConnect(suggestion.id)}
          sx={{ mt: 2 }}
        >
          Connect
        </Button>
      </CardContent>
    </Card>
  );
}
