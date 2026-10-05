const express = require('express');
const router = express.Router();
const ScoreController = require('../Controllers/ScoreController');

// Save a score
router.post('/:userId', ScoreController.saveScore);

// Get scores for a user (Parent)
router.get('/:userId', ScoreController.getScoresByUserId);

// Get scores by specificId (For Doctor/Caregiver)
router.get('/lookup/:specificId', ScoreController.getScoresBySpecificId);

module.exports = router;
