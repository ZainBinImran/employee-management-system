\# Troubleshooting Guide



\## General Debugging Approach



1\. Check if the container is running: `docker ps`

2\. Check container logs: `docker logs <container-name>`

3\. Check container network: `docker network inspect ems-network`

4\. Verify environment variables: `docker exec <container> env`



\## Common Issues



\### Cannot connect to database



\*\*Symptom:\*\* Backend logs show `ECONNREFUSED` on port 5432



\*\*Causes and fixes:\*\*

\- Database container is not running → `docker start ems-database`

\- Wrong hostname → ensure backend uses `ems-database` (container name), not `localhost`

\- Wrong credentials → verify `.env` matches database container env vars



\---



\### Frontend shows blank page



\*\*Symptom:\*\* Browser shows empty white screen



\*\*Causes and fixes:\*\*

\- Check browser console for errors (F12)

\- Verify backend URL in frontend `.env`

\- Check if backend container is running



\---



\### Port already in use



\*\*Symptom:\*\* `Error: listen EADDRINUSE :::5000`



\*\*Fix:\*\*

```bash

\# Find what's using the port

lsof -i :5000



\# Or on Windows

netstat -ano | findstr :5000



\# Kill the process or change your port in .env

```



\---



\### Container exits immediately



\*\*Symptom:\*\* `docker ps` shows container in "Exited" state



\*\*Fix:\*\*

```bash

\# Read the logs before it exited

docker logs <container-name>

```



\---



\### Changes not reflected in container



\*\*Symptom:\*\* You changed code but container still runs old code



\*\*Fix:\*\*

```bash

\# Rebuild the image

docker build -t ems-backend ./backend



\# Stop old container

docker stop ems-backend-container

docker rm ems-backend-container



\# Run new container

docker run ... ems-backend

```

