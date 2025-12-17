import React, { useState } from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/user/login', { email, password });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 font-sans text-primary">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-lg border-2 border-white relative overflow-hidden">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-peach/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2"></div>

          <div className="text-center mb-10 relative">
            <h1 className="text-4xl font-extrabold mb-2">
              <span className="text-accent-blue">Welcome</span> Back!
            </h1>
            <p className="text-secondary font-medium">Login to access your curriculum</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 font-bold p-3 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 relative">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent-blue transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-accent-yellow/5 border-2 border-transparent focus:border-accent-blue focus:bg-white rounded-full py-4 pl-14 pr-6 font-bold text-primary outline-none transition-all placeholder:text-secondary/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent-peach transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-accent-yellow/5 border-2 border-transparent focus:border-accent-peach focus:bg-white rounded-full py-4 pl-14 pr-6 font-bold text-primary outline-none transition-all placeholder:text-secondary/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-blue text-white font-bold text-lg py-4 rounded-full shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login to Portal'}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-secondary font-bold text-sm">
              Don't have an account? <Link to="/register" className="text-accent-peach hover:underline">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;