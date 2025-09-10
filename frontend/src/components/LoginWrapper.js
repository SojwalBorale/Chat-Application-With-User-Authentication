import React, { useState } from 'react';
import { Button, TextField, Panel } from 'lucid-ui';

function LoginWrapper() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        setLoggedIn(true);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  if (loggedIn) {
    // Show the chat application after successful login
    const Chat = require('./Chat').default;
    return <Chat />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Panel style={{
        maxWidth: 370,
        width: '100%',
        borderRadius: 18,
        boxShadow: '0 4px 18px #1976d233',
        padding: 36,
        background: '#fff',
        color: '#1976d2',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 28, color: '#1976d2', letterSpacing: 1 }}>Login</h2>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#1976d2' }}>Username</label>
          <TextField
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={val => setUsername(val)}
            style={{ marginBottom: 8, borderRadius: 10, background: '#e3f2fd', color: '#1976d2', border: '1px solid #90caf9' }}
          />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#1976d2' }}>Password</label>
          <TextField
            id="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={val => setPassword(val)}
            style={{ marginBottom: 8, borderRadius: 10, background: '#e3f2fd', color: '#1976d2', border: '1px solid #90caf9' }}
          />
        </div>
        {error && <div style={{ color: '#ff5252', marginBottom: 18, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        <Button
          onClick={handleLogin}
          style={{ width: '100%', borderRadius: 10, background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)', color: '#fff', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #1976d299' }}
        >
          Login
        </Button>
      </Panel>
    </div>
  );
}

export default LoginWrapper;
