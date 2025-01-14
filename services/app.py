from fastapi import FastAPI

app = FastAPI()

@app.get("/api/check")
async def check_api():
    return {"status": True}
