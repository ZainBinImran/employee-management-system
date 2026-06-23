# API Reference

## Base URL
http://localhost:5000/api

## Response Format
All responses follow this structure:

```json
{
  "success": true,
  "data": {},
  "message": "Human-readable message"
}
```

## Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Verify API is running |

---

### Departments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/departments` | List all departments |
| POST | `/departments` | Create a department |
| PUT | `/departments/:id` | Update a department |
| DELETE | `/departments/:id` | Delete a department |

---

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | List all employees |
| GET | `/employees/:id` | Get one employee |
| POST | `/employees` | Create an employee |
| PUT | `/employees/:id` | Update an employee |
| DELETE | `/employees/:id` | Delete an employee |

---

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get summary statistics |

## Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Internal Server Error |
