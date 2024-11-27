import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { useAuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('doctor'); // Default role
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulate authentication check
    if ((role === 'admin' && username === 'admin' && password === '123') ||
        (role === 'doctor' && username === 'doctor' && password === '123')) {
      login(role, username);

      // Redirect to role-based page
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'doctor') {
        navigate('/doctor');
      }
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Account Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="role-selection">
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === 'admin'}
                onChange={(e) => setRole(e.target.value)}
              />
              Admin
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="doctor"
                checked={role === 'doctor'}
                onChange={(e) => setRole(e.target.value)}
              />
              Doctor
            </label>
          </div>
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;