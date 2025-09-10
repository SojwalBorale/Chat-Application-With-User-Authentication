import React, { useState } from 'react';
import { Button, TextField, Panel } from 'lucid-ui';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('/api/auth/register', { username, email, password });
      localStorage.setItem('token', res.data.token);
      setError('');
      window.location.reload();
    } catch (e) {
      setError('Registration failed');
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
        label="Email"
        value={email}
        onChange={val => setEmail(val)}
        style={{ marginBottom: 16 }}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={val => setPassword(val)}
        style={{ marginBottom: 16 }}
      />
      <Button onClick={handleRegister} style={{ width: '100%' }}>Register</Button>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </Panel>
  );
}

export default Register;
