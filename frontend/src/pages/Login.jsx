import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/api';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setError('');

            let response;
            if (loginType === 'admin') {
                response = await authAPI.login(formData);
            } else {
                // User login
                response = await axios.post(`${API_URL}/users/login`, formData);
            }

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userType', loginType);
                localStorage.setItem('username', response.data[loginType].username || response.data.user.username);

                // Redirect based on login type
                if (loginType === 'admin') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{loginType === 'admin' ? 'Admin' : 'User'} Login</h2>

                {/* Login Type Toggle */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '20px',
                    borderBottom: '2px solid #e5e7eb'
                }}>
                    <button
                        type="button"
                        onClick={() => setLoginType('user')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: 'none',
                            background: 'transparent',
                            borderBottom: loginType === 'user' ? '3px solid #3b82f6' : 'none',
                            color: loginType === 'user' ? '#3b82f6' : '#6b7280',
                            fontWeight: loginType === 'user' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        User Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginType('admin')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: 'none',
                            background: 'transparent',
                            borderBottom: loginType === 'admin' ? '3px solid #3b82f6' : 'none',
                            color: loginType === 'admin' ? '#3b82f6' : '#6b7280',
                            fontWeight: loginType === 'admin' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        Admin Login
                    </button>
                </div>

                {error && <div className="error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#6b7280' }}>
                    Don't have an account? <Link to={loginType === 'admin' ? '/register' : '/user-register'} style={{ color: '#3b82f6', textDecoration: 'none' }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
