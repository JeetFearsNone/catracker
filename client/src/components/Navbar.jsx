import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 pt-4 px-4 pb-0 mb-[-1rem] pointer-events-none">
      <div 
        className="max-w-5xl mx-auto rounded-full px-6 py-3 flex items-center justify-between pointer-events-auto border border-white/10"
        style={{
          background: 'rgba(20, 10, 15, 0.4)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Logo Text Only */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="font-bold text-white text-xl tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
            CA<span style={{ color: '#f48fb1' }}>Tracker</span>
          </span>
        </Link>

        {/* User Menu */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 pr-4 border-r border-white/10">
              <div className="text-right">
                <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
                <p className="text-xs text-white/50">{user.email}</p>
              </div>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold border border-white/20"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(233,105,138,0.3), rgba(194,24,91,0.1))',
                  boxShadow: '0 4px 12px rgba(233,105,138,0.2)'
                }}
              >
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            
            <motion.button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-white/70 hover:text-white flex items-center gap-2 transition-all font-semibold text-sm"
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
