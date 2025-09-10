import React, { useState, useEffect, useRef } from 'react';
import { Panel, TextField, Button, VerticalListMenu } from 'lucid-ui';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

function Chat() {
  const [stompConnecting, setStompConnecting] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [registered, setRegistered] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [createError, setCreateError] = useState('');
  const stompClient = useRef(null);
  const token = localStorage.getItem('token');
  // Use react-router location state for username if available
  let username = localStorage.getItem('username');
  try {
    // eslint-disable-next-line
    const location = require('react-router-dom').useLocation();
    if (location.state && location.state.username) {
      username = location.state.username;
    }
  } catch (e) {}
  const handleCreateRoom = async () => {
    setCreateError('');
    if (!newRoomName.trim()) {
      setCreateError('Room name is required');
      return;
    }
    if (!token) {
      setCreateError('You must be logged in to create a chat room.');
      return;
    }
    try {
      const res = await axios.post('/api/chatrooms', { name: newRoomName, type: 'group' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatRooms(prev => [...prev, res.data]);
      setShowCreatePopup(false);
      setNewRoomName('');
    } catch (err) {
      setCreateError('Failed to create chat room');
    }
  };

  useEffect(() => {
    if (!token) return;
    axios.get('/api/chatrooms', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setChatRooms(res.data));
  }, [token]);

  useEffect(() => {
    if (!selectedRoom || !token) return;
    axios.get(`/api/messages/chatroom/${selectedRoom.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMessages(res.data));
  }, [selectedRoom, token]);

  useEffect(() => {
    if (!selectedRoom || !token || !registered) return;
    setStompConnecting(true);
    stompClient.current = new Client({
      brokerURL: null,
      webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        stompClient.current.subscribe('/topic/public', msg => {
          const newMsg = JSON.parse(msg.body);
          setMessages(prev => [...prev, newMsg]);
        });
        setStompConnecting(false);
      },
      onStompError: () => {
        setStompConnecting(false);
      },
      onWebSocketClose: () => {
        setStompConnecting(false);
      }
    });
    stompClient.current.activate();
    return () => stompClient.current.deactivate();
  }, [selectedRoom, token, registered]);

  const sendMessage = () => {
    if (message && stompClient.current && selectedRoom && registered) {
      if (stompClient.current.connected) {
        stompClient.current.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify({
            content: message,
            chatRoom: selectedRoom,
            sender: { username: username || 'Unknown' },
            timestamp: new Date(),
          }),
        });
        setMessage('');
      } else {
        alert('Unable to send message: STOMP connection is not established. Please register for the chat room and wait for connection.');
      }
    }
  };

  return (
    <>
      <Panel>
        <div style={{ fontWeight: 600, fontSize: 18, color: '#1976d2', marginBottom: 12 }}>
          Hello {username}
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <Button
            style={{ width: 180 }}
            onClick={() => setShowCreatePopup(true)}
          >
            Create Chat Room
          </Button>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h3>Chat Rooms</h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {chatRooms.map(room => (
              <a
                key={room.id}
                href="#"
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  background: selectedRoom && selectedRoom.id === room.id ? '#1976d2' : '#f0f0f0',
                  color: selectedRoom && selectedRoom.id === room.id ? '#fff' : '#333',
                  fontWeight: selectedRoom && selectedRoom.id === room.id ? 600 : 400,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  border: selectedRoom && selectedRoom.id === room.id ? '2px solid #1976d2' : '2px solid transparent',
                  boxShadow: selectedRoom && selectedRoom.id === room.id ? '0 2px 8px rgba(25,118,210,0.1)' : 'none'
                }}
                onClick={e => {
                  e.preventDefault();
                  setSelectedRoom(room);
                  setRegistered(false);
                }}
              >
                {room.name}
              </a>
            ))}
          </div>
          {selectedRoom && !registered && (
            <Button
              style={{ marginTop: 16, width: 220 }}
              onClick={() => setRegistered(true)}
            >
              Register for Chat Room
            </Button>
          )}
        </div>
          <div style={{ flex: 1 }}>
            <h3>Messages</h3>
            {!selectedRoom ? (
              <div style={{ color: '#d32f2f', margin: '32px 0', textAlign: 'center', fontWeight: 500 }}>
                Please select a chat room to view and send messages.
              </div>
            ) : (
              <>
                <div style={{ minHeight: 300, maxHeight: 400, overflowY: 'auto', background: '#f9f9f9', borderRadius: 4, padding: 12 }}>
                  {messages.map((msg, idx) => {
                    const currentUsername = localStorage.getItem('username');
                    const displayName = msg.sender?.username === currentUsername
                      ? 'You'
                      : (msg.sender?.username || 'Unknown');
                    return (
                      <div key={idx} style={{ marginBottom: 8 }}>
                        <strong>{displayName}:</strong> {msg.content}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', marginTop: 16 }}>
                  <TextField
                    placeholder="Type a message..."
                    value={message}
                    onChange={val => setMessage(val)}
                    style={{ flex: 1, marginRight: 8 }}
                    disabled={!selectedRoom || !registered || stompConnecting || !stompClient.current?.connected}
                  />
                  <Button onClick={sendMessage} disabled={!selectedRoom || !registered || stompConnecting || !stompClient.current?.connected}>
                    {stompConnecting ? 'Connecting...' : 'Send'}
                  </Button>
                </div>
              </>
            )}
          </div>
        {/* End main Panel content */}
      </Panel>
      {showCreatePopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <Panel style={{ padding: 32, borderRadius: 12, minWidth: 320 }}>
            <h3 style={{ marginBottom: 18 }}>Create Chat Room</h3>
            <TextField
              placeholder="Enter room name"
              value={newRoomName}
              onChange={val => setNewRoomName(val)}
              style={{ marginBottom: 16 }}
            />
            {createError && <div style={{ color: '#d32f2f', marginBottom: 12 }}>{createError}</div>}
            <div style={{ display: 'flex', gap: 12 }}>
              <Button onClick={handleCreateRoom}>Submit</Button>
              <Button onClick={() => { setShowCreatePopup(false); setNewRoomName(''); setCreateError(''); }}>Cancel</Button>
            </div>
          </Panel>
        </div>
      )}
    </>
  );
}

export default Chat;
