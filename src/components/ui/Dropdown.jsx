import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = ({ value, options, onChange, label, placeholder, className = '', buttonClassName = '' }) => {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : (placeholder || options[0].label);

  return (
    <div className={`relative flex items-center gap-2 ${className}`} ref={dropdownRef}>
      {label && <span className="text-sm font-medium text-text-muted">{label}</span>}
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`flex items-center justify-between gap-3 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-border/50 rounded-xl px-4 py-2 text-sm text-text font-medium transition-all min-w-[140px] focus:outline-none focus:ring-2 focus:ring-primary/50 ${buttonClassName}`}
        >
          <span>{displayLabel}</span>
          <i className={`pi pi-chevron-down text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
        </button>

        <AnimatePresence>
          {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute z-[100] top-full mt-2 w-full min-w-[170px] bg-white dark:bg-background/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center justify-between
                      ${value === opt.value ? 'bg-primary/20 text-primary font-bold' : 'text-text hover:bg-white/10'}
                    `}
                  >
                    <span>{opt.label}</span>
                    {value === opt.value && <i className="pi pi-check text-[10px] bg-primary text-white p-0.5 rounded-full"></i>}
                  </button>
                ))}
              </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dropdown;
