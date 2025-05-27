import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function LoginPage() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const res = await loginUser(email, password);
    if (res.success) {
      navigate('/', { replace: true });
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container} role="main" aria-label="Login form">
      <h1 style={styles.heading}>Login</h1>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleLogin} style={styles.form} noValidate>
        <label htmlFor="email" style={styles.label}>Email</label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          autoComplete="username"
        />
        <label htmlFor="password" style={styles.label}>Password</label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          autoComplete="current-password"
        />
        <button type="submit" style={styles.button} aria-label="Log in">Login</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: '60px auto',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: 'center',
    marginBottom: 25,
    color: '#4b6cb7',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  label: {
    fontWeight: 600,
    color: '#555',
  },
  input: {
    padding: '10px 14px',
    fontSize: 16,
    borderRadius: 6,
    border: '1.5px solid #ccc',
    transition: 'border-color 0.3s ease',
    outline: 'none',
  },
  button: {
    backgroundColor: '#4b6cb7',
    color: 'white',
    border: 'none',
    padding: '12px',
    fontWeight: 700,
    fontSize: 16,
    borderRadius: 6,
    cursor: 'pointer',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#842029',
    padding: '10px',
    borderRadius: 5,
    fontWeight: 600,
    textAlign: 'center',
  },
};

export default LoginPage;
