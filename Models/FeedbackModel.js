const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  visible: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  stars: {
    type: [Boolean], // Tableau de booléens représentant l'état de chaque étoile
    required: true
  },
  selectedStars: {
    type: Number, // Tableau d'entiers représentant les étoiles sélectionnées
    required: true
  },
  unselectedStars: {
    type: Number, // Tableau d'entiers représentant les étoiles non sélectionnées
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
