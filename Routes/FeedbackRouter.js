const express = require("express");
const router = express.Router(); 
const {createFeedback,getAllFeedbacks,updateFeedbackVisibility,getVisibleFeedbacks,makeFeedbacksInvisible} = require("../Controllers/FeedbackController");

// Create new feedback
router.post('/NewFeedback',createFeedback);

// Get all feedback
router.get('/FeedbackList',getAllFeedbacks);

router.put('/updateFeedbackVisibility/:feedbackId',updateFeedbackVisibility );
router.get('/getVisibleFeedbacks',getVisibleFeedbacks );
router.put('/makeFeedbacksInvisible/:feedbackId',makeFeedbacksInvisible);




module.exports = router;

