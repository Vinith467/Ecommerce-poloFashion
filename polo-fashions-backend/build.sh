#!/usr/bin/env bash
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Create superuser if environment variable is set
if [ "$CREATE_SUPERUSER" = "True" ]; then
    python manage.py shell << EOF
import os
from django.contrib.auth import get_user_model

User = get_user_model()
username = os.environ.get('ADMIN_USERNAME', 'admin')
email = os.environ.get('ADMIN_EMAIL', 'admin@polofashions.com')
password = os.environ.get('ADMIN_PASSWORD', 'admin123')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
        role='admin',
        first_name='Admin',
        last_name='User'
    )
    print(f'✅ Superuser {username} created successfully!')
else:
    print(f'ℹ️ Superuser {username} already exists')
EOF
fi

echo "✅ Build completed successfully!"