from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-goes-here-for-dev")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 1 day

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

import hashlib

def get_password_hash(password):
    # Pre-hash with SHA256 to support passwords longer than 71 chars (Bcrypt limit)
    pwd_bytes = password.encode('utf-8')
    digest = hashlib.sha256(pwd_bytes).hexdigest()
    return pwd_context.hash(digest)

def verify_password(plain_password, hashed_password):
    # Pre-hash input to match the stored hash logic
    pwd_bytes = plain_password.encode('utf-8')
    digest = hashlib.sha256(pwd_bytes).hexdigest()
    return pwd_context.verify(digest, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
