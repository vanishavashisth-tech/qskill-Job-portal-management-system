// src/controllers/jobController.js
// Handles incoming HTTP requests for jobs, calls the model layer,
// and shapes the JSON response. All functions are async and pass
// errors to next() so the centralized error middleware can handle them.

const jobModel = require("../models/jobModel");

// GET /api/jobs
async function listJobs(req, res, next) {
  try {
    const jobs = await jobModel.getAllJobs();
    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/jobs/search?keyword=backend
async function searchJobs(req, res, next) {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "A 'keyword' query parameter is required to search jobs",
      });
    }

    const jobs = await jobModel.searchJobs(keyword.trim());
    res.status(200).json({
      success: true,
      message: `Search results for "${keyword}"`,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/jobs/:id
async function getJob(req, res, next) {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Job id must be a valid number",
      });
    }

    const job = await jobModel.getJobById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      data: job,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/jobs
async function createJob(req, res, next) {
  try {
    const { title, company, location, salary, description } = req.body;

    if (!title || !company || !location) {
      return res.status(400).json({
        success: false,
        message: "title, company, and location are required fields",
      });
    }

    const newJob = await jobModel.createJob({
      title,
      company,
      location,
      salary: salary || null,
      description: description || null,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: newJob,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listJobs,
  searchJobs,
  getJob,
  createJob,
};
