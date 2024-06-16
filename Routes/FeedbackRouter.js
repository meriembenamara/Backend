const express = require("express");
const { auth  } = require('../Middlewares/auth');

const router = express.Router(); 
const {createFeedback,getAllFeedbacks,updateFeedbackVisibility,getVisibleFeedbacks,makeFeedbacksInvisible} = require("../Controllers/FeedbackController");

// Create new feedback
router.post('/NewFeedback',auth, createFeedback);

// Get all feedback
//router.get('/FeedbackList',auth, getAllFeedbacks);

//router.put('/updateFeedbackVisibility/:feedbackId', auth, updateFeedbackVisibility );
//router.get('/getVisibleFeedbacks',auth , getVisibleFeedbacks );
//router.put('/makeFeedbacksInvisible/:feedbackId', auth, makeFeedbacksInvisible);
// Get all feedback
router.get('/FeedbackList', getAllFeedbacks);

router.put('/updateFeedbackVisibility/:feedbackId', updateFeedbackVisibility );
router.get('/getVisibleFeedbacks', getVisibleFeedbacks );
router.put('/makeFeedbacksInvisible/:feedbackId', makeFeedbacksInvisible);




module.exports = router;

