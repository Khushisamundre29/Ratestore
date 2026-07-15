import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/admin/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => setError(err.response?.data?.message || 'could not load user'));
  }, [id]);

  if (error) return <div className="page-container"><p className="error-text">{error}</p></div>;
  if (!user) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <span className="spinner"></span>
          Loading user details...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/admin/users">&larr; back to users</Link>
      <h2>{user.name}</h2>

      <div className="detail-box">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.role === 'store_owner' && (
          <p><strong>Rating:</strong> {user.rating || 'no ratings yet'}</p>
        )}
      </div>
    </div>
  );
}