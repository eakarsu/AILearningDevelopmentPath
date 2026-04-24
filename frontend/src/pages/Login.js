import React, { useState, useContext } from 'react';
import { login } from '../services/api';
import { ToastContext } from '../App';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const addToast = useContext(ToastContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login({ email, password });
      onLogin(data.user, data.token);
      addToast('Welcome back!');
    } catch (err) {
      addToast(err.response?.data?.error || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = () => {
    setEmail('admin@company.com');
    setPassword('password123');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <div className="icon">AI</div>
          <h1>AI Learning & Development</h1>
          <p>Personalized L&D Platform</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <button type="button" className="btn btn-fill" onClick={fillCredentials}>
            Quick Fill Demo Credentials
          </button>
        </form>
        <div style={{marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#64748b'}}>
          <p>Demo accounts: admin@company.com | manager@company.com | employee@company.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
