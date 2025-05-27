import React, { useContext } from 'react';
import { AuthContext } from '../App';
import AdminNavBar from './AdminNavBar';
import './styles/AdminProfilePage.css';

function AdminProfilePage() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <AdminNavBar />
      <div className="profile-container">
        <h2>Admin Profile</h2>
        <div className="profile-card">
          <p><strong>Member ID:</strong> {user?.memberId}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Tier:</strong> {user?.tier}</p>
          <p><strong>Admin:</strong> {user?.isAdmin ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminProfilePage;
