import { useEffect, useState } from 'react';
import { getAnalyticsOverview, getEventsTimeline, getTopClubs } from '../services/analyticsService';

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [topClubs, setTopClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [daysFilter, setDaysFilter] = useState(30);

  useEffect(() => {
    loadAnalytics();
  }, [daysFilter]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all analytics data in parallel
      const [overviewData, timelineData, topClubsData] = await Promise.all([
        getAnalyticsOverview(),
        getEventsTimeline(null, daysFilter),
        getTopClubs(10)
      ]);

      setOverview(overviewData);
      setTimeline(timelineData);
      setTopClubs(topClubsData.top_clubs || []);
    } catch (err) {
      console.error('Error loading analytics:', err);
      // Show more detailed error message
      const errorMessage = err.message || 'Failed to load analytics data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Analytics</h1>
          <p className="text-gray-600">Track and analyze event performance and engagement</p>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 flex gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Time Range:</label>
          <select
            value={daysFilter}
            onChange={(e) => setDaysFilter(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>

        {/* Overview Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Events"
              value={overview.total_events}
              subtitle="All time"
              icon="📅"
            />
            <MetricCard
              title="Recent Events"
              value={overview.recent_events}
              subtitle="Last 30 days"
              icon="🆕"
            />
            <MetricCard
              title="Year Events"
              value={overview.year_events}
              subtitle="This year"
              icon="📆"
            />
            <MetricCard
              title="Avg Attendance"
              value={overview.average_attendance?.toFixed(1) || '0'}
              subtitle="Per event"
              icon="👥"
            />
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Events Timeline Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Events Over Time</h2>
            {timeline && timeline.timeline && timeline.timeline.length > 0 ? (
              <EventsTimelineChart data={timeline.timeline} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                No events in the selected time range
              </div>
            )}
          </div>

          {/* Top Clubs Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Clubs by Events</h2>
            {topClubs.length > 0 ? (
              <TopClubsChart data={topClubs} />
            ) : (
              <div className="text-center py-12 text-gray-500">No club data available</div>
            )}
          </div>
        </div>

        {/* Events by Club Table */}
        {overview && overview.events_by_club && overview.events_by_club.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Events by Club</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Club Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {overview.events_by_club.map((club, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {club.calendar__club__name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {club.event_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

// Simple Timeline Chart Component (using CSS bars)
function EventsTimelineChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="space-y-2">
      {data.map((item, index) => {
        const percentage = (item.count / maxValue) * 100;
        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <div key={index} className="flex items-center gap-3">
            <div className="w-20 text-xs text-gray-600">{dateStr}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                {item.count}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Simple Top Clubs Chart Component
function TopClubsChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.event_count), 1);

  return (
    <div className="space-y-3">
      {data.map((club, index) => {
        const percentage = (club.event_count / maxValue) * 100;

        return (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 truncate flex-1">
                {club.calendar__club__name}
              </span>
              <span className="text-sm font-bold text-gray-900 ml-2">
                {club.event_count}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

