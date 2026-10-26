import { Routes, Route, Link } from 'react-router-dom';
import BlogList from './pages/BlogList';
import BlogDetails from './pages/BlogDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import UserRegister from './pages/UserRegister';
import Dashboard from './pages/Dashboard';
import AddBlog from './pages/AddBlog';
import EditBlog from './pages/EditBlog';
import PrivateRoute from './components/PrivateRoute';

function App() {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('username');
        window.location.href = '/';
    };

    return (
        <div className="App">
            <nav className="navbar">
                <div className="container">
                    <h1>Dynamic Blog</h1>
                    <nav>
                        <Link to="/">Home</Link>
                        {token ? (
                            <>
                                {userType === 'admin' && (
                                    <Link to="/dashboard">Dashboard</Link>
                                )}
                                <span style={{ color: '#6b7280', marginRight: '10px' }}>
                                    Welcome, {username}
                                </span>
                                <button onClick={handleLogout} className="btn btn-outline">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login">Login</Link>
                        )}
                    </nav>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<BlogList />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user-register" element={<UserRegister />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/add-blog"
                    element={
                        <PrivateRoute>
                            <AddBlog />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/edit-blog/:id"
                    element={
                        <PrivateRoute>
                            <EditBlog />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
