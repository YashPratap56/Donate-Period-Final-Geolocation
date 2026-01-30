const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// GET /api/chat/:roomId
// Fetch chat history for a room
router.get('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 })
      .limit(100); // last 100 messages

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('❌ Chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history'
    });
  }
});

module.exports = router;
