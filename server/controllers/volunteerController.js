const Volunteer = require('../models/volunteerModel');

const applyVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.create({
      user: req.user._id,
      ...req.body
    });
    res.status(201).json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find()
      .populate('user', 'name email')
      .populate('ngo', 'name');
    res.json({ success: true, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateVolunteerStatus = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const logVolunteerHours = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    volunteer.tasks.push(req.body);
    volunteer.hours += req.body.hoursSpent || 0;
    await volunteer.save();
    res.json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ status: 'active' })
      .populate('user', 'name')
      .sort('-hours')
      .limit(10);
    res.json({ success: true, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { applyVolunteer, getVolunteers, updateVolunteerStatus, logVolunteerHours, getLeaderboard };
