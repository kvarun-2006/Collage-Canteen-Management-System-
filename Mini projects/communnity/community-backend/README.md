# Community Management Platform - Backend

This is the FastAPI backend for the Community Management Platform. It provides a robust, asynchronous REST API for managing users, communities, join requests, and meetups.

## Tech Stack
* **Framework:** FastAPI
* **Database:** MongoDB
* **ORM:** Beanie & Motor (Asynchronous MongoDB driver)
* **Authentication:** JWT (JSON Web Tokens)
* **Language:** Python 3

## Prerequisites
* Python 3.8+
* MongoDB running locally (default: `mongodb://localhost:27017`)

## Setup & Installation

1. **Navigate to the backend directory:**
   ```bash
   cd community-backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Create a `.env` file in the root directory (optional) or rely on defaults:
   ```env
   DATABASE_URL=mongodb://localhost:27017
   DATABASE_NAME=community_db
   ```

## Running the Server

Run the development server using Uvicorn:

```bash
python -m uvicorn app.main:app --reload
```

The API will be available at: `http://localhost:8000`

Interactive API Documentation (Swagger UI) is automatically generated and accessible at:
`http://localhost:8000/docs`

## Key Features & Endpoints
* **Authentication (`/api/users`):** Register, Login, JWT verification.
* **Communities (`/api/communities`):** Create, edit, list, and delete communities.
* **Memberships & Join Requests:** Users can apply to join communities; Admins can approve/reject requests.
* **Meetups:** Admins can schedule and manage community meetups.

## Seed Data
For testing purposes, you can quickly populate the database with dummy users:
```bash
python seed_10_users.py
```
