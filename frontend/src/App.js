import React from 'react';
import { Tabs } from 'lucid-ui';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';

function App() {
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 24 }}>
      <h1 style={{ textAlign: 'center', color: '#3a3a3a' }}>Chat Application</h1>
      <Tabs>
        <Tabs.Tab Title="Login">
          <Login />
        </Tabs.Tab>
        <Tabs.Tab Title="Register">
          <Register />
        </Tabs.Tab>
        <Tabs.Tab Title="Chat">
          <Chat />
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}

export default App;
