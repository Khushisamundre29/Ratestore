import { useEffect, useState } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await api.get('/stores', {
        params: { name: nameFilter, address: addressFilter }
      });
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
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleRate = async (storeId, rating) => {
    setMessage('');
    try {
      await api.post('/ratings', { storeId, rating });
      setMessage('rating saved');
      fetchStores();
    } catch (err) {
      setMessage(err.response?.data?.message || 'could not save rating');
    }
  };

  return (
    <div className="page-container">
      <h2>Browse Stores</h2>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <input
          placeholder="Search by address"
          value={addressFilter}
          onChange={(e) => setAddressFilter(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {message && <p className="success-text">{message}</p>}

      {loading ? (
        <div className="loading-state">
          <span className="spinner"></span>
          Loading stores...
        </div>
      ) : stores.length === 0 ? (
        <div className="empty-state">No stores found. Try a different search.</div>
      ) : (
        <div className="store-grid">
          {stores.map((store) => (
            <div key={store.id} className="store-card">
              <h3>{store.name}</h3>
              <p className="store-address">{store.address}</p>
              <p>Overall Rating: {store.overallRating || 'No ratings yet'}</p>

              <p>Your Rating:</p>
              <StarRating
                value={store.userRating || 0}
                onChange={(val) => handleRate(store.id, val)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}