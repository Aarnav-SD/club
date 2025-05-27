from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class UserCreate(BaseModel):
    tier: str
    email: EmailStr
    password: str
    isAdmin: bool

class UserOut(UserCreate):
    memberId: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr]
    password: Optional[str]
    isAdmin: Optional[bool]
class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class EventCreate(BaseModel):
    title: str
    date: date 
    maxSeats: int
    tier: str
    description: str
    imageUrl: str

class EventUpdate(BaseModel):
    title: Optional[str]
    maxSeats: Optional[int]
    seatsBooked: Optional[int]

class EventOut(EventCreate):
    id: str
    seatsBooked: int

class BookRequest(BaseModel):
    seats: int


class UserSchema(BaseModel):
    memberId: str
    tier: str
    email: EmailStr
    password: str
    isAdmin: bool