import express from 'express';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get all blogs (Public)
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('comments')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: blogs.length,
            blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Get single blog (Public)
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('comments');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        res.json({
            success: true,
            blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Create blog (Admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, mediaType, mediaUrl } = req.body;

        const blog = new Blog({
            title,
            description,
            mediaType,
            mediaUrl
        });

        await blog.save();

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Update blog (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, mediaType, mediaUrl } = req.body;

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, description, mediaType, mediaUrl },
            { new: true, runValidators: true }
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        res.json({
            success: true,
            message: 'Blog updated successfully',
            blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Delete blog (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Delete all comments associated with this blog
        await Comment.deleteMany({ blog: req.params.id });

        // Delete the blog
        await Blog.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Like blog (Public)
router.post('/:id/like', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        blog.likes += 1;
        await blog.save();

        res.json({
            success: true,
            message: 'Blog liked successfully',
            likes: blog.likes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Comment on blog (Public)
router.post('/:id/comment', async (req, res) => {
    try {
        const { name, text } = req.body;

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        const comment = new Comment({
            name,
            text,
            blog: req.params.id
        });

        await comment.save();

        blog.comments.push(comment._id);
        await blog.save();

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

export default router;
