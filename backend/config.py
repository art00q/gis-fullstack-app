import os
db_host = os.environ.get('DB_HOST', 'localhost')
DB_URI = f'postgresql://postgres:admin@{db_host}:5432/postgres'