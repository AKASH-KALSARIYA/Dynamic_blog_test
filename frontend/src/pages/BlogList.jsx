import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../api/api';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await blogAPI.getAll();
            setBlogs(response.data.blogs);
            setError('');
        } catch (err) {
            setError('Failed to fetch blogs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (id) => {
        try {
            const response = await blogAPI.like(id);
            // Update the blog in the list
            setBlogs(blogs.map(blog =>
                blog._id === id ? { ...blog, likes: response.data.likes } : blog
            ));
        } catch (err) {
            console.error('Failed to like blog:', err);
        }
    };

    const handleShare = (id) => {
        const url = `${window.location.origin}/blog/${id}`;
        navigator.clipboard.writeText(url);
        alert('Blog link copied to clipboard!');
    };

    if (loading) return <div className="loading">Loading blogs...</div>;
    if (error) return <div className="error container">{error}</div>;

    return (
        <div className="container">
            <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>Latest Blogs</h2>

            {blogs.length === 0 ? (
                <div className="card">
                    <p>No blogs available. Check back later!</p>
                </div>
            ) : (
                <div className="blog-grid">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="card">
                            {/* Media Display */}
                            {blog.mediaType === 'video' ? (
                                <div className="blog-media-container">
                                    <video className="blog-media" controls>
                                        <source src={blog.mediaUrl} type="video/mp4" />
                                    </video>
                                </div>
                            ) : blog.mediaType === 'url' ? (
                                <div className="blog-media-container">
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
                                />
                            )}

                            <h3 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>
                                {blog.title}
                            </h3>

                            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                                {blog.description.substring(0, 120)}
                                {blog.description.length > 120 ? '...' : ''}
                            </p>

                            <div className="blog-actions">
                                <button
                                    className="action-btn"
                                    onClick={() => handleLike(blog._id)}
                                >
                                    ❤️ {blog.likes} Likes
                                </button>

                                <button
                                    className="action-btn"
                                    onClick={() => handleShare(blog._id)}
                                >
                                    🔗 Share
                                </button>

                                <Link to={`/blog/${blog._id}`} className="btn btn-primary">
                                    Read More
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogList;
