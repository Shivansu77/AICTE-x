import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      // Assuming Backend expects firstName, lastName. Splitting name if needed or updating UI.
      // The backend user-controller.js requires firstName, lastName.
      // Let's update the UI to take both or split here. I'll split here for simplicity to keep UI clean or update UI.
      // Let's update UI to matching backend controller: firstName, lastName.

      await api.post('/user/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 font-sans text-primary">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-lg border-2 border-white relative overflow-hidden">
          {/* Decor */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-accent-green/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-peach/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2"></div>

          <div className="text-center mb-8 relative">
            <h1 className="text-4xl font-extrabold mb-2">
              Join <span className="text-accent-peach">AICTE</span>
            </h1>
            <p className="text-secondary font-medium">Create your faculty account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 font-bold p-3 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 relative">
            <div className="flex gap-2">
              <div className="relative group w-1/2">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent-blue transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full bg-accent-blue/5 border-2 border-transparent focus:border-accent-blue focus:bg-white rounded-full py-3.5 pl-10 pr-4 font-bold text-primary outline-none transition-all placeholder:text-secondary/50"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="relative group w-1/2">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full bg-accent-blue/5 border-2 border-transparent focus:border-accent-blue focus:bg-white rounded-full py-3.5 pl-6 pr-4 font-bold text-primary outline-none transition-all placeholder:text-secondary/50"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="relative group">
              <select
                className="w-full bg-accent-blue/5 border-2 border-transparent focus:border-accent-blue focus:bg-white rounded-full py-4 pl-6 pr-6 font-bold text-primary outline-none transition-all appearance-none cursor-pointer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="teacher">Faculty / Professor</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                <ArrowRight className="rotate-90" size={16} />
              </div>
            </div>

            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent-green transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-accent-green/5 border-2 border-transparent focus:border-accent-green focus:bg-white rounded-full py-3.5 pl-14 pr-6 font-bold text-primary outline-none transition-all placeholder:text-secondary/50"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent-yellow transition-colors" size={20} />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-accent-yellow/5 border-2 border-transparent focus:border-accent-yellow focus:bg-white rounded-full py-3.5 pl-14 pr-6 font-bold text-primary outline-none transition-all placeholder:text-secondary/50"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent-peach transition-colors" size={20} />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full bg-accent-peach/5 border-2 border-transparent focus:border-accent-peach focus:bg-white rounded-full py-3.5 pl-14 pr-6 font-bold text-primary outline-none transition-all placeholder:text-secondary/50"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-peach text-white font-bold text-lg py-4 rounded-full shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-secondary font-bold text-sm">
              Already have an account? <Link to="/login" className="text-accent-blue hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;