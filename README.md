# Job Portal Management System

A RESTful backend API for a job portal, built with **Node.js**, **Express.js**, and **PostgreSQL**. Users can browse and search job listings, apply for jobs, and manage their applications. Built as a Backend Development internship project to demonstrate REST API design, relational database modeling, and clean Express architecture.

## Features

- List all job postings
- Search jobs by title, company, location, or keyword
- View full details of a single job
- Post new job listings
- Apply for a job with validation (job must exist, no duplicate applications per email/job)
- View all applications, a single application, or all applications by a given email
- Withdraw (delete) an application
- Centralized error handling with consistent JSON responses
- Parameterized SQL queries throughout (no SQL injection risk)

## Tech Stack

| Layer          | Technology        |
|----------------|--------------------|
| Runtime        | Node.js            |
| Framework      | Express.js          |
| Database       | PostgreSQL          |
| DB Driver      | `pg`                |
| Config         | `dotenv`            |
| API Testing    | Postman             |

## Project Structure

```
job-portal-management/
├── src/
│   ├── config/
│   │   └── db.js                  # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── jobController.js       # Request handlers for /api/jobs
│   │   └── applicationController.js  # Request handlers for /api/applications
│   ├── routes/
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   ├── models/
│   │   ├── jobModel.js            # All SQL queries for jobs
│   │   └── applicationModel.js    # All SQL queries for applications
│   ├── middleware/
│   │   └── errorMiddleware.js     # Centralized error + 404 handling
│   └── app.js                     # Express app setup
├── database/
│   └── schema.sql                 # Table definitions + sample data
├── .env                           # Local environment variables (not committed)
├── .env.example                   # Template for required env vars
├── .gitignore
├── package.json
├── server.js                      # Entry point
└── README.md
```

## Database Schema

**jobs**

| Column       | Type          | Constraints                  |
|--------------|---------------|-------------------------------|
| id           | SERIAL        | PRIMARY KEY                   |
| title        | VARCHAR(150)  | NOT NULL                      |
| company      | VARCHAR(150)  | NOT NULL                      |
| location     | VARCHAR(150)  | NOT NULL                      |
| salary       | VARCHAR(50)   |                                |
| description  | TEXT          |                                |
| created_at   | TIMESTAMP     | NOT NULL, DEFAULT NOW()       |

**applications**

| Column           | Type          | Constraints                                        |
|------------------|---------------|------------------------------------------------------|
| id               | SERIAL        | PRIMARY KEY                                          |
| job_id           | INTEGER       | NOT NULL, FOREIGN KEY → jobs(id) ON DELETE CASCADE   |
| applicant_name   | VARCHAR(150)  | NOT NULL                                             |
| applicant_email  | VARCHAR(150)  | NOT NULL                                             |
| resume           | TEXT          |                                                       |
| applied_at       | TIMESTAMP     | NOT NULL, DEFAULT NOW()                              |
|                  |               | UNIQUE (job_id, applicant_email) — blocks duplicates |

## API Documentation

Base URL: `http://localhost:5000`

### Jobs

| Method | Endpoint                          | Description                       |
|--------|-------------------------------------|------------------------------------|
| GET    | `/api/jobs`                        | Get all jobs                       |
| GET    | `/api/jobs/search?keyword=backend` | Search jobs by keyword             |
| GET    | `/api/jobs/:id`                    | Get a single job by id             |
| POST   | `/api/jobs`                        | Create a new job                   |

### Applications

| Method | Endpoint                             | Description                              |
|--------|-----------------------------------------|--------------------------------------------|
| POST   | `/api/applications`                    | Apply for a job                            |
| GET    | `/api/applications`                    | Get all applications                       |
| GET    | `/api/applications/:id`                | Get a single application by id             |
| GET    | `/api/applications/user/:email`        | Get all applications by an applicant email |
| DELETE | `/api/applications/:id`                | Withdraw/delete an application             |

### Response Format

**Success**
```json
{
  "success": true,
  "message": "Job fetched successfully",
  "data": { }
}
```

**Error**
```json
{
  "success": false,
  "message": "Job not found"
}
```

### Example: Create a job

`POST /api/jobs`
```json
{
  "title": "Backend Developer Intern",
  "company": "TechNova Solutions",
  "location": "Bengaluru, India",
  "salary": "15000/month",
  "description": "Work on REST APIs using Node.js and PostgreSQL."
}
```

### Example: Apply for a job

`POST /api/applications`
```json
{
  "job_id": 1,
  "applicant_name": "Aarav Sharma",
  "applicant_email": "aarav.sharma@example.com",
  "resume": "https://example.com/resumes/aarav.pdf"
}
```

Response if the job doesn't exist:
```json
{
  "success": false,
  "message": "Cannot apply: job not found"
}
```

Response on a duplicate application:
```json
{
  "success": false,
  "message": "You have already applied for this job with this email"
}
```

## Installation & Setup

### 1. Prerequisites

- Node.js (v18+)
- PostgreSQL (v13+) installed and running
- Postman (for API testing)

### 2. Clone / download the project

```bash
cd job-portal-management
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create the PostgreSQL database

Open the `psql` shell (or use pgAdmin) and run:

```sql
CREATE DATABASE job_portal_db;
```

### 5. Run the schema

From the project root, run:

```bash
psql -U postgres -d job_portal_db -f database/schema.sql
```

This creates the `jobs` and `applications` tables and inserts sample jobs and applications.

### 6. Configure environment variables

Copy the example file and fill in your own PostgreSQL credentials:

```bash
cp .env.example .env
```

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=job_portal_db
PORT=5000
```

Never commit your real `.env` file — it's already listed in `.gitignore`.

### 7. Start the server

```bash
npm start
```

For auto-restart during development:

```bash
npm run dev
```

You should see:
```
Server running on http://localhost:5000
PostgreSQL connected successfully
```

## Testing with Postman

Import the requests below into Postman, or recreate them manually. Set a base URL variable `{{baseUrl}}` = `http://localhost:5000`.

### 1. Fetch all jobs
- **Method:** GET
- **URL:** `{{baseUrl}}/api/jobs`
- **Expected:** `200 OK`, array of jobs in `data`

### 2. Search jobs
- **Method:** GET
- **URL:** `{{baseUrl}}/api/jobs/search?keyword=backend`
- **Expected:** `200 OK`, jobs matching "backend" in title/company/location/description
- **Error case:** omit `keyword` → `400`, `"A 'keyword' query parameter is required to search jobs"`

### 3. Fetch one job
- **Method:** GET
- **URL:** `{{baseUrl}}/api/jobs/1`
- **Expected:** `200 OK`, single job object
- **Error case:** `{{baseUrl}}/api/jobs/9999` → `404`, `"Job not found"`

### 4. Create a job
- **Method:** POST
- **URL:** `{{baseUrl}}/api/jobs`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "title": "QA Engineer",
  "company": "BugHunters Inc",
  "location": "Chennai, India",
  "salary": "30000/month",
  "description": "Manual and automated testing."
}
```
- **Expected:** `201 Created`, the new job with generated `id`
- **Error case:** omit `title` → `400`, `"title, company, and location are required fields"`

### 5. Apply for an existing job
- **Method:** POST
- **URL:** `{{baseUrl}}/api/applications`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "job_id": 1,
  "applicant_name": "Test User",
  "applicant_email": "test.user@example.com",
  "resume": "https://example.com/resume.pdf"
}
```
- **Expected:** `201 Created`, the new application

### 6. Apply for a non-existing job
- **Method:** POST
- **URL:** `{{baseUrl}}/api/applications`
- **Body:** same as above but `"job_id": 9999`
- **Expected:** `404 Not Found`, `"Cannot apply: job not found"`

### 7. Duplicate application
- **Method:** POST
- **URL:** `{{baseUrl}}/api/applications`
- **Body:** same `job_id` + `applicant_email` as request #5, submitted again
- **Expected:** `409 Conflict`, `"You have already applied for this job with this email"`

### 8. Fetch all applications
- **Method:** GET
- **URL:** `{{baseUrl}}/api/applications`
- **Expected:** `200 OK`, array of applications (each includes joined `job_title` and `job_company`)

### 9. Fetch a specific application
- **Method:** GET
- **URL:** `{{baseUrl}}/api/applications/1`
- **Expected:** `200 OK`, single application
- **Error case:** `{{baseUrl}}/api/applications/9999` → `404`, `"Application not found"`

### 10. Fetch applications by email
- **Method:** GET
- **URL:** `{{baseUrl}}/api/applications/user/aarav.sharma@example.com`
- **Expected:** `200 OK`, array of that applicant's applications

### 11. Delete an application
- **Method:** DELETE
- **URL:** `{{baseUrl}}/api/applications/1`
- **Expected:** `200 OK`, `"Application withdrawn successfully"`

### 12. Delete a non-existing application
- **Method:** DELETE
- **URL:** `{{baseUrl}}/api/applications/9999`
- **Expected:** `404 Not Found`, `"Application not found"`

## Future Improvements

- Add JWT-based authentication for employers vs applicants
- Pagination and sorting on `GET /api/jobs` and `GET /api/applications`
- File upload support for resumes (instead of a URL string)
- Role-based access control (admin-only job posting)
- Rate limiting and request validation middleware (e.g. `express-validator`)
- Automated test suite with Jest + Supertest
- Docker Compose setup for one-command local development

## License

ISC
