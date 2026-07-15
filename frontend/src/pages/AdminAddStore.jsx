import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminAddStore() {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/store-owners').then((res) => setOwners(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/admin/stores', form);
      navigate('/admin/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'could not add store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Add New Store</h2>

        {error && <p className="error-text">{error}</p>}

        <label>Store Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        <small>{form.name.length}/60 characters (min 20)</small>

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} rows="3" required />

        <label>Store Owner (optional)</label>
        <select name="ownerId" value={form.ownerId} onChange={handleChange}>
          <option value="">No owner assigned yet</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name} ({o.email})
            </option>
          ))}
        </select>
        {owners.length === 0 && (
          <small>No store owner accounts exist yet, create one from the Add User page first.</small>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Store'}
        </button>
      </form>
    </div>
  );
}