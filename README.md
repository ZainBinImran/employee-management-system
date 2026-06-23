# Employee Management System
A production-grade three-tier web application built for DevOps learning and portfolio demonstration.

## Architecture
Frontend (React) → Backend API (Node.js/Express) → Database (PostgreSQL)

## Technology Stack
| Layer    | Technology        | Port |
|----------|-------------------|------|
| Frontend | React.js + Nginx  | 3000 |
| Backend  | Node.js + Express | 5000 |
| Database | PostgreSQL        | 5432 |

## Quick Start
> Full setup instructions: [docs/deployment-guide.md](docs/deployment-guide.md)

## Documentation
- [Architecture](docs/architecture.md)
- [API Reference](docs/api-reference.md)
- [Deployment Guide](docs/deployment-guide.md)
- [Troubleshooting](docs/troubleshooting.md)

## Project Structure
employee-management-system/
├── frontend/ # React application
├── backend/ # Express REST API
├── database/ # PostgreSQL schema and migrations
└── docs/ # All documentation
