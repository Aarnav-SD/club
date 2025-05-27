import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import UserNavBar from './UserNavBar'; // Adjust the path as needed

function HomePage() {
  const { user, events, tierOrder } = useContext(AuthContext);

  // Filter events by tier: same or lower than user tier
  const userTierRank = tierOrder[user.tier] || 0;
  const filteredEvents = events.filter(
    (ev) => (tierOrder[ev.tier] || 0) <= userTierRank
  );

  return (
    <div style={styles.pageContainer} role="main" aria-label="User home with events">
      <UserNavBar />
      <div style={styles.banner}>
        <h2 style={styles.bannerText}>Club Events</h2>
      </div>
      <h1 style={styles.heading}>Welcome, {user.memberId}</h1>
      <p style={styles.tierText}>Your tier: {user.tier}</p>
      <div style={styles.eventsGrid}>
        {filteredEvents.length === 0 && (
          <p style={styles.noEvents}>No events available for your tier.</p>
        )}
        {filteredEvents.map((event) => (
          <Link
            to={`/events/${event.id}`}
            key={event.id}
            style={styles.cardLink}
            aria-label={`View details for event: ${event.title}`}
          >
            <div style={styles.card}>
              <img src={event.imageUrl} alt={event.title} style={styles.cardImg} />
              <div style={styles.cardTitle}>{event.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    maxWidth: '100%',
    margin: '40px auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: 'center',
  },
  banner: {
    width: '100%',
    height: '100vh',
    backgroundImage: 'url("https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Replace with your image URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: '6rem ',
    fontWeight: 'bold',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
  },
  heading: {
    paddingTop:'20vh',
    paddingBottom: '20vh',
    color: '#4b6cb7',
    padding: '0 15px',
    marginBottom: 5,
    textAlign: 'center',
    fontSize:'4rem'
  },
  tierText: {
    marginBottom: 25,
    fontSize: 18,
    color: '#555',
    padding: '0 15px',
    textAlign: 'center',
  },
  eventsGrid: {
    display: 'grid',
    padding: '0 15vw',
    gridTemplateColumns: 'repeat(auto-fill,minmax(460px,1fr))',
    gap: 20,
    textAlign: 'center',
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  card: {
    borderRadius: 10,
    boxShadow: '0 8px 18px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    backgroundColor: '#fff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '20vw',
    transition: 'transform 0.2s ease',
  },
  cardImg: {
    width: '100%',
    height: '15vw',
    objectFit: 'cover',
  },
  cardTitle: {
    padding: '15px',
    fontWeight: '600',
    fontSize: 18,
    flexGrow: 1,
  },
  noEvents: {
    fontStyle: 'italic',
    color: '#777',
  },
};

export default HomePage;
