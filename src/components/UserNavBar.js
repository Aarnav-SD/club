import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const UserNavBar = () => {
  const { setUser  } = useContext(AuthContext);
  const navigate = useNavigate();

  const activeStyle = {
    fontWeight: 'bold',
    textDecoration: 'underline',
  };

  const handleLogout = () => {
    setUser (null);
    navigate('/login', { replace: true });
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.leftLinks}>
        <NavLink
          to="/home"
          style={({ isActive }) => (isActive ? { ...styles.link, ...activeStyle } : styles.link)}
        >
          Home
        </NavLink>
        <NavLink
          to="/profile"
          style={({ isActive }) => (isActive ? { ...styles.link, ...activeStyle } : styles.link)}
        >
          Profile
        </NavLink>
      </div>
      <button onClick={handleLogout} style={styles.logoutButton} aria-label="Logout">
        Logout
      </button>
    </nav>
  );
};

const styles = {
  nav: {
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1rem 2rem',
    backgroundColor: '#2d6cdf',
    color: '#fff',
  },
  leftLinks: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    color: 'white',
    fontSize: '1rem',
    textDecoration: 'none',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    fontSize: '1rem',
    borderRadius: 4,
    cursor: 'pointer',
  },
};

export default UserNavBar;