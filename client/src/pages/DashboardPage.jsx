import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSubjects } from '../utils/api';
import Navbar from '../components/Navbar';
import { useToast } from '../context/ToastContext';

const SUBJECT_META = [
  { icon: '📒', color: '#e9698a', desc: 'Accounting Standards & Company Accounts' },
  { icon: '⚖️', color: '#f8bbd9', desc: 'Company Law, LLP Act, General Clauses' },
  { icon: '📊', color: '#f48fb1', desc: 'Standard Costing, Marginal Costing, Budgeting' },
  { icon: '🧾', color: '#c2185b', desc: 'Income Tax (60%) & Direct Taxes' },
];

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 20 } } };

const DashboardPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubjects()
      .then((r) => setSubjects(r.data))
      .catch(() => toast.error('Check network connection'))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="w-10 h-10 rounded-full border-4 border-rose-900 border-t-rose-400 animate-spin shadow-[0_0_15px_rgba(233,105,138,0.5)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f48fb1] shadow-[0_0_10px_#f48fb1] animate-pulse" />
            <span className="text-xs font-bold text-[#f48fb1] uppercase tracking-[0.15em]">Live Sync Active</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Group 1 <span style={{ color: '#f48fb1' }}>Subjects</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl font-medium">
            Track your progress across all CA Inter papers in real-time. Click any subject to begin.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {subjects.map((subject, i) => {
            const meta = SUBJECT_META[i] || SUBJECT_META[0];
            return (
              <motion.div
                key={subject._id}
                variants={itemVariants}
                onClick={() => navigate(`/subject/${subject._id}`)}
                className="glass-panel glass-panel-hover p-6 md:p-8 cursor-pointer flex flex-col justify-between group overflow-hidden relative"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)` }} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                      style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))`, border: `1px solid ${meta.color}66` }}
                    >
                      {meta.icon}
                    </div>
                    <span 
                      className="badge-glass"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
                    >
                      Paper {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {subject.name}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                    {subject.description || meta.desc}
                  </p>
                </div>

                <div className="mt-8 relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-sm font-semibold text-white/50 group-hover:text-[#f48fb1] transition-colors">Start Tracking</span>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-[#f48fb1] transition-all">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
