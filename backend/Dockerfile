FROM python:alpine

WORKDIR /app

# Install system dependencies using Alpine's apk
# build-base includes common build tools like make, gcc, etc.
# postgresql-dev provides headers for building psycopg2 (if needed)
RUN apk update && apk add --no-cache \
    build-base \
    postgresql-dev \
    && rm -rf /var/cache/apk/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create a directory for static files
RUN mkdir -p /app/static/images/products

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]