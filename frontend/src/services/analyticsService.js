import api from './api';

/**
 * Get overall analytics overview
 */
export const getAnalyticsOverview = async () => {
  try {
    const response = await api.get('/analytics/overview/');
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network Error: Could not reach the backend server. Is it running on port 8000?');
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};

/**
 * Get analytics for a specific club
 * @param {number} clubId - The club ID
 */
export const getClubAnalytics = async (clubId) => {
  try {
    const response = await api.get('/analytics/club/', {
      params: { club_id: clubId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching club analytics:', error);
    throw error;
  }
};

/**
 * Get events timeline data
 * @param {number} clubId - Optional club ID
 * @param {number} days - Number of days to look back (default 30)
 */
export const getEventsTimeline = async (clubId = null, days = 30) => {
  try {
    const params = { days };
    if (clubId) {
      params.club_id = clubId;
    }
    const response = await api.get('/analytics/timeline/', {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events timeline:', error);
    throw error;
  }
};

/**
 * Get top clubs by event count
 * @param {number} limit - Number of clubs to return (default 10)
 */
export const getTopClubs = async (limit = 10) => {
  try {
    const response = await api.get('/analytics/top-clubs/', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top clubs:', error);
    throw error;
  }
};
