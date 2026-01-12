# Task Scheduler API - Complete Documentation

## Base URL

```
Development: http://localhost:5000
Production: https://your-app-name.onrender.com
```

## Table of Contents

- [Authentication](#authentication)
- [Tasks](#tasks)
- [Schedules](#schedules)
- [Response Format](#response-format)
- [Error Codes](#error-codes)

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### 1. Register New User

**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account and receive a JWT token.

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**

- `name`: Required, 2-100 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-01-10T10:30:00.000Z",
      "updated_at": "2026-01-10T10:30:00.000Z"
    }
  }
}
```

**Error Response (409 Conflict):**

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive a JWT token.

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-01-10T10:30:00.000Z",
      "updated_at": "2026-01-10T10:30:00.000Z"
    }
  }
}
```

**Error Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Note:** Save the returned `token` for use in subsequent authenticated requests.

---

### 3. Get User Profile

**Endpoint:** `GET /api/auth/profile`

**Description:** Retrieve the authenticated user's profile information.

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-01-10T10:30:00.000Z",
      "updated_at": "2026-01-10T10:30:00.000Z"
    }
  }
}
```

**Error Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 4. Update User Profile

**Endpoint:** `PUT /api/auth/profile`

**Description:** Update the authenticated user's profile.

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "John Updated",
  "password": "newpassword123"
}
```

**Note:** Both fields are optional. Provide only the fields you want to update.

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Updated",
      "email": "john@example.com",
      "created_at": "2026-01-10T10:30:00.000Z",
      "updated_at": "2026-01-10T11:00:00.000Z"
    }
  }
}
```

**cURL Example:**

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated"
  }'
```

---

## Tasks

### 5. Create New Task

**Endpoint:** `POST /api/tasks`

**Description:** Create a new task with a scheduled execution time.

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Monthly Report",
  "description": "Generate and send monthly sales report",
  "scheduled_time": "2026-02-15 10:00:00"
}
```

**Validation Rules:**

- `title`: Required, 3-255 characters
- `description`: Optional
- `scheduled_time`: Required, must be in the future, format: YYYY-MM-DD HH:MM:SS

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Monthly Report",
      "description": "Generate and send monthly sales report",
      "status": "scheduled",
      "created_at": "2026-01-10T10:30:00.000Z",
      "updated_at": "2026-01-10T10:30:00.000Z",
      "user_name": "John Doe",
      "user_email": "john@example.com"
    },
    "schedule": {
      "id": 1,
      "task_id": 1,
      "scheduled_time": "2026-02-15T10:00:00.000Z",
      "executed": false,
      "executed_at": null,
      "created_at": "2026-01-10T10:30:00.000Z",
      "task_title": "Monthly Report",
      "task_description": "Generate and send monthly sales report"
    }
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Scheduled time must be in the future",
      "param": "scheduled_time",
      "location": "body"
    }
  ]
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Monthly Report",
    "description": "Generate and send monthly sales report",
    "scheduled_time": "2026-02-15 10:00:00"
  }'
```

**Note:** A confirmation email will be sent to the user's email address.

---

### 6. Get All Tasks

**Endpoint:** `GET /api/tasks`

**Description:** Retrieve all tasks for the authenticated user.

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [
      {
        "id": 1,
        "user_id": 1,
        "title": "Monthly Report",
        "description": "Generate and send monthly sales report",
        "status": "scheduled",
        "created_at": "2026-01-10T10:30:00.000Z",
        "updated_at": "2026-01-10T10:30:00.000Z",
        "scheduled_time": "2026-02-15T10:00:00.000Z",
        "executed": false
      },
      {
        "id": 2,
        "user_id": 1,
        "title": "Weekly Backup",
        "description": "Backup database",
        "status": "completed",
        "created_at": "2026-01-08T10:30:00.000Z",
        "updated_at": "2026-01-09T10:30:00.000Z",
        "scheduled_time": "2026-01-09T10:00:00.000Z",
        "executed": true
      }
    ]
  }
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 7. Get Task by ID

**Endpoint:** `GET /api/tasks/:id`

**Description:** Retrieve a specific task with its schedules.

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**URL Parameters:**

- `id` (integer): Task ID

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Monthly Report",
      "description": "Generate and send monthly sales report",
      "status": "scheduled",
      "created_at": "2026-01-10T10:30:00.000Z",
      "updated_at": "2026-01-10T10:30:00.000Z",
      "user_name": "John Doe",
      "user_email": "john@example.com"
    },
    "schedules": [
      {
        "id": 1,
        "task_id": 1,
        "scheduled_time": "2026-02-15T10:00:00.000Z",
        "executed": false,
        "executed_at": null,
        "created_at": "2026-01-10T10:30:00.000Z"
      }
    ]
  }
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "Task not found"
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 8. Update Task

**Endpoint:** `PUT /api/tasks/:id`

**Description:** Update a task's title, description, or status.

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**URL Parameters:**

- `id` (integer): Task ID

**Request Body:**

```json
{
  "title": "Updated Monthly Report",
  "description": "Updated description",
  "status": "completed"
}
```

**Note:** All fields are optional. Provide only the fields you want to update.

**Valid Status Values:**

- `pending`
- `scheduled`
- `completed`
- `failed`

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Updated Monthly Report",
      "description": "Updated description",
      "status": "completed",
      "created_at": "2026-01-10T10:30:00.000Z",
      "updated_at": "2026-01-10T11:00:00.000Z",
      "user_name": "John Doe",
      "user_email": "john@example.com"
    }
  }
}
```

**cURL Example:**

```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Monthly Report",
    "description": "Updated description"
  }'
```

---

### 9. Delete Task

**Endpoint:** `DELETE /api/tasks/:id`

**Description:** Delete a task and all its associated schedules and logs.

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**URL Parameters:**

- `id` (integer): Task ID

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "Task not found"
}
```

**cURL Example:**

```bash
curl -X DELETE http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Schedules

### 10. Get Upcoming Schedules

**Endpoint:** `GET /api/schedules/upcoming`

**Description:** Get all upcoming (not yet executed) schedules for the authenticated user.

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Query Parameters:**

- `limit` (integer, optional): Number of schedules to return (default: 10)

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Upcoming schedules retrieved successfully",
  "data": {
    "schedules": [
      {
        "id": 1,
        "task_id": 1,
        "scheduled_time": "2026-02-15T10:00:00.000Z",
        "executed": false,
        "executed_at": null,
        "created_at": "2026-01-10T10:30:00.000Z",
        "title": "Monthly Report",
        "description": "Generate and send monthly sales report"
      },
      {
        "id": 3,
        "task_id": 3,
        "scheduled_time": "2026-03-01T14:00:00.000Z",
        "executed": false,
        "executed_at": null,
        "created_at": "2026-01-10T12:00:00.000Z",
        "title": "Quarterly Review",
        "description": "Review quarterly performance"
      }
    ]
  }
}
```

**cURL Example:**

```bash
curl -X GET "http://localhost:5000/api/schedules/upcoming?limit=5" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 11. Get Task Schedules

**Endpoint:** `GET /api/schedules/task/:taskId`

**Description:** Get all schedules for a specific task.

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**URL Parameters:**

- `taskId` (integer): Task ID

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Schedules retrieved successfully",
  "data": {
    "schedules": [
      {
        "id": 1,
        "task_id": 1,
        "scheduled_time": "2026-02-15T10:00:00.000Z",
        "executed": false,
        "executed_at": null,
        "created_at": "2026-01-10T10:30:00.000Z"
      }
    ]
  }
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/schedules/task/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 12. Update Schedule Time

**Endpoint:** `PUT /api/schedules/:id`

**Description:** Update the scheduled time for a task. The schedule must not have been executed yet.

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**URL Parameters:**

- `id` (integer): Schedule ID

**Request Body:**

```json
{
  "scheduled_time": "2026-03-01 15:00:00"
}
```

**Validation Rules:**

- `scheduled_time`: Required, must be in the future, format: YYYY-MM-DD HH:MM:SS

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Schedule updated successfully",
  "data": {
    "schedule": {
      "id": 1,
      "task_id": 1,
      "scheduled_time": "2026-03-01T15:00:00.000Z",
      "executed": false,
      "executed_at": null,
      "created_at": "2026-01-10T10:30:00.000Z",
      "task_title": "Monthly Report",
      "task_description": "Generate and send monthly sales report"
    }
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Cannot update an executed schedule"
}
```

**cURL Example:**

```bash
curl -X PUT http://localhost:5000/api/schedules/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "scheduled_time": "2026-03-01 15:00:00"
  }'
```

---

### 13. Delete Schedule

**Endpoint:** `DELETE /api/schedules/:id`

**Description:** Delete a specific schedule.

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**URL Parameters:**

- `id` (integer): Schedule ID

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Schedule deleted successfully"
}
```

**cURL Example:**

```bash
curl -X DELETE http://localhost:5000/api/schedules/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 14. Get Task Execution Logs

**Endpoint:** `GET /api/schedules/logs/:taskId`

**Description:** Get execution logs and statistics for a specific task.

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**URL Parameters:**

- `taskId` (integer): Task ID

**Query Parameters:**

- `limit` (integer, optional): Number of logs to return (default: 50)

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Logs retrieved successfully",
  "data": {
    "logs": [
      {
        "id": 1,
        "task_id": 1,
        "schedule_id": 1,
        "action": "task_created",
        "status": "success",
        "message": "Task \"Monthly Report\" created and scheduled",
        "email_sent": false,
        "created_at": "2026-01-10T10:30:00.000Z"
      },
      {
        "id": 2,
        "task_id": 1,
        "schedule_id": 1,
        "action": "task_executed",
        "status": "success",
        "message": "Task \"Monthly Report\" executed successfully",
        "email_sent": true,
        "created_at": "2026-02-15T10:00:00.000Z"
      }
    ],
    "stats": {
      "total_executions": 2,
      "successful": 2,
      "failed": 0,
      "emails_sent": 1
    }
  }
}
```

**cURL Example:**

```bash
curl -X GET "http://localhost:5000/api/schedules/logs/1?limit=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 15. Get All User Logs

**Endpoint:** `GET /api/schedules/logs`

**Description:** Get all execution logs for the authenticated user's tasks.

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Query Parameters:**

- `limit` (integer, optional): Number of logs to return (default: 50)

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Logs retrieved successfully",
  "data": {
    "logs": [
      {
        "id": 3,
        "task_id": 2,
        "schedule_id": 2,
        "action": "task_executed",
        "status": "success",
        "message": "Task \"Weekly Backup\" executed successfully",
        "email_sent": true,
        "created_at": "2026-01-09T10:00:00.000Z",
        "task_title": "Weekly Backup"
      },
      {
        "id": 2,
        "task_id": 1,
        "schedule_id": 1,
        "action": "task_created",
        "status": "success",
        "message": "Task \"Monthly Report\" created and scheduled",
        "email_sent": false,
        "created_at": "2026-01-10T10:30:00.000Z",
        "task_title": "Monthly Report"
      }
    ]
  }
}
```

**cURL Example:**

```bash
curl -X GET "http://localhost:5000/api/schedules/logs?limit=100" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Additional Endpoints

### 16. Health Check

**Endpoint:** `GET /health`

**Description:** Check if the API is running.

**Authentication:** Not required

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Task Scheduler API is running",
  "timestamp": "2026-01-10T10:30:00.000Z",
  "environment": "development"
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5000/health
```

---

## Response Format

### Success Response Structure

```json
{
  "success": true,
  "message": "Operation description",
  "data": {
    // Response data here
  }
}
```

### Error Response Structure

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Optional array of validation errors
  ]
}
```

---

## Error Codes

| Status Code | Description                                                |
| ----------- | ---------------------------------------------------------- |
| 200         | OK - Request succeeded                                     |
| 201         | Created - Resource created successfully                    |
| 400         | Bad Request - Validation error or invalid data             |
| 401         | Unauthorized - Missing or invalid token                    |
| 403         | Forbidden - Access denied to resource                      |
| 404         | Not Found - Resource not found                             |
| 409         | Conflict - Duplicate resource (e.g., email already exists) |
| 500         | Internal Server Error - Server error                       |

---

## Common Error Responses

### Invalid Token

```json
{
  "success": false,
  "message": "Invalid token."
}
```

### Token Expired

```json
{
  "success": false,
  "message": "Token expired."
}
```

### Missing Token

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

## Testing Workflow Example

### 1. Register a new user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Save the token from response**

### 2. Create a task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "scheduled_time": "2026-12-31 23:59:59"
  }'
```

### 3. View all tasks

```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Check upcoming schedules

```bash
curl -X GET http://localhost:5000/api/schedules/upcoming \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. View logs

```bash
curl -X GET http://localhost:5000/api/schedules/logs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Notes

1. **Date Format:** All dates should be in `YYYY-MM-DD HH:MM:SS` format
2. **Timezone:** All times are stored and returned in UTC
3. **Token Expiry:** JWT tokens expire after 7 days by default
4. **Email Notifications:** Emails are sent asynchronously and won't block API responses
5. **Cron Jobs:** The system checks for pending tasks every minute by default
6. **Task Execution:** When a task's scheduled time is reached, it will be automatically executed and an email will be sent

---

## Support

For issues or questions:

- Check the logs for detailed error messages
- Verify your JWT token is valid and not expired
- Ensure scheduled times are in the future
- Confirm database connection is established

---

**Happy Scheduling! 🎯**
