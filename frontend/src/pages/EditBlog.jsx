import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogAPI } from '../api/api';

const EditBlog = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        mediaType: 'image',
        mediaUrl: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const response = await blogAPI.getOne(id);
            const blog = response.data.blog;
            setFormData({
                title: blog.title,
                description: blog.description,
                mediaType: blog.mediaType,
                mediaUrl: blog.mediaUrl
            });
            setError('');
        } catch (err) {
            setError('Failed to fetch blog details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.mediaUrl) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            await blogAPI.update(id, formData);

            alert('Blog updated successfully!');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update blog');
            console.error('Update blog error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Loading blog...</div>;

    return (
        <div className="container">
            <h2 style={{ marginBottom: '2rem' }}>Edit Blog</h2>

            {error && <div className="error">{error}</div>}

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            placeholder="Enter blog title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            placeholder="Write your blog content..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="8"
                        />
                    </div>

                    <div className="form-group">
                        <label>Media Type *</label>
                        <select
                            value={formData.mediaType}
                            onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                        >
                            <option value="image">Image</option>
                            <option value="gif">GIF</option>
                            <option value="video">Video</option>
                            <option value="url">External URL</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Media URL *</label>
                        <input
                            type="url"
                            placeholder="Enter media URL (e.g., https://example.com/image.jpg)"
                            value={formData.mediaUrl}
                            onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                        />
                        <small style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                            Provide a direct URL to your {formData.mediaType}
                        </small>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Updating...' : 'Update Blog'}
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBlog;
