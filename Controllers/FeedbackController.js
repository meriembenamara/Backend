
const Feedback = require("../Models/FeedbackModel");
// Create new feedback
const createFeedback = async (req, res) => {
    try {
      const { email, comment, stars,selectedStars,unselectedStars } = req.body;
  
      const newFeedback = new Feedback({
        email: email,
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
      const feedback = await Feedback.find();
      res.json(feedback);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving feedback');
    }
  };
  

// Exporting functions to be used in other modules
module.exports = {createFeedback,getAllFeedbacks};
