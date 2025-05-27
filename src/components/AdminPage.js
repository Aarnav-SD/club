/* Final AdminPage.js */
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import AdminNavBar from './AdminNavBar';
import './styles/AdminPage.css';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const {
    user,
    users,
    events,
    updateUser,
    updateEvent,
    fetchUsers,
    fetchEvents,
  } = useContext(AuthContext);

  const navigate = useNavigate();
  const [localUsers, setLocalUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [localEvents, setLocalEvents] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  useEffect(() => {
    setLocalUsers(users.filter((u) => u.memberId !== user?.memberId));
    setLocalEvents(events);
  }, [users, events, user]);

  const handleUserChange = (field, value) => {
    setSelectedUser({ ...selectedUser, [field]: value });
  };

  const handleEventChange = (index, field, value) => {
    const updated = [...localEvents];
    updated[index] = { ...updated[index], [field]: value };
    setLocalEvents(updated);
  };

  const saveUser = async () => {
    await updateUser(selectedUser);
    alert(`User ${selectedUser.memberId} updated`);
    setSelectedUser(null);
    fetchUsers();
    navigate('/admin');
  };

  const saveEvent = async (event) => {
    await updateEvent(event);
    alert(`Event ${event.id} updated`);
    fetchEvents();
  };

  const tiers = ['Platinum', 'Gold', 'Silver', 'Bronze'];

  return (
    <div>
      <AdminNavBar showProfile />
      <div className="admin-container">
        <div className="user-section">
          <h2>Users</h2>
          {tiers.map((tier) => (
            <div key={tier} className="tier-group">
              <h3>{tier} Tier</h3>
              {localUsers
                .filter((user) => user.tier === tier)
                .map((user) => (
                  <div
                    key={user.memberId}
                    className="user-email"
                    onClick={() => setSelectedUser(user)}
                  >
                    {user.email}
                  </div>
                ))}
            </div>
          ))}
        </div>

        <div className="details-section">
          <h2>Manage Events</h2>
          {localEvents.map((event, idx) => (
            <div key={event.id} className="event-card">
              <img src={event.imageUrl} alt="event banner" />
              <input
                value={event.title}
                onChange={(e) => handleEventChange(idx, 'title', e.target.value)}
                placeholder="Title"
              />
              <input
                type="number"
                value={event.maxSeats}
                onChange={(e) => handleEventChange(idx, 'maxSeats', parseInt(e.target.value))}
                placeholder="Max Seats"
              />
              <input
                type="number"
                value={event.seatsBooked}
                onChange={(e) => handleEventChange(idx, 'seatsBooked', parseInt(e.target.value))}
                placeholder="Booked Seats"
              />
              <button onClick={() => saveEvent(event)}>Save Event</button>
            </div>
          ))}
        </div>
      </div>

      {selectedUser && (
        <>
          <div className="modal-backdrop" onClick={() => setSelectedUser(null)} />
          <div className="modal">
            <div className="edit-user-card">
              <h3>Edit User</h3>
              <input
                value={selectedUser.email}
                onChange={(e) => handleUserChange('email', e.target.value)}
                placeholder="Email"
              />
              <select
                value={selectedUser.tier}
                onChange={(e) => handleUserChange('tier', e.target.value)}
              >
                {tiers.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label htmlFor="adminCheckbox">Admin:</label>
                <input
                  id="adminCheckbox"
                  className='cb'
                  type="checkbox"
                  checked={selectedUser.isAdmin}
                  onChange={(e) => handleUserChange('isAdmin', e.target.checked)}
                />
              </div>
              <div className="modal-buttons">
                <button onClick={saveUser}>Save Changes</button>
                <button onClick={() => setSelectedUser(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPage;
