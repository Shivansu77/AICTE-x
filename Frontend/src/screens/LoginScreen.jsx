import { useState } from "react";
import { loginUserFunction } from '../utils/AuthUtils';
import { useNavigate, Link } from 'react-router-dom';

const LoginScreen = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (validateCredentials()) {
      try {
        const data = await loginUserFunction(credentials);
        // Trigger storage event to notify PrivateRoute components
        window.dispatchEvent(new Event('storage'));
        
        // Only allow students to access the system
        if (data.user.role === "student") {
          navigate('/student');
        } else {
          setError(`Access denied. Only students can access this system. Your role: ${data.user.role}`);
          // Clear stored data for non-students
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Login failed. Please try again.");
      }
    } else {
      setError("Please enter both email and password.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const validateCredentials = () => {
    return credentials.email?.length && credentials.password?.length;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
        </div>
        
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={credentials.email}
            onChange={handleInputChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            required
          />
          
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium transition-colors"
          >
            Continue
          </button>
        </form>
        
        <div className="text-center mt-6">
          <Link to="/register" className="text-sm text-gray-600 hover:text-gray-800">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;