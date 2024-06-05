const Plan = require("../Models/PlanModel");

exports.createPlan = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newPlan = new Plan({ name, description });
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du plan' });
  }
};
