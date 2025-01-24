from pydantic import BaseModel
from datetime import datetime

class UserSession(BaseModel):
    user_id: str
    email: str
    exp: datetime

class SpreadsheetSpendingSelection(BaseModel):
    sheetId: str
    amount: float
    type: str
    month: str
    year: int
    colOffset: int = 0
    rowOffset: int = 0