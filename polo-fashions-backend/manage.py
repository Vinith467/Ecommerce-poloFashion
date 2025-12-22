#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def create_admin():
    from django.contrib.auth import get_user_model
    User = get_user_model()

    username = os.environ.get("ADMIN_USERNAME")
    password = os.environ.get("ADMIN_PASSWORD")
    email = os.environ.get("ADMIN_EMAIL")

    if username and password:
        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(
                username=username,
                password=password,
                email=email,
            )
            print("✅ Superuser created")



def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "polo_fashions.settings")
    if os.environ.get("CREATE_SUPERUSER") == "True":
        import django
        django.setup()
        create_admin()
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
