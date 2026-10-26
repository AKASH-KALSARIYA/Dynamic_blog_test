import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../api/api';

const BlogDetails = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Get username from localStorage if logged in
    const loggedInUsername = localStorage.getItem('username') || '';
    const [commentForm, setCommentForm] = useState({ name: loggedInUsername, text: '' });
    const [commentSuccess, setCommentSuccess] = useState('');

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const response = await blogAPI.getOne(id);
            setBlog(response.data.blog);
            setError('');
        } catch (err) {
            setError('Failed to fetch blog details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const response = await blogAPI.like(id);
            setBlog({ ...blog, likes: response.data.likes });
        } catch (err) {
            console.error('Failed to like blog:', err);
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        alert('Blog link copied to clipboard!');
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!commentForm.name || !commentForm.text) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await blogAPI.comment(id, commentForm);
            setBlog({
                ...blog,
                comments: [...blog.comments, response.data.comment]
            });
            setCommentForm({ name: '', text: '' });
            setCommentSuccess('Comment added successfully!');
            setTimeout(() => setCommentSuccess(''), 3000);
        } catch (err) {
            console.error('Failed to add comment:', err);
            alert('Failed to add comment');
        }
    };

    if (loading) return <div className="loading">Loading blog...</div>;
    if (error) return <div className="error container">{error}</div>;
    if (!blog) return <div className="container">Blog not found</div>;

    return (
        <div className="container">
            <Link to="/" className="btn btn-outline" style={{ marginBottom: '2rem' }}>
                ← Back to Blogs
            </Link>

            <div className="card">
                {/* Media Display */}
                {blog.mediaType === 'video' ? (
                    <div className="blog-media-container" style={{ height: '400px' }}>
                        <video className="blog-media" controls>
                            <source src={blog.mediaUrl} type="video/mp4" />
                        </video>
                    </div>
                ) : blog.mediaType === 'url' ? (
                    <div className="blog-media-container" style={{ height: '400px' }}>
                        <iframe
                            src={blog.mediaUrl}
                            title={blog.title}
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <img
                        src={blog.mediaUrl}
                        alt={blog.title}
                        className="blog-media"
                        style={{ height: '400px' }}
                    />
                )}

                <h1 style={{ marginBottom: '1rem', color: '#1f2937' }}>
                    {blog.title}
                </h1>

                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                    Published on {new Date(blog.createdAt).toLocaleDateString()}
                </p>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#374151' }}>
                    {blog.description}
                </p>

                <div className="blog-actions">
                    <button className="action-btn" onClick={handleLike}>
                        ❤️ {blog.likes} Likes
                    </button>

                    <button className="action-btn" onClick={handleShare}>
                        🔗 Share
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <div className="comments-section">
                <h3 style={{ marginBottom: '1.5rem' }}>
                    Comments ({blog.comments.length})
                </h3>

                {commentSuccess && <div className="success">{commentSuccess}</div>}

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="card">
                    <div className="form-group">
                        <label>Your Name</label>
                        <input
                            type="text"
                            placeholder={loggedInUsername ? loggedInUsername : "Enter your name"}
                            value={commentForm.name}
                            onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                            readOnly={!!loggedInUsername}
                            style={loggedInUsername ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
                        />
                        {loggedInUsername && (
                            <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                Logged in as {loggedInUsername}
                            </small>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Your Comment</label>
                        <textarea
                            placeholder="Write your comment..."
                            value={commentForm.text}
                            onChange={(e) => setCommentForm({ ...commentForm, text: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Post Comment
                    </button>
                </form>

                {/* Comments List */}
                <div style={{ marginTop: '2rem' }}>
                    {blog.comments.length === 0 ? (
                        <p style={{ color: '#6b7280' }}>No comments yet. Be the first to comment!</p>
                    ) : (
                        blog.comments.map((comment) => (
                            <div key={comment._id} className="comment">
                                <div className="comment-author">{comment.name}</div>
                                <div className="comment-text">{comment.text}</div>
                                <div className="comment-date">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
