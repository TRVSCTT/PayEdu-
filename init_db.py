import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

load_dotenv()
db_url = os.environ.get("DATABASE_URL")
if not db_url:
    print("No DATABASE_URL in .env")
    exit(1)

# Extract connection info
# Format: postgresql://user:password@host:port/dbname
import re
match = re.match(r"postgresql://(.*?):(.*?)@(.*?):(\d+)/(.*)", db_url)
if not match:
    print("Invalid DATABASE_URL format")
    exit(1)

user, password, host, port, dbname = match.groups()

try:
    print(f"Connecting to default 'postgres' database to check if {dbname} exists...")
    conn = psycopg2.connect(user=user, password=password, host=host, port=port, dbname="postgres")
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{dbname}'")
    exists = cursor.fetchone()
    if not exists:
        print(f"Database {dbname} does not exist. Creating...")
        cursor.execute(f"CREATE DATABASE \"{dbname}\"")
        print(f"Database {dbname} created successfully.")
    else:
        print(f"Database {dbname} already exists.")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
