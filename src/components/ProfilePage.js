import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import UserNavBar from './UserNavBar';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8000/profile/${user.memberId}`);
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (!user) {
    return <p>Please log in to see your profile.</p>;
  }

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <>
      <UserNavBar />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Profile</h2>
          <p><strong>Member ID:</strong> {profile.memberId}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Tier:</strong> {profile.tier}</p>
          <p><strong>Is Admin:</strong> {profile.isAdmin ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '0 15px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    borderRadius: 10,
    padding: 30,
    borderTop: '6px solid #2563eb',
    backgroundColor: '#f9fafb',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    width: '300px',
  },
  title: {
    marginBottom: 20,
    color: '#2563eb',
    textAlign: 'center',
  },
};

export default ProfilePage;
