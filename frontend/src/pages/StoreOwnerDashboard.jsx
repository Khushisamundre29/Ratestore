import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function StoreOwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'could not load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container"><p>Loading...</p></div>;
  if (error) return <div className="page-container"><p className="error-text">{error}</p></div>;

  return (
    <div className="page-container">
      <h2>{data.store.name}</h2>
      <p className="store-address">{data.store.address}</p>

      <div className="stats-row">
        <div className="stat-card">
          <h3>{data.averageRating || 0}</h3>
          <p>Average Rating</p>
        </div>
        <div className="stat-card">
          <h3>{data.raters.length}</h3>
          <p>People Rated</p>
        </div>
      </div>

      <h3>Ratings Received</h3>
      {data.raters.length === 0 ? (
        <p>No ratings submitted yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.raters.map((r, index) => (
              <tr key={index}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.rating} ★</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}