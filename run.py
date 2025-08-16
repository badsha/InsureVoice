#!/usr/bin/env python3
"""
Unified runner for Django + React IDRA Grievance Management System
"""
import os
import sys
import subprocess
import threading
import time
import signal

def run_django():
    """Run Django development server"""
    print("🐍 Starting Django backend server...")
    os.chdir('backend')
    subprocess.run([sys.executable, 'run.py'])

def run_react():
    """Run React development server"""
    print("⚛️  Starting React frontend server...")
    os.chdir('frontend')
    subprocess.run(['npm', 'run', 'dev'])

def run_servers():
    """Run both Django and React servers concurrently"""
    print("🚀 Starting IDRA Grievance Management System...")
    print("📱 Frontend will be available at: http://localhost:3000")
    print("🔧 Backend API will be available at: http://localhost:8000")
    print("Press Ctrl+C to stop both servers\n")
    
    # Start Django in a thread
    django_thread = threading.Thread(target=run_django)
    django_thread.daemon = True
    django_thread.start()
    
    # Wait a moment for Django to start
    time.sleep(3)
    
    # Start React in main thread
    try:
        run_react()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        os._exit(0)

if __name__ == '__main__':
    try:
        run_servers()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        sys.exit(0)