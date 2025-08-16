#!/usr/bin/env python
"""
Django development server runner for IDRA GMS
"""
import os
import sys

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'idra_gms.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Default to runserver with specific host and port
    if len(sys.argv) == 1:
        sys.argv.append('runserver')
        sys.argv.append('0.0.0.0:6789')
    
    execute_from_command_line(sys.argv)