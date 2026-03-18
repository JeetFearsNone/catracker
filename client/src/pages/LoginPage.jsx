import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleQuickLogin = (emailStr) => {
    setEmail(emailStr);
    setPassword('password123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please enter both email and password.');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-transparent">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <span style={{ color: '#f48fb1' }}>CA</span>Tracker
          </h1>
          <p className="text-white/60 text-sm">
            Log in to continue tracking your Group 1 progress.
          </p>
        </div>

        <div className="glass-panel p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="glass-input"
                placeholder="Ex. user1@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="glass-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="glass-btn w-full !mt-6">
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-4">
              Fast Track Credentials
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => handleQuickLogin('user1@example.com')}
                className="text-white text-sm font-medium border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-colors backdrop-blur-md"
              >
                👩‍🎓 Prathana
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('user2@example.com')}
                className="text-white text-sm font-medium border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-colors backdrop-blur-md"
              >
                👨‍🎓 Nitiksha
              </button>
            </div>
          </div>
          <div className="mt-6 text-center pt-6 border-t border-white/10 relative">
            <p className="text-sm text-white/60">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#f48fb1] hover:text-white font-medium transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
