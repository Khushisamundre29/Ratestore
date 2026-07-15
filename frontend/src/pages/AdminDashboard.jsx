import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setStats(res.data));
  }, []);

  return (
    <div className="page-container">
      <h2>Admin Dashboard</h2>

      {!stats ? (
        <p>Loading...</p>
      ) : (
        <div className="stats-row">
          <div className="stat-card">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalStores}</h3>
            <p>Total Stores</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalRatings}</h3>
            <p>Total Ratings</p>
          </div>
        </div>
      )}
    </div>
  );
}