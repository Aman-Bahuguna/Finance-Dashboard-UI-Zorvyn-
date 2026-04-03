import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addTransaction, deleteTransaction, editTransaction } from '../../redux/transactionsSlice';
import Dropdown from '../ui/Dropdown';
import DatePicker from '../ui/DatePicker';
import TransactionInsights from './TransactionInsights';
import { convertToCSV, downloadFile } from '../../utils/exportHelpers';

const TransactionList = ({ showInsights = false, limit = null }) => {
  const transactions = useSelector((state) => state.transactions.data);
  const role = useSelector((state) => state.transactions.role);
  const dispatch = useDispatch();

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ category: '', amount: '', type: 'expense', paymentMethod: 'UPI', status: 'Completed', date: new Date().toISOString().split('T')[0] });

  // Reset to first page when filtering
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, sortBy]);

  // Filtering & Sorting Logic memoized
  const allFilteredData = useMemo(() => {
    let result = transactions.filter(t => {
      if (filter !== 'All' && filter.toLowerCase() !== t.type) return false;
      if (searchTerm && !t.category.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });

    return result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amt-desc') return b.amount - a.amount;
      if (sortBy === 'amt-asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, filter, searchTerm, sortBy]);

  const totalPages = Math.ceil(allFilteredData.length / pageSize);

  const filteredData = useMemo(() => {
    if (limit) {
      return allFilteredData.slice(0, limit);
    } else {
      const startIndex = (currentPage - 1) * pageSize;
      return allFilteredData.slice(startIndex, startIndex + pageSize);
    }
  }, [allFilteredData, limit, currentPage, pageSize]);



  const handleOpenModal = (t = null) => {
    if (t) {
      setEditingId(t.id);
      setFormData({ category: t.category, amount: t.amount, type: t.type, paymentMethod: t.paymentMethod, status: t.status || 'Completed', date: t.date });
    } else {
      setEditingId(null);
      setFormData({ category: '', amount: '', type: 'expense', paymentMethod: 'UPI', status: 'Completed', date: new Date().toISOString().split('T')[0] });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.category || !formData.amount) return;
    const amountVal = Number(formData.amount);
    if (editingId) {
      const existing = transactions.find(tx => tx.id === editingId);
      dispatch(editTransaction({ ...existing, category: formData.category, amount: amountVal, type: formData.type, paymentMethod: formData.paymentMethod, status: formData.status, date: formData.date }));
    } else {
      dispatch(addTransaction({
        id: Date.now(),
        date: formData.date,
        amount: amountVal,
        category: formData.category,
        type: formData.type,
        status: formData.status,
        paymentMethod: formData.paymentMethod
      }));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };

  const statusOptions = [
    { value: 'Completed', label: 'Completed' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Failed', label: 'Failed' }
  ];

  const typeOptions = [
    { value: 'All', label: 'All types' },
    { value: 'Income', label: 'Income' },
    { value: 'Expense', label: 'Expense' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'amt-desc', label: 'Highest Amount' },
    { value: 'amt-asc', label: 'Lowest Amount' }
  ];

  const editTypeOptions = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' }
  ];

  const methodOptions = [
    { value: 'UPI', label: 'UPI' },
    { value: 'Card', label: 'Card' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Bank Transfer', label: 'Bank Transfer' }
  ];

  const exportOptions = [
    { value: 'csv', label: 'Export CSV' },
    { value: 'json', label: 'Export JSON' }
  ];

  const handleExport = (type) => {
    if (type === 'csv') {
      const csvContent = convertToCSV(transactions);
      downloadFile(csvContent, `transactions_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8;');
    } else if (type === 'json') {
      const jsonContent = JSON.stringify(transactions, null, 2);
      downloadFile(jsonContent, `transactions_${new Date().toISOString().split('T')[0]}.json`, 'application/json;charset=utf-8;');
    }
  };

  return (
    <>
      <div className={`glass p-6 rounded-2xl flex flex-col relative ${limit ? 'h-[540px]' : 'flex-1 min-h-[750px]'}`}>
        <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
          
          {/* Main List Container */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex flex-col gap-6 mb-8 z-30 w-full relative">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold text-text tracking-tight">Recent Transactions</h3>
                  <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest mt-1">History & Logs</p>
                </div>
                {role === 'admin' && (
                  <button 
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-primary/90 text-white rounded-2xl w-10 h-10 flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-primary/30 lg:hidden"
                  >
                    <i className="pi pi-plus text-sm"></i>
                  </button>
                )}
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="relative flex-1 group">
                  <i className="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xs group-focus-within:text-primary transition-colors"></i>
                  <input 
                    type="text"
                    placeholder="Search history..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-text text-sm rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary/40 focus:bg-slate-100 dark:focus:bg-white/[0.08] w-full transition-all"
                  />
                </div>
                
                <div className="flex flex-wrap items-center gap-2 pb-1 lg:pb-0">
                  <Dropdown 
                    value={filter}
                    options={typeOptions}
                    onChange={(val) => setFilter(val)}
                    className="min-w-[120px]"
                    buttonClassName="!bg-white/5 !border-white/10 !rounded-2xl !h-[44px]"
                  />
                  <Dropdown 
                    value={sortBy}
                    options={sortOptions}
                    onChange={(val) => setSortBy(val)}
                    className="min-w-[140px]"
                    buttonClassName="!bg-white/5 !border-white/10 !rounded-2xl !h-[44px]"
                  />
                  
                  <div className="flex items-center gap-2">
                    <Dropdown 
                      placeholder={<span className="flex items-center"><i className="pi pi-download text-[10px] mr-2"></i> Export</span>}
                      value=""
                      options={exportOptions}
                      onChange={handleExport}
                      className="min-w-[130px]"
                      buttonClassName="!bg-white/5 !border-white/10 !rounded-2xl !h-[44px] !text-text-muted hover:!text-text"
                    />

                    {role === 'admin' && (
                      <button 
                        onClick={() => handleOpenModal()}
                        className="hidden lg:flex bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 h-[44px] items-center gap-2 text-sm font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
                      >
                        <i className="pi pi-plus text-[10px]"></i> ADD NEW
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar z-10 w-full min-h-0">
              {filteredData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-text-muted">
                   <i className="pi pi-receipt text-4xl mb-3 opacity-30"></i>
                   <p>No transactions found.</p>
                </div>
              ) : (
                <>
                  {/* Desktop View Table */}
                  <div className="hidden lg:block w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-text-muted text-[11px] uppercase tracking-wider border-b border-border/50">
                          <th className="pb-4 font-semibold px-2">Transaction</th>
                          <th className="pb-4 font-semibold">Date</th>
                          <th className="pb-4 font-semibold">Method</th>
                          <th className="pb-4 font-semibold">Status</th>
                          <th className="pb-4 font-semibold text-right pr-6">Amount</th>
                          {role === 'admin' && <th className="pb-4 font-semibold text-right pr-4">Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {filteredData.map((t) => (
                            <motion.tr 
                              key={t.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="border-b border-border/10 last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group"
                            >
                              <td className="py-4 px-2">
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${t.type === 'income' ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'}`}>
                                    <i className={`pi ${t.type === 'income' ? 'pi-arrow-down-left' : 'pi-arrow-up-right'} text-base`}></i>
                                  </div>
                                  <div>
                                    <div className="font-bold text-text text-sm">{t.category}</div>
                                    <div className="text-[10px] text-text-muted capitalize">{t.type}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 text-xs text-text-muted font-medium">{t.date}</td>
                              <td className="py-4 text-xs text-text-muted">{t.paymentMethod}</td>
                               <td className="py-4">
                                  <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold ${
                                    (t.status === 'Completed' || !t.status) ? 'bg-success/10 text-success' : 
                                    t.status === 'Pending' ? 'bg-warning/10 text-warning' : 
                                    'bg-error/10 text-error'
                                  }`}>
                                    {t.status || 'Completed'}
                                  </span>
                               </td>
                              <td className={`py-4 text-right font-display font-bold pr-6 text-base ${t.type === 'income' ? 'text-success' : 'text-text'}`}>
                                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                              </td>
                              {role === 'admin' && (
                                <td className="py-4 text-right pr-4">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => handleOpenModal(t)}
                                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-white/5 text-text-muted hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                                      title="Edit"
                                    >
                                      <i className="pi pi-pencil text-xs"></i>
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(t.id)}
                                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-white/5 text-text-muted hover:bg-error/10 hover:text-error transition-all active:scale-90"
                                      title="Delete"
                                    >
                                      <i className="pi pi-trash text-xs"></i>
                                    </button>
                                  </div>
                                </td>
                              )}
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card List */}
                  <div className="lg:hidden flex flex-col gap-4 pb-20">
                     {filteredData.map((t) => (
                       <motion.div 
                         key={t.id}
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         className="glass p-5 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group active:scale-[0.98] transition-all"
                       >
                         {/* Subtle background glow */}
                         <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10 rounded-full ${t.type === 'income' ? 'bg-success' : 'bg-error'}`}></div>
                         
                         <div className="flex justify-between items-start mb-4 relative z-10 gap-3">
                           <div className="flex items-start gap-3 flex-1 min-w-0">
                             <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-lg transition-transform group-hover:scale-110 ${
                               t.type === 'income' 
                               ? 'bg-success/15 text-success border-success/30 shadow-success/10' 
                               : 'bg-error/15 text-error border-error/30 shadow-error/10'
                             }`}>
                               <i className={`pi ${t.type === 'income' ? 'pi-arrow-down-left' : 'pi-arrow-up-right'} text-lg`}></i>
                             </div>
                             <div className="flex-1 min-w-0">
                               <div className="font-bold text-text text-[15px] leading-tight mb-2 truncate">{t.category}</div>
                               <div className="flex flex-wrap items-center gap-1.5">
                                 <span className="text-[10px] text-text-muted font-medium bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full whitespace-nowrap">{t.date}</span>
                                 <span className="text-[10px] text-text-muted font-medium bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full whitespace-nowrap">{t.paymentMethod}</span>
                               </div>
                             </div>
                           </div>
                           <div className="flex flex-col items-end shrink-0 pl-2">
                             <div className={`text-right font-display font-bold text-[17px] tracking-tight ${t.type === 'income' ? 'text-success' : 'text-text'}`}>
                               {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                             </div>
                             <span className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-md whitespace-nowrap ${
                               (t.status === 'Completed' || !t.status) ? 'bg-success/10 text-success' : 
                               t.status === 'Pending' ? 'bg-warning/10 text-warning' : 
                               'bg-error/10 text-error'
                             }`}>
                               {t.status || 'Completed'}
                             </span>
                           </div>
                         </div>
                         
                         {role === 'admin' && (
                           <div className="flex gap-2 mt-4 relative z-10">
                             <button 
                               onClick={() => handleOpenModal(t)}
                               className="flex-1 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 text-text hover:bg-primary/20 hover:text-primary text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-white/5"
                             >
                               <i className="pi pi-pencil text-[10px]"></i> Edit Details
                             </button>
                             <button 
                               onClick={() => handleDelete(t.id)}
                               className="w-12 h-[46px] rounded-2xl bg-slate-50 dark:bg-white/5 text-error/60 hover:bg-error/20 hover:text-error transition-all flex items-center justify-center border border-slate-200 dark:border-white/5"
                             >
                               <i className="pi pi-trash"></i>
                             </button>
                           </div>
                         )}
                       </motion.div>
                     ))}
                  </div>
                </>
              )}
            </div>

            {/* Pagination Controls */}
            {!limit && totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/20 z-30 relative">
                <p className="text-xs text-text-muted font-medium">
                  Showing page <span className="text-text">{currentPage}</span> of <span className="text-text">{totalPages}</span>
                </p>
                
                <div className="flex items-center gap-1.5">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-border/30 text-text-muted hover:text-text hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <i className="pi pi-chevron-left text-[10px]"></i>
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-[11px] font-bold transition-all ${
                          currentPage === i + 1 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                          : 'bg-white/5 border border-border/30 text-text-muted hover:text-text hover:bg-white/10'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-border/30 text-text-muted hover:text-text hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <i className="pi pi-chevron-right text-[10px]"></i>
                  </button>
                </div>
              </div>
            )}
          </div>

          {showInsights && <TransactionInsights transactions={filteredData} />}
        </div>
      </div>

      {/* Transaction Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/90 backdrop-blur-xl z-0"
              onClick={() => setIsModalOpen(false)}
            />
          </AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-premium p-6 sm:p-8 rounded-[2.5rem] w-full max-w-md relative z-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/20 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-transparent py-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                  <i className={`pi ${editingId ? 'pi-pencil' : 'pi-plus'} text-sm`}></i>
                </div>
                <h3 className="text-xl font-display font-bold text-text">{editingId ? 'Edit Transaction' : 'New Transaction'}</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-white/5 transition-all"
              >
                <i className="pi pi-times"></i>
              </button>
            </div>
            <div className="flex flex-col gap-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest px-1">Category Name</label>
                <div className="relative group">
                  <i className="pi pi-tag absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm group-focus-within:text-primary transition-colors"></i>
                  <input type="text" placeholder="e.g. D-Mart" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-primary/50 focus:bg-slate-100 dark:focus:bg-white/10 text-text transition-all font-medium" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest px-1">Amount (₹)</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm group-focus-within:text-primary transition-colors">₹</span>
                  <input type="number" placeholder="5000" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-9 pr-4 py-3 outline-none focus:border-primary/50 focus:bg-slate-100 dark:focus:bg-white/10 text-text transition-all font-display text-lg font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest px-1">Type</label>
                  <Dropdown 
                    value={formData.type}
                    options={editTypeOptions}
                    onChange={(val) => setFormData({...formData, type: val})}
                    className="w-full"
                    buttonClassName="!w-full !rounded-2xl !h-[50px] !bg-white/5 !border-white/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest px-1">Method</label>
                  <Dropdown 
                    value={formData.paymentMethod}
                    options={methodOptions}
                    onChange={(val) => setFormData({...formData, paymentMethod: val})}
                    className="w-full"
                    buttonClassName="!w-full !rounded-2xl !h-[50px] !bg-white/5 !border-white/10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest px-1">Status</label>
                  <Dropdown 
                    value={formData.status}
                    options={statusOptions}
                    onChange={(val) => setFormData({...formData, status: val})}
                    className="w-full"
                    buttonClassName="!w-full !rounded-2xl !h-[50px] !bg-white/5 !border-white/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest px-1">Date</label>
                  <DatePicker 
                    value={formData.date}
                    onChange={(val) => setFormData({...formData, date: val})}
                    className="w-full h-[50px] bg-white/5 border border-white/10 rounded-2xl flex items-center px-4"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                <button onClick={() => setIsModalOpen(false)} className="order-2 sm:order-1 flex-1 sm:flex-none px-6 py-3 text-text-muted hover:text-text hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all font-bold text-xs">DISCARD</button>
                <button onClick={handleSave} className="order-1 sm:order-2 flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-3 shadow-lg shadow-primary/30 transition-all active:scale-95 font-bold text-xs uppercase tracking-widest">Save Details</button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </>
  );
};

export default TransactionList;
