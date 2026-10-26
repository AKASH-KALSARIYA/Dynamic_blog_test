import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const registerAdmin = async () => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            username: 'admin',
            email: 'admin@blog.com',
            password: 'admin123'
        });

        console.log('✅ Admin registered successfully!');
        console.log('Username:', response.data.admin.username);
        console.log('Email:', response.data.admin.email);
        console.log('Token:', response.data.token);
        console.log('\nYou can now login with:');
        console.log('Email: admin@blog.com');
        console.log('Password: admin123');
    } catch (error) {
        if (error.response?.data?.message?.includes('already exists')) {
            console.log('ℹ️  Admin already exists!');
            console.log('Login credentials:');
            console.log('Email: admin@blog.com');
            console.log('Password: admin123');
        } else {
            console.error('❌ Error:', error.response?.data?.message || error.message);
        }
    }
};

registerAdmin();
