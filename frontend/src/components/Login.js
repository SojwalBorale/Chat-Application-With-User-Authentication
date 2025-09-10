import React, { useState } from 'react';
import { Button, TextField, Panel } from 'lucid-ui';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      setError('');
      window.location.reload();
    } catch (e) {
      setError('Invalid credentials');
    }
  };

  return (
    <Panel>
      <TextField
        label="Username"
        value={username}
        onChange={val => setUsername(val)}
        style={{ marginBottom: 16 }}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={val => setPassword(val)}
        style={{ marginBottom: 16 }}
      />
      <Button onClick={handleLogin} style={{ width: '100%' }}>Login</Button>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </Panel>
  );
}

export default Login;
