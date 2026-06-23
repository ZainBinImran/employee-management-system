# System Architecture

## Overview
The Employee Management System follows a classic three-tier architecture pattern:
- Each tier is independently containerized
- Tiers communicate over a private Docker network
- No tier is directly accessible except the frontend

## Architecture Diagram
┌─────────────────┐
                │  USER BROWSER   │
                └────────┬────────┘
                         │ HTTP :3000
                ┌────────▼────────┐
                │    FRONTEND     │
                │  React + Nginx  │
                │  ems-frontend   │
                └────────┬────────┘
                         │ HTTP :5000
                ┌────────▼────────┐
                │    BACKEND      │
                │ Node.js/Express │
                │   ems-backend   │
                └────────┬────────┘
                         │ TCP :5432
                ┌────────▼────────┐
                │    DATABASE     │
                │   PostgreSQL    │
                │  ems-database   │
                └─────────────────┘
## Tier Details

### Tier 1 — Frontend
- **Technology:** React.js
- **Server:** Nginx (serves built static files)
- **Port:** 3000
- **Container:** ems-frontend
- **Responsibilities:** UI rendering, user interaction, API consumption

### Tier 2 — Backend
- **Technology:** Node.js + Express
- **Port:** 5000
- **Container:** ems-backend
- **Responsibilities:** Business logic, input validation, database queries, API responses

### Tier 3 — Database
- **Technology:** PostgreSQL 15
- **Port:** 5432
- **Container:** ems-database
- **Responsibilities:** Persistent data storage, data integrity, relationships

## Network Design
All containers communicate on a private Docker bridge network named `ems-network`.
- Only the frontend port (3000) is exposed to the host machine
- The backend port (5000) is accessible within the Docker network only
- The database port (5432) is accessible within the Docker network only

## Data Flow
1. User opens browser at `localhost:3000`
2. Nginx serves the React application
3. React makes API calls to the backend at `http://ems-backend:5000`
4. Backend validates the request and queries PostgreSQL at `ems-database:5432`
5. Database returns results to backend
6. Backend formats and returns JSON to frontend
7. Frontend renders the data to the user
