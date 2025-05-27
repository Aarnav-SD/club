import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import EventDetails from './components/EventDetails';
import ProfilePage from './components/ProfilePage';
import AdminProfilePage from './components/AdminProfilePage';

export const AuthContext = createContext(null);

const tierOrder = {
  'Platinum': 3,
  'Gold': 2,
  'Silver': 1,
  'Bronze': 0,
};

function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);

  const loginUser = async (email, password) => {
    const res = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      fetchEvents();
      if (data.user.isAdmin) fetchUsers();
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  };

  const registerUser = async (userData) => {
    const res = await fetch('http://localhost:8000/register_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await res.json();
  };

  const registerEvent = async (eventData) => {
    const res = await fetch('http://localhost:8000/register_event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    return await res.json();
  };

  const fetchEvents = async () => {
    const res = await fetch('http://localhost:8000/events');
    const data = await res.json();
    setEvents(data);
  };

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:8000/admin/users');
    const data = await res.json();
    setUsers(data);
  };

  const updateUser = async (memberId, userData) => {
    await fetch(`http://localhost:8000/admin/user/${memberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  };

  const updateEvent = async (event) => {
    try {
      const res = await fetch(`http://localhost:8000/admin/event/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: event.title,
          maxSeats: event.maxSeats,
          seatsBooked: event.seatsBooked,
        }),
      });
      if (!res.ok) throw new Error('Failed to update event');
      fetchEvents(); // Refresh event list
    } catch (error) {
      console.error('Update event error:', error);
    }
  };
  const bookSeats = async (eventId, seats) => {
    await fetch(`http://localhost:8000/book_event/${eventId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seats }),
    });
    fetchEvents(); // Refresh data
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginUser,
        registerUser,
        registerEvent,
        tierOrder,
        events,
        bookSeats,
        users,
        updateUser,
        updateEvent,
        fetchUsers,
        fetchEvents,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.isAdmin ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/home" replace />
                )
              ) : (
                <LoginPage />
              )
            }
          />
          <Route path="/admin" element={user && user.isAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
          <Route path="/home" element={user && !user.isAdmin ? <HomePage /> : <Navigate to="/" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/events/:id" element={user && !user.isAdmin ? <EventDetails /> : <Navigate to="/" replace />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;