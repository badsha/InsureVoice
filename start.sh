#!/bin/bash
echo "🚀 Starting IDRA Grievance Management System"
echo "📊 Django Backend: http://localhost:8000"
echo "⚛️  React Frontend: http://localhost:3000"
echo "📧 Demo Login: alice@example.com / demo123"
echo "============================================"

# Start Django backend
cd backend && python run.py &
DJANGO_PID=$!

# Wait for Django to start
sleep 3

# Start React frontend  
cd ../frontend && npm run dev &
REACT_PID=$!

# Wait for user interruption
wait

# Cleanup
kill $DJANGO_PID $REACT_PID 2>/dev/null