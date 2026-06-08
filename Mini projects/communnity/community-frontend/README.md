# Community Management Platform - Frontend

This is the React frontend for the Community Management Platform. It provides a clean, responsive, and interactive user interface for discovering communities, managing memberships, and scheduling meetups.

## Tech Stack
* **Framework:** React + Vite
* **Routing:** React Router v6
* **Styling:** Vanilla CSS with modern glassmorphism UI principles
* **Icons:** Lucide React
* **State Management:** React Context API (AuthContext)

## Prerequisites
* Node.js (v16+ recommended)
* The backend API running locally on `http://localhost:8000`

## Setup & Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd community-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

Start the Vite development server:

```bash
npm run dev
```

The web application will be accessible at: `http://localhost:5173/`

## Core Features
* **Directory:** Browse and search a global directory of communities by category or name.
* **Community Detail Pages:** View rich community profiles including cover images, rules, members, and upcoming meetups.
* **Role-Based Views:** 
  * *Visitors* can see public info and request to join.
  * *Members* get access to the internal directory.
  * *Admins* get a dedicated management dashboard.
* **Admin Dashboard:** A streamlined modal interface allowing community creators to approve/reject join requests, edit community details, and schedule new meetups.

## Design Highlights
The application is built with a focus on modern aesthetics:
* Vibrant, dark-mode focused color palettes.
* Glassmorphism effects for cards and modals.
* Smooth micro-animations and hover states for enhanced user engagement.
