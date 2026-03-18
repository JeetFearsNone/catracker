import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-[320px] px-4 md:px-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, x: 50 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="border flex items-center p-3 gap-3 pointer-events-auto rounded-2xl"
              style={{
                background: t.type === 'error' ? 'rgba(194,24,91,0.4)' : 'rgba(30,10,20,0.6)',
                backdropFilter: 'blur(30px) saturate(200%)',
                WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                borderColor: t.type === 'error' ? 'rgba(233,105,138,0.5)' : 'rgba(255,255,255,0.15)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  t.type === 'success' ? 'bg-[#81c784] text-black shadow-[0_0_15px_#81c784]' :
                  t.type === 'error' ? 'bg-[#ef5350] text-white shadow-[0_0_15px_#ef5350]' :
                  'bg-[#64b5f6] text-black shadow-[0_0_15px_#64b5f6]'
                }`}
              >
                {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
              </div>
              <p className="font-semibold text-sm text-white pr-2 tracking-wide">
                {t.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
