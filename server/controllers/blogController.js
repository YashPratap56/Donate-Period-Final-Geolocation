const Blog = require('../models/blogModel');

const getBlogs = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    
    const blogs = await Blog.find(filter)
      .populate('author', 'name')
      .sort('-createdAt');
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name');
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getBlogs, getBlog, createBlog };
