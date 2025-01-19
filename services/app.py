import uvicorn
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
import aiosqlite
import httpx
from os import getenv as env
from datetime import datetime, timedelta, timezone
import jwt
import json
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from models import UserSession
from db_handling import init_db, get_db


# API settings
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://despesapp.naidd.duckdns.org",
                        # Development options
                        "http://localhost:3000",  
                        "exp://localhost:19000"
                   ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Encryption settings
JWT_SECRET = env("JWT_SECRET")
JWT_ALGORITHM = env("JWT_ALGORITHM")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_session_token(user_info: dict) -> str:
    """Create a JWT session token"""
    expiration = datetime.now(tz=timezone.utc) + timedelta(days=7)
    payload = {
        "user_id": user_info["id"],
        "email": user_info["email"],
        "exp": expiration,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def verify_session_token(token: str = Depends(oauth2_scheme)) -> UserSession:
    """Verify JWT session token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return UserSession(**payload)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid session token")
    

# User info fetching
async def get_google_user_info(access_token: str) -> dict:
    """Fetch user information from Google's userinfo endpoint"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        return response.json()



###########################################################################################################################################
#### API Endpoints ########################################################################################################################
###########################################################################################################################################

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/api/check")
async def check_api():
    return JSONResponse({"status": True})

@app.get("/api/oauth/callback")
async def oauth_callback(request: Request, db: aiosqlite.Connection = Depends(get_db)):
    # Get the authorization code from the query parameters
    code = request.query_params.get("code")
    if not code or code == None:
        print("No authorization code provided")
        raise HTTPException(status_code=400, detail="No authorization code provided")

    # Prepare the token request data
    token_data = {
        "code": code,
        "client_id": env("GOOGLE_CLIENT_ID"),
        "client_secret": env("GOOGLE_CLIENT_SECRET"),
        "redirect_uri": "https://despesapp.naidd.duckdns.org/api/oauth/callback",
        "grant_type": "authorization_code",
    }

    # Exchange code for tokens
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data=token_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
    token_data = token_response.json()
    if "error" in token_data:
        raise HTTPException(status_code=400, detail=token_data["error"])

    # User info and Session token
    user_info = await get_google_user_info(token_data["access_token"])
    session_token = create_session_token(user_info)

    # Store tokens in SQLite
    expires_at = datetime.now(tz=timezone.utc) + timedelta(seconds=token_data["expires_in"])
    await db.execute("""
        INSERT OR REPLACE INTO tokens (user_id, access_token, refresh_token, expires_at)
        VALUES (?, ?, ?, ?)
    """, (
        user_info["id"],
        token_data["access_token"],
        token_data["refresh_token"],
        expires_at.isoformat()
    ))
    await db.commit()

    print(str(datetime.now(tz=timezone.utc)) + ">> Successful authentication from user with email: " + user_info["email"])

    redirect_uri = f"cat.aurruti.despesapp://app?session_token={session_token}&user_info={json.dumps(user_info)}"
    return RedirectResponse(url=redirect_uri)

@app.get("/api/me")
async def get_current_user(session: UserSession = Depends(verify_session_token)):
    """Get current user information"""
    return session

@app.post("/api/refresh")
async def refresh_token(
    session: UserSession = Depends(verify_session_token),
    db: aiosqlite.Connection = Depends(get_db)
):
    """Refresh the access token using the refresh token"""
    # Get stored tokens from database
    async with db.execute(
        "SELECT refresh_token FROM tokens WHERE user_id = ?",
        (session.user_id,)
    ) as cursor:
        row = await cursor.fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="No refresh token found")
        
        stored_refresh_token = row["refresh_token"]

    # Refresh token request to Google
    refresh_data = {
        "client_id": env("GOOGLE_CLIENT_ID"),
        "client_secret": env("GOOGLE_CLIENT_SECRET"),
        "refresh_token": stored_refresh_token,
        "grant_type": "refresh_token",
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://oauth2.googleapis.com/token",
            data=refresh_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

    new_token_data = response.json()
    if "error" in new_token_data:
        raise HTTPException(status_code=400, detail=new_token_data["error"])

    # Update stored tokens in database
    expires_at = datetime.now(tz=timezone.utc) + timedelta(seconds=new_token_data["expires_in"])
    await db.execute("""
        UPDATE tokens 
        SET access_token = ?, expires_at = ?
        WHERE user_id = ?
    """, (
        new_token_data["access_token"],
        expires_at.isoformat(),
        session.user_id
    ))
    await db.commit()
    refreshed_token = create_session_token({"id": session.user_id, "email": session.email})
    print(str(datetime.now(tz=timezone.utc)) + ">> Successful token refresh for user with email: " + session.email)

    return JSONResponse({"status": "Token refreshed successfully", "token": refreshed_token})

@app.post("/api/logout")
async def logout(
    session: UserSession = Depends(verify_session_token),
    db: aiosqlite.Connection = Depends(get_db)
):
    """Logout user and invalidate tokens"""
    await db.execute("DELETE FROM tokens WHERE user_id = ?", (session.user_id,))
    await db.commit()
    print(str(datetime.now(tz=timezone.utc)) + ">> Successful logout from user with email: " + session.email)
    return JSONResponse({"status": "Logged out successfully"})


@app.get("/api/sheets/list")
async def list_user_sheets(
    session: UserSession = Depends(verify_session_token),
    db: aiosqlite.Connection = Depends(get_db)
):
    """List all the user's Google Sheets"""
    # Get the user's tokens
    async with db.execute(
        "SELECT access_token, refresh_token FROM tokens WHERE user_id = ?",
        (session.user_id,)
    ) as cursor:
        token_data = await cursor.fetchone()
        
    if not token_data:
        raise HTTPException(status_code=401, detail="No tokens found")

    # Create Google Sheets API client
    credentials = Credentials(
        token=token_data[0],
        refresh_token=token_data[1],
        client_id=env("GOOGLE_CLIENT_ID"),
        client_secret=env("GOOGLE_CLIENT_SECRET"),
        token_uri="https://oauth2.googleapis.com/token",
    )
    service = build("sheets", "v4", credentials=credentials)

    try: 
        results = service.files().list(
            q="mimeType='application/vnd.google-apps.spreadsheet'",
            fields="files(id, name)"
        ).execute()
        spreadsheets = results.get("files", [])
        return JSONResponse({"spreadsheets": spreadsheets})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch spreadsheets: {e}")



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)