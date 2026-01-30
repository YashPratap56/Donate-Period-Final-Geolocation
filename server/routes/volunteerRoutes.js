const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { applyVolunteer, getVolunteers, updateVolunteerStatus, logVolunteerHours, getLeaderboard } = require('../controllers/volunteerController');

router.get('/leaderboard', getLeaderboard);
router.get('/', getVolunteers);
router.post('/', protect, applyVolunteer);
router.put('/:id/status', protect, updateVolunteerStatus);
router.post('/:id/log', protect, logVolunteerHours);

module.exports = router;
