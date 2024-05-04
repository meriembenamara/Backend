const express = require("express");
const router = express.Router(); 
const {createFeedback,getAllFeedbacks} = require("../Controllers/FeedbackController");

// Create new feedback
router.post('/NewFeedback',createFeedback);

// Get all feedback
router.get('/FeedbackList',getAllFeedbacks);



module.exports = router;

