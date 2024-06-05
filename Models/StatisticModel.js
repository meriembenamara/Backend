const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  userCount: {
    type: Number,
    default: 1000
  },
  chartuser: [{
    date: { type: Date, default: Date.now },
    count: { type: Number, default: 0 }
  }],
  // autres champs de statistiques si nécessaires
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

module.exports = Dashboard;
