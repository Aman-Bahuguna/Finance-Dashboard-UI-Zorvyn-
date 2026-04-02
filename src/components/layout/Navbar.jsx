import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/themeSlice';
import { setRole, toggleSidebar } from '../../redux/transactionsSlice';
import { motion } from 'framer-motion';
import Dropdown from '../ui/Dropdown';

import { useRef } from 'react';
import { flushSync } from 'react-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const role = useSelector((state) => state.transactions.role);
  const buttonRef = useRef(null);

  const handleThemeToggle = () => {
    if (!buttonRef.current || !document.startViewTransition) {
      dispatch(toggleTheme());
      return;
    }

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        dispatch(toggleTheme());
      });
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  const roleOptions = [
    { value: 'viewer', label: 'Viewer' },
    { value: 'admin', label: 'Admin' }
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="h-16 lg:h-20 glass flex items-center justify-between px-4 sm:px-8 sticky top-0 lg:top-0 z-40 rounded-none lg:rounded-b-2xl mx-0 lg:mx-6 mt-0 shadow-float border-b lg:border border-white/10"
    >
      <div className="flex items-center gap-4 flex-1 max-w-xs sm:max-w-md lg:max-w-lg">
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text"
        >
          <i className="pi pi-bars text-lg"></i>
        </button>

        <div className="relative w-full hidden sm:block">
          <i className="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"></i>
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full bg-white/5 border border-border/50 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors text-text placeholder-text-muted"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6 text-sm font-medium pr-2">
        
        <div className="hidden md:block">
          <Dropdown 
            label="Role:"
            value={role}
            options={roleOptions}
            onChange={(val) => dispatch(setRole(val))}
          />
        </div>
        
        {/* Professional Theme Toggle */}
        <button 
          ref={buttonRef}
          onClick={handleThemeToggle}
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-border/50 flex items-center justify-center transition-all text-text-muted hover:text-text focus:outline-none shrink-0"
        >
          <motion.div
            animate={{ 
              rotate: themeMode === 'dark' ? 360 : 0,
              scale: themeMode === 'dark' ? [0.8, 1.1, 1] : [0.8, 1.1, 1],
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <i className={`pi ${themeMode === 'dark' ? 'pi-moon' : 'pi-sun'} text-lg`}></i>
          </motion.div>
        </button>

        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border/50">
          <div className="text-right hidden sm:block">
            <div className="font-semibold text-text text-xs sm:text-sm truncate max-w-[100px]">Aman Bahuguna</div>
            <div className="text-[10px] text-text-muted">{role === 'admin' ? 'Administrator' : 'Viewer'}</div>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface border border-border/50 shadow-sm flex items-center justify-center text-text-muted shrink-0">
            <i className="pi pi-user text-sm sm:text-base"></i>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
