
const Feedback = require("../Models/FeedbackModel");
// Create new feedback
const createFeedback = async (req, res) => {
    try {
      const { comment, stars,selectedStars,unselectedStars } = req.body;
      const user = req.user;
      const newFeedback = new Feedback({
      //  email: user.email,
        comment: comment,
        stars: stars,
        selectedStars:selectedStars,
        unselectedStars: unselectedStars // Stocker les étoiles non sélectionnées
      });
  
      await newFeedback.save();
  
      res.status(201).json({ success: true, message: 'Feedback enregistré avec succès' });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du feedback :', error);
      res.status(500).json({ success: false, message: 'Une erreur est survenue lors de l\'enregistrement du feedback' });
     }
  };

// Get all feedback
const getAllFeedbacks = async (req, res) => {
    try {
      const user = req.user;
      const feedback = await Feedback.find();
      res.json(feedback);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving feedback');
    }
  };

const updateFeedbackVisibility = async (req, res) => {
 // Mettre à jour un feedback
 const id  = req.params.feedbackId;
 try {
   const feedback = await Feedback.findById(id);

   if (!feedback) {
     return res.status(404).json({ message: 'Feedback not found' });
   }

   feedback.visible = true;
   await feedback.save();

   res.json({ message: 'Feedback visibility updated', feedback });
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};

const getVisibleFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ visible: true });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const makeFeedbacksInvisible = async (req, res) => {
  const id  = req.params.feedbackId;
  try {
    const feedback = await Feedback.findById(id);
 
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
 
    feedback.visible =false;
    await feedback.save();
 
    res.json({ message: 'feedback have been made invisible', feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
 };

  

// Exporting functions to be used in other modules
module.exports = {createFeedback,getAllFeedbacks,updateFeedbackVisibility,getVisibleFeedbacks,makeFeedbacksInvisible};
