const User = require("../Models/UserModel");
const Plan = require("../Models/PlanModel");
const Statistic = require("../Models/StatisticModel");

const moment = require('moment');

exports.getUserCount = async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      res.json({ count: userCount });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération du nombre d\'utilisateurs' });
    }
  };
  exports.getNewUserToday = async (req, res) => {
    try {
      const today = moment().startOf('day');
      const newUserCount = await User.countDocuments({ createdAt: { $gte: today } });
      res.json({ count: newUserCount });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération du nombre de nouveaux utilisateurs aujourd\'hui' });
    }
  };

  exports.getPlanCount = async (req, res) => {
    try {
      const planCount = await Plan.countDocuments();
      res.json({ count: planCount });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération du nombre de plans' });
    }
  };
  
  exports.getNewPlanToday = async (req, res) => {
    try {
      const today = moment().startOf('day').toDate();
      const newPlanCount = await Plan.countDocuments({ createdAt: { $gte: today } });
      res.json({ count: newPlanCount });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération du nombre de nouveaux plans importés aujourd\'hui' });
    }
  };

  exports.getUserStats = async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const stats = await Statistic.aggregate([
      { $match: { ChartUser: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dayOfYear: "$ChartUser"
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const userData = Array(7).fill(0);
    const categories = Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    stats.forEach(stat => {
      const dayIndex = categories.findIndex(
        date => date === new Date(stat._id * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      );
      if (dayIndex > -1) {
        userData[dayIndex] = stat.count;
      }
    });

    res.json({ data: userData, categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}; 