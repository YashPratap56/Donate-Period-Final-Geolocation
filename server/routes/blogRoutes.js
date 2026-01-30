const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getBlogs, getBlog, createBlog } = require('../controllers/blogController');

router.get('/', getBlogs);
router.get('/:id', getBlog);
router.post('/', protect, createBlog);

module.exports = router;
