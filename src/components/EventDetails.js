import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import UserNavBar from './UserNavBar';

function EventDetails() {
  const { id } = useParams();
  const { events, bookSeats } = useContext(AuthContext);
  const navigate = useNavigate();
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState('');

  const event = events.find((ev) => ev.id === id);

  const handleBooking = async () => {
    if (seats < 1 || seats > event.maxSeats - event.seatsBooked) {
      setMessage('Invalid number of seats');
      return;
    }

    try {
      await bookSeats(event.id, seats);
      setMessage(`Successfully booked ${seats} seat(s).`);
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      setMessage('Booking failed');
    }
  };

  if (!event) return <p>Event not found.</p>;

  return (
    <>
      <UserNavBar />
      <div style={styles.container}>
        <div style={styles.card}>
          <img src={event.imageUrl} alt={event.title} style={styles.image} />
          <h2>{event.title}</h2>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Tier:</strong> {event.tier}</p>
          <p><strong>Description:</strong> {event.description}</p>
          <p><strong>Seats Available:</strong> {event.maxSeats - event.seatsBooked}</p>

          <input
            type="number"
            min="1"
            max={event.maxSeats - event.seatsBooked}
            value={seats}
            onChange={(e) => setSeats(parseInt(e.target.value))}
            style={styles.input}
          />
          <button onClick={handleBooking} style={styles.button}>
            Book Seats
          </button>
          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    maxWidth: 600,
    border: '1px solid #ddd',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    maxHeight: 300,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    width: '80px',
    padding: '8px',
    margin: '10px 0',
  },
  button: {
    backgroundColor: '#4b6cb7',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: 5,
  },
  message: {
    marginTop: 10,
    color: '#2563eb',
    fontWeight: 'bold',
  },
};

export default EventDetails;
