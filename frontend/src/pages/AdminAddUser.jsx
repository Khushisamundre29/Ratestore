import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminAddUser() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/admin/users', form);
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'could not add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Add New User</h2>

        {error && <p className="error-text">{error}</p>}

        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        <small>{form.name.length}/60 characters (min 20)</small>

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} rows="3" required />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />
        <small>8-16 characters, at least 1 uppercase letter and 1 special character</small>

        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">Normal User</option>
          <option value="admin">Admin</option>
          <option value="store_owner">Store Owner</option>
        </select>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>
    </div>
  );
}