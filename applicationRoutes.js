// src/routes/applicationRoutes.js

const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

// IMPORTANT: /user/:email must be defined before /:id
// otherwise Express will treat "user" as an :id value.
router.get("/user/:email", applicationController.getApplicationsByEmail);

router.post("/", applicationController.applyForJob);
router.get("/", applicationController.listApplications);
router.get("/:id", applicationController.getApplication);
router.delete("/:id", applicationController.deleteApplication);

module.exports = router;
