import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, setSidebarOpen } from '../../redux/transactionsSlice';

const Sidebar = () => {
  const activeTab = useSelector((state) => state.transactions.activeTab);
  const isSidebarOpen = useSelector((state) => state.transactions.isSidebarOpen);
  const dispatch = useDispatch();

  // Detect if we are on desktop to prevent the "closed" variant from hiding the sidebar
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        dispatch(setSidebarOpen(false));
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 1 },
    desktop: { x: 0, opacity: 1 }
  };

  return (
    <motion.aside 
      initial={false}
      animate={isDesktop ? "desktop" : (isSidebarOpen ? "open" : "closed")}
      variants={sidebarVariants}
      transition={{ type: 'spring', stiffness: 400, damping: 40, mass: 0.8 }}
      style={{ willChange: "transform" }}
      className={`w-64 h-screen fixed left-0 top-0 glass flex flex-col z-[50] p-6 shadow-2xl lg:shadow-[none]`}
    >
      <div className="flex items-center justify-between gap-3 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shrink-0">
            <i className="pi pi-wallet"></i>
          </div>
          <h1 className="text-xl font-display font-bold tracking-tight truncate">ArthSense</h1>
        </div>
        
        <button 
          onClick={() => dispatch(setSidebarOpen(false))}
          className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-white/10 shrink-0"
        >
          <i className="pi pi-times"></i>
        </button>
      </div>
      
      <nav className="flex-1 flex flex-col gap-2">
        <NavItem 
          icon="pi pi-th-large" 
          label="Dashboard" 
          active={activeTab === 'Dashboard'} 
          onClick={() => dispatch(setActiveTab('Dashboard'))}
        />
        <NavItem 
          icon="pi pi-list" 
          label="Transactions" 
          active={activeTab === 'Transactions'} 
          onClick={() => dispatch(setActiveTab('Transactions'))}
        />
        <NavItem 
          icon="pi pi-chart-line" 
          label="Analytics" 
          active={activeTab === 'Analytics'} 
          onClick={() => dispatch(setActiveTab('Analytics'))}
        />
        <NavItem 
          icon="pi pi-cog" 
          label="Settings" 
          active={activeTab === 'Settings'} 
          onClick={() => dispatch(setActiveTab('Settings'))}
        />
      </nav>
      
      <div className="mt-auto pt-6 border-t border-border/50">
        <div className="text-sm text-text-muted font-medium mb-4">Supported By</div>
        <div className="glass p-4 rounded-xl text-xs flex justify-between items-center text-text cursor-pointer hover:bg-white/10 transition-colors">
          <span>Get Help</span>
          <i className="pi pi-question-circle"></i>
        </div>
      </div>
    </motion.aside>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm
    ${active 
      ? 'bg-primary text-white shadow-sm shadow-primary/10' 
      : 'text-text-muted hover:bg-white/5 hover:text-text'
    }`}
  >
    <i className={`${icon} ${active ? 'text-white' : ''}`}></i>
    <span>{label}</span>
  </button>
);

export default Sidebar;
