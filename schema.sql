-- database/schema.sql
-- Run this after creating the job_portal_db database.

-- ============================
-- Table: jobs
-- ============================
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(150) NOT NULL,
    salary VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================
-- Table: applications
-- ============================
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_name VARCHAR(150) NOT NULL,
    applicant_email VARCHAR(150) NOT NULL,
    resume TEXT,
    applied_at TIMESTAMP NOT NULL DEFAULT NOW(),
    -- A single email can only apply once to the same job
    CONSTRAINT unique_application_per_job UNIQUE (job_id, applicant_email)
);

-- Helpful indexes for search and lookups
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs (title);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs (company);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs (location);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications (applicant_email);

-- ============================
-- Sample data: jobs
-- ============================
INSERT INTO jobs (title, company, location, salary, description) VALUES
('Backend Developer Intern', 'TechNova Solutions', 'Bengaluru, India', '15000/month', 'Work on REST APIs using Node.js and PostgreSQL. Great learning environment for beginners.'),
('Frontend Developer', 'PixelCraft Studio', 'Remote', '40000/month', 'Build responsive UIs using React and Tailwind CSS.'),
('Full Stack Developer', 'CodeBridge Pvt Ltd', 'Pune, India', '55000/month', 'Develop and maintain full stack applications using the MERN stack.'),
('Data Analyst', 'InsightWorks', 'Hyderabad, India', '35000/month', 'Analyze business data and build dashboards using SQL and Python.'),
('DevOps Engineer', 'CloudNine Systems', 'Remote', '60000/month', 'Manage CI/CD pipelines and cloud infrastructure on AWS.');

-- ============================
-- Sample data: applications
-- ============================
INSERT INTO applications (job_id, applicant_name, applicant_email, resume) VALUES
(1, 'Aarav Sharma', 'aarav.sharma@example.com', 'https://example.com/resumes/aarav.pdf'),
(2, 'Priya Mehta', 'priya.mehta@example.com', 'https://example.com/resumes/priya.pdf'),
(1, 'Rohan Gupta', 'rohan.gupta@example.com', 'https://example.com/resumes/rohan.pdf');
