import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const SummaryCards = () => {
  const transactions = useSelector((state) => state.transactions.data);

  // Get current and previous month dates
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const filterByMonth = (data, month, year) => {
    return data.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const currentMonthTransactions = filterByMonth(transactions, currentMonth, currentYear);
  const prevMonthTransactions = filterByMonth(transactions, prevMonth, prevYear);

  const calculateTotals = (data) => {
    const inc = data.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const exp = data.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    return { inc, exp, bal: inc - exp };
  };

  const current = calculateTotals(currentMonthTransactions);
  const prev = calculateTotals(prevMonthTransactions);

  // Overall Totals for display
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  const getPercentageChange = (curr, prevVal) => {
    if (prevVal === 0) return 0;
    return ((curr - prevVal) / Math.abs(prevVal)) * 100;
  };

  const incomeChange = getPercentageChange(current.inc, prev.inc);
  const expenseChange = getPercentageChange(current.exp, prev.exp);
  const balanceChange = getPercentageChange(current.bal, prev.bal);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <Card 
        title="Total Balance" 
        amount={totalBalance} 
        icon="pi-wallet" 
        color="primary"
        percentage={balanceChange}
        delay={0.1}
      />
      <Card 
        title="Total Income" 
        amount={totalIncome} 
        icon="pi-arrow-down-left" 
        color="success"
        percentage={incomeChange}
        delay={0.2}
      />
      <Card 
        title="Total Expenses" 
        amount={totalExpenses} 
        icon="pi-arrow-up-right" 
        color="error"
        percentage={expenseChange}
        delay={0.3}
      />
    </div>
  );
};

const Card = ({ title, amount, icon, color, percentage, delay }) => {
  
  const colorMap = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    success: 'text-success bg-success/10 border-success/20',
    error: 'text-error bg-error/10 border-error/20',
  };

  const isPositive = percentage >= 0;
  const absPercentage = Math.abs(percentage).toFixed(1);
  
  // Logic for trend colors:
  // Expenses going UP (+) is bad (Error Color)
  // Income going UP (+) is good (Success Color)
  let trendColor = isPositive ? 'text-success' : 'text-error';
  if (title === 'Total Expenses') {
    trendColor = isPositive ? 'text-error' : 'text-success';
  }

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass p-6 rounded-2xl relative overflow-hidden group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-text-muted font-medium text-sm">{title}</h3>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
          <i className={`pi ${icon} text-lg`}></i>
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-display font-bold text-text">
          ₹{amount.toLocaleString('en-IN')}
        </span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-white/5 flex items-center gap-1 ${trendColor}`}>
          <i className={`pi ${isPositive ? 'pi-arrow-up' : 'pi-arrow-down'} text-[8px]`}></i>
          {absPercentage}%
        </span>
      </div>
    </motion.div>
  );
};

export default SummaryCards;
