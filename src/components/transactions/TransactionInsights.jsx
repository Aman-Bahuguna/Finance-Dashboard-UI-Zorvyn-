import React from 'react';
import { useSelector } from 'react-redux';

const TransactionInsights = ({ transactions }) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const avgExpense = expenses.length > 0 ? Math.round(expenses.reduce((acc, curr) => acc + curr.amount, 0) / expenses.length) : 0;
  
  const methodCounts = transactions.reduce((acc, curr) => {
    acc[curr.paymentMethod] = (acc[curr.paymentMethod] || 0) + 1;
    return acc;
  }, {});
  
  const topMethod = Object.keys(methodCounts).length > 0 
    ? Object.keys(methodCounts).reduce((a, b) => methodCounts[a] > methodCounts[b] ? a : b)
    : 'None';

  return (
    <div className="hidden xl:flex w-72 flex-col gap-6 border-l border-border/30 pl-8 overflow-y-auto h-full">
      <h4 className="text-sm font-bold text-text mb-2 uppercase tracking-widest opacity-50">Quick Insights</h4>
      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="text-[10px] font-bold text-text-muted mb-1 uppercase">Total Transactions</div>
          <div className="text-2xl font-display font-bold text-text">{transactions.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="text-[10px] font-bold text-text-muted mb-1 uppercase">Avg. Expense</div>
          <div className="text-2xl font-display font-bold text-text">₹{avgExpense.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="text-[10px] font-bold text-text-muted mb-1 uppercase">Top Method</div>
          <div className="text-lg font-bold text-text flex items-center gap-2">
             <i className="pi pi-wallet text-primary text-sm"></i> {topMethod}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionInsights;
