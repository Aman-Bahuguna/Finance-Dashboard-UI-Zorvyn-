import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../redux/transactionsSlice';
import SummaryCards from '../components/dashboard/SummaryCards';
import BalanceChart from '../components/dashboard/BalanceChart';
import CategoryChart from '../components/dashboard/CategoryChart';
import TransactionList from '../components/transactions/TransactionList';
import InsightsPanel from '../components/insights/InsightsPanel';
import BudgetTracker from '../components/dashboard/BudgetTracker';
import ComparisonChart from '../components/dashboard/ComparisonChart';

const Dashboard = () => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();

  const transactions = useSelector((state) => state.transactions.data);
  const status = useSelector((state) => state.transactions.status);
  const activeTab = useSelector((state) => state.transactions.activeTab);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTransactions());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === 'succeeded' && containerRef.current) {
      const elements = containerRef.current.children;
      gsap.fromTo(
        elements, 
        { y: 50, opacity: 0, rotateX: -10 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [status, activeTab]);

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['ID', 'Date', 'Amount', 'Category', 'Type'];
    const rows = transactions.map(t => [t.id, t.date, t.amount, `"${t.category}"`, t.type].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "arthsense_financial_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
             className="w-16 h-16 rounded-full border-t-2 border-r-2 border-primary"
           />
           <div className="text-text-muted font-mono animate-pulse">Syncing secure data...</div>
        </div>
      </div>
    );
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'Transactions':
        return (
          <div className="flex-1 flex flex-col w-full min-h-0">
            <TransactionList showInsights={true} />
          </div>
        );
      case 'Analytics':
        return (
          <div className="flex flex-col gap-8">
            {/* Top Analytics KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <div className="glass p-5 rounded-3xl border border-white/5 flex flex-col items-center text-center">
                  <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase mb-1">Average Monthly Spend</span>
                  <span className="text-xl font-display font-bold text-text tracking-tight">₹42,300</span>
               </div>
               <div className="glass p-5 rounded-3xl border border-white/5 flex flex-col items-center text-center">
                  <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase mb-1">Total Savings Rate</span>
                  <span className="text-xl font-display font-bold text-success tracking-tight">24.5%</span>
               </div>
               <div className="glass p-5 rounded-3xl border border-white/5 flex flex-col items-center text-center">
                  <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase mb-1">Net Flow Margin</span>
                  <span className="text-xl font-display font-bold text-primary tracking-tight">+₹12,400</span>
               </div>
            </div>

            {/* Main Analytical Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <ComparisonChart />
              </div>
              <div className="xl:col-span-1">
                <CategoryChart />
              </div>
            </div>

            {/* Deeper Insights & Budgeting */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <InsightsPanel />
              <BudgetTracker />
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
              <i className="pi pi-cog text-3xl animate-spin-slow"></i>
            </div>
            <h3 className="text-2xl font-display font-bold text-text mb-2">Settings Panel</h3>
            <p className="text-text-muted">Account preferences and security settings will be available in v2.0.</p>
          </div>
        );
      case 'Dashboard':
      default:
        return (
          <>
            <SummaryCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6 lg:mt-8">
              <div className="lg:col-span-2 order-1">
                <BalanceChart />
              </div>
              <div className="order-2">
                <CategoryChart />
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mt-6 lg:mt-8">
              <div className="xl:col-span-2 order-4 xl:order-3">
                <TransactionList showInsights={false} limit={4} />
              </div>
              <div className="order-3 xl:order-4">
                <InsightsPanel />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col pb-10 w-full max-w-full overflow-x-hidden" style={{ perspective: '1000px' }}>
      
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-text tracking-tight mb-1">{activeTab} Overview</h2>
          <p className="text-text-muted text-sm font-medium">Track your spending patterns and earnings.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-primary/10 transition-all active:scale-95 w-max"
        >
          <i className="pi pi-download"></i> Export Report
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
      
    </div>
  );
};

export default Dashboard;
