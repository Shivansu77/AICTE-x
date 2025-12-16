import { useState } from "react";
import { registerUserFunction } from '../utils/AuthUtils';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "student"    // default to "student"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  // cycle through roles: student -> teacher -> admin -> student
  const handleToggleRole = () => {
    const roles = ["student", "teacher", "admin"];
    const currentIndex = roles.indexOf(form.role);
    const nextIndex = (currentIndex + 1) % roles.length;
    setForm({ ...form, role: roles[nextIndex] });
  };

  const validateForm = () =>
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) {
      setError("All fields are required and password must be at least 6 characters.");
      return;
    }
    try {
      const userData = await registerUserFunction(form);
      // Only redirect students to student page, others get access denied
      if (userData.user.role === "student") {
        navigate("/student");
      } else {
        setError(`Access restricted. Only students can access this system. Your role: ${userData.user.role}`);
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={form.firstName}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            required
          />
          
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={form.lastName}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            required
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            required
          />
          
          <div className="text-center">
            <button
              type="button"
              onClick={handleToggleRole}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Role: {form.role} (click to change)
            </button>
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium transition-colors"
          >
            Continue
          </button>
        </form>
        
        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-gray-600 hover:text-gray-800">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;