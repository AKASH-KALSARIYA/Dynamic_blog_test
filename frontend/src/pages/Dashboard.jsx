import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogAPI } from '../api/api';

const Dashboard = () => {
    const navigate = useNavigate();
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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) {
            return;
        }

        try {
            await blogAPI.delete(id);
            setBlogs(blogs.filter(blog => blog._id !== id));
            alert('Blog deleted successfully');
        } catch (err) {
            console.error('Failed to delete blog:', err);
            alert('Failed to delete blog');
        }
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="container">
            <div className="dashboard-header">
                <h2>Admin Dashboard</h2>
                <Link to="/add-blog" className="btn btn-primary">
                    + Add New Blog
                </Link>
            </div>

            {error && <div className="error">{error}</div>}

            {blogs.length === 0 ? (
                <div className="card">
                    <p>No blogs yet. Create your first blog!</p>
                </div>
            ) : (
                <div>
                    {blogs.map((blog) => (
                        <div key={blog._id} className="blog-item">
                            <div className="blog-item-info">
                                <h3>{blog.title}</h3>
                                <p>
                                    {blog.description.substring(0, 100)}
                                    {blog.description.length > 100 ? '...' : ''}
                                </p>
                                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                    ❤️ {blog.likes} likes •
                                    💬 {blog.comments.length} comments •
                                    📅 {new Date(blog.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="blog-item-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => navigate(`/edit-blog/${blog._id}`)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(blog._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
