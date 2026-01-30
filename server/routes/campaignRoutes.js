const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getCampaigns, getCampaign, createCampaign, donateToCampaign } = require('../controllers/campaignController');

router.get('/', getCampaigns);
router.get('/:id', getCampaign);
router.post('/', protect, createCampaign);
router.post('/:id/donate', donateToCampaign);

module.exports = router;
