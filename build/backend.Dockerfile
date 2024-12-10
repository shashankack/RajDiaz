# Use Python image for the backend
FROM python:3.11

# Set the working directory inside the container
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install dependencies
RUN pip install -r requirements.txt

# Copy the backend project into the container
COPY . /app/

# Expose the port the app runs on
EXPOSE 8000
