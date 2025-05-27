from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import EmailStr
from typing import List, Any
from database import get_db, create_tables
from schemas import *
from crud import *
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_tables()

@app.post("/register_user", response_model=UserOut)
def register_user(user: UserCreate, db=Depends(get_db)):
    return create_user(db, user)

@app.post("/login")
def login(credentials: LoginSchema, db=Depends(get_db)):
    try:
        return authenticate_user(db, credentials.email, credentials.password)
    except Exception as e:
        print("LOGIN ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/register_event", response_model=EventOut)
def register_event(event: EventCreate, db=Depends(get_db)):
    return create_event(db, event)

@app.get("/profile/{member_id}", response_model=UserOut)
def get_profile(member_id: str, db=Depends(get_db)):
    return get_user_by_member_id(db, member_id)

@app.get("/events", response_model=List[EventOut])
def get_events(db=Depends(get_db)):
    return list_events(db)

@app.post("/book_event/{event_id}")
def book_event(event_id: str, req: BookRequest, db=Depends(get_db)):
    return book_seats(db, event_id, req.seats)

@app.get("/admin/users")
def list_all_users(db: Any = Depends(get_db)):
    users = get_users(db)
    print("\n--- DEBUG USERS ---")
    for u in users:
        print(u)
    return users

@app.get("/admin/events", response_model=List[EventOut])
def get_all_events(db=Depends(get_db)):
    return list_events(db)

@app.put("/admin/user/{member_id}")
def update_user(member_id: str, user: UserUpdate, db=Depends(get_db)):
    return edit_user(db, member_id, user)

@app.put("/admin/event/{event_id}")
def update_event(event_id: str, event: EventUpdate, db=Depends(get_db)):
    return edit_event(db, event_id, event)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)