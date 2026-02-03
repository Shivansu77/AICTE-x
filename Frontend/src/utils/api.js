import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD 
        ? 'https://aicte-x.onrender.com/api' 
        : 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If we get a 401 or 403, the token is invalid - clear it
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Only clear and redirect if we're not already on login/register page
            const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
            if (!isAuthPage) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
