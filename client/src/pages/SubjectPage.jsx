import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { getSubjectById, getTasksBySubject, createTask, toggleTask, deleteTask, getUsers } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';

const SUBJECT_META = [
  { icon: '📒', color: '#e9698a', glow: '194,24,91', label: 'Paper 1' },
  { icon: '⚖️', color: '#f8bbd9', glow: '161,136,127', label: 'Paper 2' },
  { icon: '📊', color: '#f48fb1', glow: '244,162,97', label: 'Paper 3' },
  { icon: '🧾', color: '#c2185b', glow: '167,139,250', label: 'Paper 4' },
];

const taskVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25 } },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } },
};

const SubjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  
  const [subject, setSubject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [adding, setAdding] = useState(false);
  const [meta, setMeta] = useState(SUBJECT_META[0]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (subject) {
      const names = ['Accounting', 'Law', 'GST', 'Taxation', 'Tax'];
      const idx = names.findIndex((n) => subject.name.toLowerCase().includes(n.toLowerCase()));
      // Mapping 'Taxation' or 'Tax' to the 3rd index which is index 3
      let mappedIdx = idx;
      if (idx === 4) mappedIdx = 3;
      setMeta(SUBJECT_META[mappedIdx >= 0 ? mappedIdx : 0]);
    }
  }, [subject]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, tRes, uRes] = await Promise.all([
          getSubjectById(id), 
          getTasksBySubject(id),
          getUsers()
        ]);
        setSubject(sRes.data);
        setTasks(tRes.data);
        setAllUsers(uRes.data);
      } catch { toast.error('Failed to load data'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, toast]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socketRef.current = socket;
    socket.emit('joinSubject', id);
    socket.on('taskCreated', (task) => {
      if (String(task.subjectId) === String(id)) {
        setTasks((p) => (p.find((t) => t._id === task._id) ? p : [task, ...p]));
        toast.info(`${task.addedBy?.name || 'Partner'} added a task 🌸`);
      }
    });
    socket.on('taskUpdated', (u) => setTasks((p) => p.map((t) => (t._id === u._id ? u : t))));
    socket.on('taskDeleted', (tid) => setTasks((p) => p.filter((t) => t._id !== tid)));
    return () => { socket.emit('leaveSubject', id); socket.disconnect(); };
  }, [id, toast]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setAdding(true);
    try {
      await createTask(newTask.trim(), id);
      setNewTask('');
    } catch { toast.error('Failed to add task'); }
    finally { setAdding(false); }
  };

  const handleToggle = useCallback(async (taskId) => {
    try { await toggleTask(taskId); } catch { toast.error('Update failed'); }
  }, [toast]);

  const handleDelete = useCallback(async (taskId) => {
    try { await deleteTask(taskId); } catch { toast.error('Delete failed'); }
  }, [toast]);

  const total = tasks.length;
  // Progress calculations are done inside the Comparison UI map below.

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-rose-900 border-t-rose-400 animate-spin shadow-[0_0_15px_rgba(233,105,138,0.5)]" />
      </div>
    );
  }

  // Pre-filter prathana/nitiksha from allUsers to order them reliably in the comparison UI
  const orderedUsers = [...allUsers].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-[100dvh] pb-24 bg-transparent relative">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-white/60 hover:text-white font-medium flex items-center gap-2 mb-8 transition-colors text-sm tracking-wide uppercase"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <header className="glass-panel p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e9698a] rounded-full blur-[80px] opacity-20 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-6 relative z-10">
            <div className="flex-1 flex gap-5">
              <motion.div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl border border-white/20 shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(233,105,138,0.3), rgba(194,24,91,0.1))' }}
                animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                {meta.icon}
              </motion.div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="badge-glass border border-white/20 bg-white/5 text-white/70">{meta.label}</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {subject?.name}
                </h1>
                <p className="text-white/60 text-sm leading-relaxed max-w-lg">{subject?.description}</p>
              </div>
            </div>

            {/* Comparison overall progress box */}
            <div className="shrink-0 flex gap-4 md:border-l border-white/10 md:pl-6">
              {orderedUsers.slice(0, 2).map((u) => {
                const uCompletions = tasks.filter(t => t.completedBy?.some(c => (typeof c === 'object' ? c._id : c) === u._id)).length;
                const uPct = total > 0 ? Math.round((uCompletions / total) * 100) : 0;
                const isMe = u._id === user?._id;
                return (
                  <div key={u._id} className="flex flex-col gap-1.5 items-center">
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">
                      {isMe ? 'You' : u.name.split(' ')[0]}
                    </span>
                    <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center relative overflow-hidden bg-black/40 shadow-inner">
                       <span className={`text-xs font-bold z-10 ${isMe ? 'text-[#f48fb1]' : 'text-white'}`}>
                         {uPct}%
                       </span>
                       <div className="absolute bottom-0 left-0 right-0 bg-[#e9698a]/40 transition-all duration-1000" style={{ height: `${uPct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </header>

        <form onSubmit={handleAddTask} className="mb-10 relative group">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task (e.g. read chapter 4) for both to track..."
            className="w-full bg-black/20 backdrop-blur-3xl border border-white/10 rounded-2xl px-6 py-4 pr-14 text-white placeholder-white/40 focus:outline-none focus:border-[#f48fb1] focus:ring-1 focus:ring-[#f48fb1] transition-all shadow-inner"
            disabled={adding}
          />
          <button
            type="submit"
            disabled={adding || !newTask.trim()}
            className="absolute right-3 top-3 bottom-3 aspect-square flex items-center justify-center rounded-xl bg-white/10 text-white/80 border border-white/10 hover:bg-[#e9698a] hover:border-[#c2185b] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white/10"
          >
            {adding ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </form>

        <div className="space-y-4 relative">
          {tasks.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-6xl opacity-20 block mb-4">💤</span>
              <p className="text-white/40 font-medium">No tasks found. Begin by adding one above.</p>
            </div>
          ) : (
            <AnimatePresence>
              {tasks.map((task) => {
                const isCompletedByMe = task.completedBy?.some(c => (typeof c === 'object' ? c._id : c) === user?._id);
                const allCompleted = task.completedBy?.length >= orderedUsers.length && orderedUsers.length > 0;
                
                return (
                  <motion.div
                    key={task._id}
                    layout="position"
                    variants={taskVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className={`group flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border transition-all ${
                      allCompleted 
                        ? 'bg-black/40 border-transparent shadow-none' 
                        : 'glass-panel border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0 pr-4 border-b border-white/10 md:border-b-0 md:border-r pb-4 md:pb-0">
                      <button onClick={() => handleToggle(task._id)} className="shrink-0 outline-none group/btn relative">
                        <div className={`checkbox-glass ${isCompletedByMe ? 'checked' : ''} group-hover/btn:border-[#f48fb1] group-hover/btn:shadow-[0_0_10px_#f48fb1]`}>
                          {isCompletedByMe && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>

                      <div className="flex-1 min-w-0">
                        <p className={`text-base font-semibold leading-relaxed transition-all ${
                          allCompleted ? 'line-through text-white/30' : 'text-white/90'
                        }`}>
                          {task.title}
                        </p>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1 block">
                          Added by {task.addedBy?.name?.split(' ')[0] || 'Unknown'}
                        </span>
                      </div>
                    </div>

                    {/* Comparison Widget -> Side by side badges for every user in system */}
                    <div className="flex items-center gap-4 shrink-0 px-2 justify-between md:justify-end">
                      {orderedUsers.map((u) => {
                        const hasCompleted = task.completedBy?.some(c => (typeof c === 'object' ? c._id : c) === u._id);
                        return (
                          <div key={u._id} className="flex flex-col items-center gap-1.5 w-16">
                            <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider flex items-center justify-center gap-1 truncate w-full">
                              {u.name.split(' ')[0]}
                            </span>
                            <div 
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                hasCompleted 
                                  ? 'bg-[#81c784]/20 border border-[#81c784]/40 text-[#81c784] shadow-[0_0_10px_rgba(129,199,132,0.2)]'
                                  : 'bg-white/5 border border-white/10 text-white/20'
                              }`}
                            >
                              {hasCompleted ? (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                                </svg>
                              )}
                            </div>
                          </div>
                        )
                      })}

                      <button
                        onClick={() => handleDelete(task._id)}
                        className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 shrink-0 text-white/30 hover:text-[#ef5350] hover:bg-[#ef5350]/10 border border-transparent hover:border-[#ef5350]/20 rounded-lg transition-all ml-2"
                        title="Delete task"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubjectPage;
