import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    mediaType: {
        type: String,
        enum: ['image', 'gif', 'video', 'url'],
        required: true
    },
    mediaUrl: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
