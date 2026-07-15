import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stores', { params: { ...filters, sortBy, order } });
      setStores(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, order]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>All Stores</h2>
        <Link to="/admin/stores/add" className="btn btn-primary">Add Store</Link>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input name="name" placeholder="Name" value={filters.name} onChange={handleFilterChange} />
        <input name="email" placeholder="Email" value={filters.email} onChange={handleFilterChange} />
        <input name="address" placeholder="Address" value={filters.address} onChange={handleFilterChange} />
        <button type="submit" className="btn btn-primary">Filter</button>
      </form>

      {loading ? (
        <div className="loading-state">
          <span className="spinner"></span>
          Loading stores...
        </div>
      ) : stores.length === 0 ? (
        <div className="empty-state">No stores found.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')}>Name</th>
              <th onClick={() => toggleSort('email')}>Email</th>
              <th onClick={() => toggleSort('address')}>Address</th>
              <th onClick={() => toggleSort('rating')}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>{s.rating || 'no ratings yet'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}