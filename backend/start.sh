#!/bin/bash
set -e

echo "Starting IDRA Backend Container..."

# Wait for PostgreSQL with more robust checking
echo "Waiting for PostgreSQL to be ready..."
for i in {1..60}; do
    if pg_isready -h postgres -p 5432 -U idra_admin -d idra_gms -q; then
        echo "PostgreSQL is ready!"
        break
    fi
    echo "PostgreSQL not ready yet (attempt $i/60)..."
    sleep 3
done

# Double check with a test connection
echo "Testing database connection..."
python -c "
import psycopg2
try:
    conn = psycopg2.connect(host='postgres', port=5432, user='idra_admin', password='secure_password_2025', dbname='idra_gms')
    conn.close()
    print('Database connection successful!')
except Exception as e:
    print(f'Database connection failed: {e}')
    exit(1)
"

# Run migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Force create demo data (remove existing check)
echo "Creating demo data..."
python manage.py shell -c "
from accounts.models import User
from django.contrib.auth import get_user_model

# Check if demo users exist
alice_exists = User.objects.filter(email='alice@example.com').exists()
bob_exists = User.objects.filter(email='bob@dhakainsurance.com').exists() 
david_exists = User.objects.filter(email='david@idra.gov.bd').exists()

print(f'Alice exists: {alice_exists}')
print(f'Bob exists: {bob_exists}')
print(f'David exists: {david_exists}')

if not (alice_exists and bob_exists and david_exists):
    print('Some demo users missing, creating demo data...')
" 

python manage.py create_demo_data --noinput

# Fix admin permissions for David Wilson in Docker
echo "Ensuring admin permissions for IDRA users..."
python manage.py shell -c "
from accounts.models import User
from django.contrib.auth.models import Group, Permission

try:
    # Fix David Wilson's permissions
    david = User.objects.get(email='david@idra.gov.bd')
    david.is_staff = True
    david.is_superuser = True  # Full admin access for demo
    david.save()
    print(f'✓ David Wilson admin permissions updated: staff={david.is_staff}, super={david.is_superuser}')
    
    # Fix admin user permissions
    admin_user = User.objects.get(email='admin@idra.gov.bd')
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.save()
    print(f'✓ Admin user permissions updated: staff={admin_user.is_staff}, super={admin_user.is_superuser}')
    
except User.DoesNotExist:
    print('⚠️ Admin users not found, they should be created by demo data command')
except Exception as e:
    print(f'⚠️ Error updating admin permissions: {e}')
"

python manage.py collectstatic --noinput

# Start server
echo "Starting server on port 6789..."
echo "🌐 Access at: http://localhost:6789"
echo "👤 Demo users: alice@example.com, david@idra.gov.bd (password: demo123)"
exec python manage.py runserver 0.0.0.0:6789