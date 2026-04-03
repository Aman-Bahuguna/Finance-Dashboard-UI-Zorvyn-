import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const SummaryCards = () => {
  const transactions = useSelector((state) => state.transactions.data);

  const {
    totalIncome, totalExpenses, totalBalance,
    incomeChange, expenseChange, balanceChange
  } = useMemo(() => {
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
    const tIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const tExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const tBalance = tIncome - tExpenses;

    const getPercentageChange = (curr, prevVal) => {
      if (prevVal === 0) return 0;
      return ((curr - prevVal) / Math.abs(prevVal)) * 100;
    };

    return {
      totalIncome: tIncome,
      totalExpenses: tExpenses,
      totalBalance: tBalance,
      incomeChange: getPercentageChange(current.inc, prev.inc),
      expenseChange: getPercentageChange(current.exp, prev.exp),
      balanceChange: getPercentageChange(current.bal, prev.bal)
    };
  }, [transactions]);

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
      whileHover={{ y: -5, scale: 1.01 }}
      className="glass p-6 rounded-[2rem] relative overflow-hidden group cursor-pointer border border-white/5 hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-text-muted font-semibold text-xs tracking-wider uppercase opacity-70">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-text tracking-tight">
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${colorMap[color]}`}>
          <i className={`pi ${icon} text-xl`}></i>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className={`text-[11px] font-bold px-2 py-1 rounded-lg bg-surface/50 border border-border/10 flex items-center gap-1.5 ${trendColor}`}>
          <i className={`pi ${isPositive ? 'pi-arrow-up' : 'pi-arrow-down'} text-[9px]`}></i>
          <span>{absPercentage}%</span>
          <span className="text-text-muted font-medium ml-1">vs last month</span>
        </div>
        <div className="w-16 h-1 bg-border/20 rounded-full overflow-hidden">
             <div className={`h-full ${color === 'primary' ? 'bg-primary' : color === 'success' ? 'bg-success' : 'bg-error'}`} style={{ width: '65%', opacity: 0.5 }}></div>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] blur-2xl ${color === 'primary' ? 'bg-primary' : color === 'success' ? 'bg-success' : 'bg-error'}`}></div>
    </motion.div>

  );
};

export default SummaryCards;
