import pymysql

def get_db():
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="nfesucks",
        database="club",
        cursorclass=pymysql.cursors.DictCursor
    )
    try:
        yield conn
    finally:
        conn.close()


def create_tables():
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="nfesucks",
        database="club",
        cursorclass=pymysql.cursors.DictCursor
    )
    cursor = conn.cursor()

    # Optional: clean corrupted users
    cursor.execute("DROP TABLE IF EXISTS users")

    cursor.execute("""CREATE TABLE IF NOT EXISTS users (
        memberId VARCHAR(10) PRIMARY KEY,
        tier VARCHAR(20),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(100),
        isAdmin BOOLEAN
    )""")

    cursor.execute("""CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(10) PRIMARY KEY,
        title VARCHAR(100),
        date DATE,
        maxSeats INT,
        seatsBooked INT,
        tier VARCHAR(20),
        description TEXT,
        imageUrl TEXT
    )""")

    conn.commit()
    cursor.close()
    conn.close()