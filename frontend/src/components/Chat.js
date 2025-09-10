import React, { useState, useEffect, useRef } from 'react';
import { Panel, TextField, Button, VerticalListMenu } from 'lucid-ui';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

function Chat() {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const stompClient = useRef(null);
  const token = localStorage.getItem('token');

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
    if (!selectedRoom || !token) return;
    stompClient.current = new Client({
      brokerURL: null,
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        stompClient.current.subscribe('/topic/public', msg => {
          const newMsg = JSON.parse(msg.body);
          setMessages(prev => [...prev, newMsg]);
        });
      },
    });
    stompClient.current.activate();
    return () => stompClient.current.deactivate();
  }, [selectedRoom, token]);

  const sendMessage = () => {
    if (message && stompClient.current && selectedRoom) {
      stompClient.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          content: message,
          chatRoom: selectedRoom,
          sender: { username: 'You' },
          timestamp: new Date(),
        }),
      });
      setMessage('');
    }
  };

  return (
    <Panel>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ width: 200 }}>
          <h3>Chat Rooms</h3>
          <VerticalListMenu
            selectedIndices={selectedRoom ? [chatRooms.findIndex(room => room.id === selectedRoom.id)] : []}
            onSelect={indices => setSelectedRoom(chatRooms[indices[0]])}
          >
            {chatRooms.map(room => (
              <VerticalListMenu.Item key={room.id}>{room.name}</VerticalListMenu.Item>
            ))}
          </VerticalListMenu>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Messages</h3>
          <div style={{ minHeight: 300, maxHeight: 400, overflowY: 'auto', background: '#f9f9f9', borderRadius: 4, padding: 12 }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                <strong>{msg.sender?.username || 'Unknown'}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', marginTop: 16 }}>
            <TextField
              placeholder="Type a message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default Chat;
