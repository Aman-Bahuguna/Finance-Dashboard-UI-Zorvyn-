import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { setSidebarOpen } from '../../redux/transactionsSlice';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = ({ children }) => {
  const isSidebarOpen = useSelector((state) => state.transactions.isSidebarOpen);
  const dispatch = useDispatch();

  return (
    <div className="flex bg-background min-h-screen font-sans selection:bg-primary/30">
      {/* Overlay Backdrop for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setSidebarOpen(false))}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>

      <Sidebar />
      
      <div className="flex-1 w-full lg:ml-64 flex flex-col pt-0 lg:pt-6 z-0 overflow-x-hidden min-w-0">
        <Navbar />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 no-scrollbar overflow-y-auto w-full max-w-[100vw] overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
