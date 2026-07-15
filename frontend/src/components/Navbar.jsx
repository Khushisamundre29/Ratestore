import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">RateStore</Link>
      </div>

      <div className="navbar-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}

        {user && user.role === 'admin' && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/stores">Stores</Link>
          </>
        )}

        {user && user.role === 'user' && (
          <>
            <Link to="/stores">Stores</Link>
            <Link to="/update-password">Change Password</Link>
          </>
        )}

        {user && user.role === 'store_owner' && (
          <>
            <Link to="/owner/dashboard">My Store</Link>
            <Link to="/update-password">Change Password</Link>
          </>
        )}

        {user && (
          <span className="navbar-user">
            Hi, {user.name.split(' ')[0]}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </span>
        )}
      </div>
    </nav>
  );
}