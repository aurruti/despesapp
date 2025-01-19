from pydantic import BaseModel
from datetime import datetime

class UserSession(BaseModel):
    user_id: str
    email: str
    exp: datetime

class SpreadsheetSelection(BaseModel):
    spreadsheetId: str
    name: str