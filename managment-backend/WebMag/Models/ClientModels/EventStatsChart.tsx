import React, { useEffect, useState } from 'react';
import { YearlyEventStatsDTO } from './YearlyEventStatsDTO';
import { getYearlyEventStats } from './analyticsService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface EventStatsChartProps {
  year?: number;
}

const EventStatsChart: React.FC<EventStatsChartProps> = ({ year = new Date().getFullYear() }) => {
  const [stats, setStats] = useState<YearlyEventStatsDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getYearlyEventStats(year);
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to load event statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [year]);

  if (loading) {
    return <div>Loading event statistics...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!stats) {
    return <div>No data available</div>;
  }

  return (
    <div className="stats-chart-container">
      <h2>Event Statistics for {stats.year}</h2>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={stats.monthlyStats}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="eventCount" name="Events" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EventStatsChart;
