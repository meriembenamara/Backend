const express = require('express');
const router = express.Router();
const StatisticController = require('../Controllers/StatisticController');

router.get('/UserCount', StatisticController.getUserCount);
router.get('/newUsersToday', StatisticController.getNewUserToday);
router.get('/PlanCount', StatisticController.getPlanCount);
router.get('/newPlanToday', StatisticController.getNewPlanToday);
router.get('/UserStats', StatisticController.getUserStats);

module.exports = router;
