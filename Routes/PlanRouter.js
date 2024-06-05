const express = require('express');
const router = express.Router();
const planController = require('../Controllers/PlanController');

// Route pour créer un plan
router.post('/', planController.createPlan);


module.exports = router;
