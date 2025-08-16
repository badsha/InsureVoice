# IDRA Grievance Management System - Django Backend
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=idra_gms.settings

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django project
COPY backend/ /app/

# Create necessary directories
RUN mkdir -p /app/static /app/media

# Make startup script executable
RUN chmod +x /app/start.sh

# Create non-root user
RUN useradd --create-home --shell /bin/bash appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 6789

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:6789')" || exit 1

# Start command
CMD ["./start.sh"]