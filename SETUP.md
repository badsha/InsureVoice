# InsureVoice - Setup

## Docker (Recommended)
```bash
docker-compose up --build
```
Access: http://localhost:6789/  
Demo Users: alice@example.com, bob@dhakainsurance.com, david@idra.gov.bd (password: demo123)

## Local Setup
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb idra_grievance_db

# Setup Django
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py create_demo_data
python manage.py runserver 0.0.0.0:6789
```

## Mobile App
```bash
cd mobile
npm install
npx expo start
```

## Docker Troubleshooting
If you get `ModuleNotFoundError: No module named 'dj_database_url'`:
```bash
# Rebuild containers to install missing packages
docker-compose down
docker-compose up --build
```

## Other Troubleshooting
- Kill port conflicts: `sudo lsof -t -i:6789 | xargs -r kill -9`
- Reset database: `docker-compose down --volumes`
- Check container logs: `docker logs idra-backend`
- If demo users don't work: Wait for database setup to complete fully