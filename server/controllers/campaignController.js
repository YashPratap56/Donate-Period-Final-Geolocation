const Campaign = require('../models/campaignModel');

const getCampaigns = async (req, res) => {
  try {
    const { status, urgency } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    
    const campaigns = await Campaign.find(filter)
      .populate('ngo', 'name')
      .sort('-createdAt');
    res.json({ success: true, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('ngo', 'name location')
      .populate('donors', 'name');
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const donateToCampaign = async (req, res) => {
  try {
    const { amount, items, userId } = req.body;
    const campaign = await Campaign.findById(req.params.id);
    
    if (amount) campaign.raisedAmount += amount;
    if (items) {
      items.forEach(donated => {
        const target = campaign.targetItems.find(t => t.item === donated.item);
        if (target) target.currentQuantity += donated.quantity;
      });
    }
    if (userId && !campaign.donors.includes(userId)) {
      campaign.donors.push(userId);
    }
    
    await campaign.save();
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getCampaigns, getCampaign, createCampaign, donateToCampaign };
