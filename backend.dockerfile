FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Create a non-root user with specific UID/GID (if they don't already exist)
ARG USER_ID=1000
ARG GROUP_ID=1000

# Check if group exists, create if not
RUN if ! getent group ${GROUP_ID} > /dev/null; then \
        groupadd -g ${GROUP_ID} appuser; \
    fi

# Check if user exists, create if not
RUN if ! getent passwd ${USER_ID} > /dev/null; then \
        useradd -u ${USER_ID} -g ${GROUP_ID} -m -s /bin/bash appuser; \
    else \
        # User exists, get the username
        USERNAME=$(getent passwd ${USER_ID} | cut -d: -f1) && \
        # Create alias if needed
        if [ "$USERNAME" != "appuser" ]; then \
            ln -s /home/$USERNAME /home/appuser 2>/dev/null || true; \
        fi \
    fi

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ .

# Create media directory with proper permissions
RUN mkdir -p /app/media && \
    chown -R ${USER_ID}:${GROUP_ID} /app

# Copy and set up entrypoint script
COPY docker-entrypoint-backend.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh && \
    chown ${USER_ID}:${GROUP_ID} /docker-entrypoint.sh

# Switch to non-root user by UID (works regardless of username)
USER ${USER_ID}:${GROUP_ID}

EXPOSE 8000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
