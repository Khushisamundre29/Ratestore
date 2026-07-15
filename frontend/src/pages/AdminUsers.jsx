import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', { params: { ...filters, sortBy, order } });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, order]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
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
        <h2>All Users</h2>
        <Link to="/admin/users/add" className="btn btn-primary">Add User</Link>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input name="name" placeholder="Name" value={filters.name} onChange={handleFilterChange} />
        <input name="email" placeholder="Email" value={filters.email} onChange={handleFilterChange} />
        <input name="address" placeholder="Address" value={filters.address} onChange={handleFilterChange} />
        <select name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">Normal User</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button type="submit" className="btn btn-primary">Filter</button>
      </form>

      {loading ? (
        <div className="loading-state">
          <span className="spinner"></span>
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">No users found.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')}>Name</th>
              <th onClick={() => toggleSort('email')}>Email</th>
              <th onClick={() => toggleSort('address')}>Address</th>
              <th onClick={() => toggleSort('role')}>Role</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
                <td>
                  <Link to={`/admin/users/${u.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}