from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

# MongoDB client with SSL/TLS support for Atlas
# For mongodb+srv://, SSL is automatically handled, but we can add explicit parameters if needed
client = AsyncIOMotorClient(
    settings.MONGODB_URL,
    serverSelectionTimeoutMS=5000,  # 5 second timeout
    connectTimeoutMS=10000,  # 10 second connection timeout
)
database = client[settings.DB_NAME]

# Collections
users_collection = database.get_collection("users")
tasks_collection = database.get_collection("tasks")
mood_logs_collection = database.get_collection("mood_logs")
sleep_logs_collection = database.get_collection("sleep_logs")
user_skills_collection = database.get_collection("user_skills")
achievements_collection = database.get_collection("achievements")
user_achievements_collection = database.get_collection("user_achievements")
campus_events_collection = database.get_collection("campus_events")

async def get_database():
    return database

