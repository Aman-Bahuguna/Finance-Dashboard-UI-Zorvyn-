import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DatePicker = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(value || new Date()));
  const containerRef = useRef(null);

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const years = [];
  for (let i = currentDate.getFullYear() - 5; i <= currentDate.getFullYear() + 5; i++) {
    years.push(i);
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
  const startDay = startDayOfMonth(currentDate.getMonth(), currentDate.getFullYear());
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col gap-1.5 relative w-full" ref={containerRef}>
      {label && <label className="text-sm font-medium text-text-muted">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 border border-border/70 rounded-xl px-3 py-2.5 outline-none focus:border-primary focus:bg-white/10 text-text transition-all text-sm font-mono flex items-center justify-between group"
      >
        <span className={!value ? 'text-text-muted' : ''}>
          {value ? new Date(value).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Select Date'}
        </span>
        <i className={`pi pi-calendar text-sm group-hover:text-primary transition-colors ${isOpen ? 'text-primary' : 'text-text-muted'}`}></i>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 z-[60] glass p-4 rounded-2xl shadow-2xl border border-white/10 w-72 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  {currentDate.getFullYear()}
                </span>
                <span className="text-base font-display font-bold text-text">
                  {months[currentDate.getMonth()]}
                </span>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 text-text-muted hover:text-text transition-all"
                >
                  <i className="pi pi-chevron-left text-xs"></i>
                </button>
                <button 
                  onClick={() => changeMonth(1)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 text-text-muted hover:text-text transition-all"
                >
                  <i className="pi pi-chevron-right text-xs"></i>
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-[10px] text-center text-text-muted font-bold py-1 uppercase">{d}</div>
              ))}
              {[...Array(startDay)].map((_, i) => (
                <div key={`empty-${i}`} className="p-2"></div>
              ))}
              {[...Array(days)].map((_, i) => {
                const day = i + 1;
                const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
                const isSelected = d === value;
                const isToday = d === today;
                
                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`p-2 text-xs rounded-lg transition-all font-medium
                      ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' : 
                        isToday ? 'bg-primary/20 text-primary border border-primary/30' : 
                        'text-text-muted hover:bg-white/10 hover:text-text'}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 mt-2 border-t border-white/5 flex justify-between">
               <button 
                onClick={() => {
                  onChange(today);
                  setIsOpen(false);
                }}
                className="text-[10px] uppercase font-bold text-primary hover:underline"
               >
                 Today
               </button>
               <button 
                 onClick={() => setIsOpen(false)}
                 className="text-[10px] uppercase font-bold text-text-muted hover:text-text"
               >
                 Close
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;
