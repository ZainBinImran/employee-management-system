# Deployment Guide

## Prerequisites

Ensure the following are installed on your machine:

| Tool       | Minimum Version | Check Command        |
|------------|-----------------|----------------------|
| Docker     | 24.0+           | `docker --version`   |
| Git        | 2.39+           | `git --version`      |
| Node.js    | 18.0+           | `node --version`     |

## Environment Setup

Each tier requires its own `.env` file. Never commit `.env` files.
Copy from `.env.example` and fill in values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Running Without Docker (Development)

### Database
```bash
docker run -d \
  --name ems-database \
  -e POSTGRES_DB=ems_db \
  -e POSTGRES_USER=ems_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:15-alpine
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Running With Docker (Full Containerized)

> Instructions will be added in Phase 6 (Dockerization)

## Verifying the Application

- Frontend: http://localhost:3000
- Backend Health: http://localhost:5000/api/health
- API Base: http://localhost:5000/api

## Shutting Down

```bash
docker stop ems-database
docker rm ems-database
```
