import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-content">
        <h1>Welcome to RateStore</h1>
        <p>
          A simple platform where you can discover local stores and share your
          honest ratings with the community. Store owners can track their
          feedback and admins can manage the whole platform from one place.
        </p>

        <div className="landing-buttons">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/signup" className="btn btn-outline">Sign Up</Link>
        </div>
      </div>

      <div className="landing-features">
        <div className="feature-card">
          <h3>Rate Stores</h3>
          <p>Give a rating from 1 to 5 for any store registered on the platform.</p>
        </div>
        <div className="feature-card">
          <h3>Track Feedback</h3>
          <p>Store owners can see who rated them and their overall average.</p>
        </div>
        <div className="feature-card">
          <h3>Admin Control</h3>
          <p>Admins manage users and stores from a single dashboard.</p>
        </div>
      </div>
    </div>
  );
}