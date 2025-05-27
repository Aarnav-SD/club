import bcrypt
import uuid

def rows_to_dicts(cursor, rows):
    cols = [desc[0] for desc in cursor.description]
    return [dict(zip(cols, row)) for row in rows]

def create_user(db, user):
    member_id = f"M{str(uuid.uuid4())[:6]}"
    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode('utf-8')
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO users (memberId, tier, email, password, isAdmin) VALUES (%s, %s, %s, %s, %s)",
        (member_id, user.tier, user.email, hashed, user.isAdmin)
    )
    db.commit()
    cursor.close()
    return {**user.dict(), "memberId": member_id}

def authenticate_user(db, email, password):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()

    print("\n--- LOGIN DEBUG ---")
    print("Fetched user:", user)

    if not user:
        print("❌ No user found.")
        raise Exception("Invalid credentials")

    stored_password = user["password"]
    print("Stored password (raw):", stored_password)
    print("Type of stored password:", type(stored_password))

    if isinstance(stored_password, str):
        stored_password = stored_password.strip().encode("utf-8")

    try:
        input_password = password.encode("utf-8")
        if bcrypt.checkpw(input_password, stored_password):
            print("✅ Password matched!")
            return {"success": True, "user": user}
        else:
            print("❌ Password mismatch")
    except Exception as e:
        print("🔥 bcrypt error:", e)
        raise Exception("Password verification failed")

    raise Exception("Invalid credentials")

def create_event(db, event):
    event_id = f"e{uuid.uuid4().hex[:6]}"
    cursor = db.cursor()
    cursor.execute(
        """INSERT INTO events (id, title, date, maxSeats, seatsBooked, tier, description, imageUrl)
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
        (event_id, event.title, event.date, event.maxSeats, 0, event.tier, event.description, event.imageUrl)
    )
    db.commit()
    cursor.close()
    return {**event.dict(), "id": event_id, "seatsBooked": 0}

def list_events(db):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM events")
    events = cursor.fetchall()
    cursor.close()

    # Cast stringified numbers to int
    for e in events:
        if isinstance(e["maxSeats"], str):
            e["maxSeats"] = int(e["maxSeats"])
        if isinstance(e["seatsBooked"], str):
            e["seatsBooked"] = int(e["seatsBooked"])

    return events

def get_users(db):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()

    # Convert isAdmin to actual bool if needed
    for user in users:
        if isinstance(user["isAdmin"], int):
            user["isAdmin"] = bool(user["isAdmin"])

    return users

def get_user_by_member_id(db, member_id):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE memberId = %s", (member_id,))
    user = cursor.fetchone()
    cursor.close()

    if not user:
        raise Exception("User not found")

    return user

def edit_user(db, member_id, user_data):
    cursor = db.cursor()
    updates = []
    values = []
    for field in user_data.dict(exclude_unset=True):
        updates.append(f"{field} = %s")
        value = user_data.dict()[field]
        if field == "password":
            value = bcrypt.hashpw(value.encode(), bcrypt.gensalt()).decode('utf-8')
        values.append(value)
    query = f"UPDATE users SET {', '.join(updates)} WHERE memberId = %s"
    cursor.execute(query, values + [member_id])
    db.commit()
    cursor.close()
    return {"message": "User updated"}

def edit_event(db, event_id, event_data):
    cursor = db.cursor()
    updates = []
    values = []
    for field in event_data.dict(exclude_unset=True):
        updates.append(f"{field} = %s")
        values.append(event_data.dict()[field])
    query = f"UPDATE events SET {', '.join(updates)} WHERE id = %s"
    cursor.execute(query, values + [event_id])
    db.commit()
    cursor.close()
    return {"message": "Event updated"}

def book_seats(db, event_id, seats):
    cursor = db.cursor()
    cursor.execute("SELECT seatsBooked, maxSeats FROM events WHERE id = %s", (event_id,))
    row = cursor.fetchone()

    if not row or row["seatsBooked"] + seats > row["maxSeats"]:
        cursor.close()
        raise Exception("Not enough seats available")

    cursor.execute(
        "UPDATE events SET seatsBooked = seatsBooked + %s WHERE id = %s", (seats, event_id)
        )   
    db.commit()
    cursor.close()
    return {"message": f"Booked {seats} seats"}

