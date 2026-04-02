import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addTransaction, deleteTransaction, editTransaction } from '../../redux/transactionsSlice';
import Dropdown from '../ui/Dropdown';
import DatePicker from '../ui/DatePicker';
import TransactionInsights from './TransactionInsights';

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

  // Filtering Logic
  let filteredData = transactions.filter(t => {
    if (filter !== 'All' && filter.toLowerCase() !== t.type) return false;
    if (searchTerm && !t.category.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Sorting Logic
  filteredData = filteredData.sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amt-desc') return b.amount - a.amount;
    if (sortBy === 'amt-asc') return a.amount - b.amount;
    return 0;
  });

  const totalPages = Math.ceil(filteredData.length / pageSize);

  if (limit) {
    filteredData = filteredData.slice(0, limit);
  } else {
    const startIndex = (currentPage - 1) * pageSize;
    filteredData = filteredData.slice(startIndex, startIndex + pageSize);
  }



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

  return (
    <>
      <div className={`glass p-6 rounded-2xl flex flex-col relative overflow-hidden ${limit ? 'h-[540px]' : 'flex-1 min-h-[750px]'}`}>
        <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
          
          {/* Main List Container */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 z-30 w-full relative">
              <h3 className="text-lg font-display font-semibold text-text">Recent Transactions</h3>
              
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto relative z-40">
                <div className="relative w-full sm:w-48">
                  <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs"></i>
                  <input 
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/5 border border-border/50 text-text text-sm rounded-xl pl-8 pr-3 py-2.5 sm:py-2 focus:outline-none focus:border-primary/50 w-full transition-colors"
                  />
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto relative z-50">
                  <Dropdown 
                    value={filter}
                    options={typeOptions}
                    onChange={(val) => setFilter(val)}
                    className="flex-1 sm:flex-none [&_button]:w-full sm:[&_button]:w-32"
                  />
                  <Dropdown 
                    value={sortBy}
                    options={sortOptions}
                    onChange={(val) => setSortBy(val)}
                    className="flex-1 sm:flex-none [&_button]:w-full sm:[&_button]:w-40"
                  />
                </div>
                
                {role === 'admin' && (
                  <button 
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-2.5 sm:py-2 text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 shrink-0 w-full sm:w-auto z-10"
                  >
                    <i className="pi pi-plus text-xs"></i> Add
                  </button>
                )}
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
                              className="border-b border-border/10 last:border-0 hover:bg-white/[0.03] transition-colors group"
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
                                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-text-muted hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                                      title="Edit"
                                    >
                                      <i className="pi pi-pencil text-xs"></i>
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(t.id)}
                                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-text-muted hover:bg-error/10 hover:text-error transition-all active:scale-90"
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
                  <div className="lg:hidden flex flex-col gap-4 pb-4">
                     {filteredData.map((t) => (
                       <div key={t.id} className="glass p-4 rounded-2xl border border-white/5 shadow-sm">
                         <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${t.type === 'income' ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'}`}>
                               <i className={`pi ${t.type === 'income' ? 'pi-arrow-down-left' : 'pi-arrow-up-right'} text-base`}></i>
                             </div>
                             <div>
                               <div className="font-bold text-text text-sm truncate max-w-[120px]">{t.category}</div>
                               <div className="text-[10px] text-text-muted mt-0.5">{t.date}</div>
                             </div>
                           </div>
                           <div className={`text-right font-display font-bold text-sm ${t.type === 'income' ? 'text-success' : 'text-text'}`}>
                             {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                           </div>
                         </div>
                         {role === 'admin' && (
                           <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                             <button 
                               onClick={() => handleOpenModal(t)}
                               className="flex-1 py-2 rounded-xl bg-white/5 text-text-muted hover:bg-primary/10 hover:text-primary text-xs font-semibold transition-all flex items-center justify-center gap-2"
                             >
                               <i className="pi pi-pencil"></i> Edit
                             </button>
                             <button 
                               onClick={() => handleDelete(t.id)}
                               className="flex-1 py-2 rounded-xl bg-white/5 text-text-muted hover:bg-error/10 hover:text-error text-xs font-semibold transition-all flex items-center justify-center gap-2"
                             >
                               <i className="pi pi-trash"></i> Delete
                             </button>
                           </div>
                         )}
                       </div>
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
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl border border-white/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-bold text-text">{editingId ? 'Edit Transaction' : 'New Transaction'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text">
                  <i className="pi pi-times"></i>
                </button>
              </div>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-sm font-medium text-text-muted mb-1.5 block">Category Name</label>
                  <div className="relative">
                    <i className="pi pi-tag absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm"></i>
                    <input type="text" placeholder="e.g. D-Mart" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-border/70 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-primary focus:bg-white/10 text-text transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-muted mb-1.5 block">Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium text-sm">₹</span>
                    <input type="number" placeholder="5000" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-white/5 border border-border/70 rounded-xl pl-8 pr-3 py-2.5 outline-none focus:border-primary focus:bg-white/10 text-text transition-all font-mono" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Dropdown 
                    label="Type"
                    value={formData.type}
                    options={editTypeOptions}
                    onChange={(val) => setFormData({...formData, type: val})}
                    className="flex-col !items-start w-full [&_button]:w-full"
                  />
                  <Dropdown 
                    label="Method"
                    value={formData.paymentMethod}
                    options={methodOptions}
                    onChange={(val) => setFormData({...formData, paymentMethod: val})}
                    className="flex-col !items-start w-full [&_button]:w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Dropdown 
                    label="Status"
                    value={formData.status}
                    options={statusOptions}
                    onChange={(val) => setFormData({...formData, status: val})}
                    className="flex-col !items-start w-full [&_button]:w-full"
                  />
                  <DatePicker 
                    label="Date"
                    value={formData.date}
                    onChange={(val) => setFormData({...formData, date: val})}
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border/50">
                  <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-text-muted hover:text-text hover:bg-white/5 rounded-xl transition-all font-medium">Cancel</button>
                  <button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 py-2.5 shadow-lg shadow-primary/30 transition-all active:scale-95 font-semibold">Save Details</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TransactionList;
