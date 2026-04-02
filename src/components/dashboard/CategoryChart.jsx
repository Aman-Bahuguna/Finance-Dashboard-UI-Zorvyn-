import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Dropdown from '../ui/Dropdown';

const CategoryChart = () => {
  const transactions = useSelector((state) => state.transactions.data);
  const [timePeriod, setTimePeriod] = useState('This Month');
  
  // Compute total and categorized expenses
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalSpent = expenseTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  const rawData = expenseTransactions.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  const topCategories = [...rawData].sort((a,b) => b.value - a.value).slice(0, 3);
  
  // Prepare data for the half-donut gauge
  // We want to show the top 3 categories in the donut segments, and any remainder in gray
  const donutData = topCategories.map(cat => ({ name: cat.name, value: cat.value }));
  const donutSum = donutData.reduce((acc, curr) => acc + curr.value, 0);
  
  // Filler for the gauge (the empty portion)
  donutData.push({ name: 'filler', value: Math.max(0, totalSpent * 0.3) }); // Dummy filler for visual depth

  const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--border)'];

  const timeOptions = [
    { value: 'Last Week', label: 'Last Week' },
    { value: 'This Month', label: 'This Month' }
  ];

  const getCategoryIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('shop') || n.includes('zomato') || n.includes('mart')) return 'pi-shopping-bag';
    if (n.includes('util') || n.includes('bill') || n.includes('rent')) return 'pi-briefcase';
    return 'pi-tag';
  };

  return (
    <div className="glass p-6 rounded-3xl h-96 flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
            <i className="pi pi-chart-pie text-sm"></i>
          </div>
          <h3 className="text-sm sm:text-base font-display font-semibold text-text">Spending Summary</h3>
        </div>
        <Dropdown 
          value={timePeriod} 
          options={timeOptions} 
          onChange={setTimePeriod} 
          className="w-24 sm:w-32 [&_button]:min-w-0 [&_button]:py-1 [&_button]:text-[10px]"
        />
      </div>

      <div className="w-full border-t border-border/30 my-3 shrink-0"></div>

      {/* Main Gauge Chart */}
      <div className="flex-1 relative flex flex-col items-center justify-center min-h-0">
        <div className="w-full h-32 sm:h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="90%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {donutData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === 'filler' ? 'var(--border)' : COLORS[index % (COLORS.length - 1)]} 
                    fillOpacity={entry.name === 'filler' ? 0.1 : 0.9}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Amount Centered in Gauge */}
        <div className="absolute top-[55%] flex flex-col items-center">
            <span className="text-[9px] text-text-muted font-bold tracking-widest uppercase">Spent</span>
            <span className="text-xl sm:text-2xl font-display font-bold text-text mt-0.5">₹{totalSpent.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="w-full border-t border-border/30 my-3 shrink-0"></div>

      {/* Details Grid */}
      <div className="grid grid-cols-3 gap-2 w-full mb-3 shrink-0">
        {topCategories.map((cat, idx) => (
          <div key={idx} className={`flex flex-col items-center text-center px-1 ${idx < topCategories.length - 1 ? 'border-r border-border/30' : ''}`}>
             <div className={`p-1.5 rounded-full mb-1 ${idx === 0 ? 'bg-primary/10 text-primary' : idx === 1 ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'}`}>
               <i className={`pi ${getCategoryIcon(cat.name)} text-[10px]`}></i>
             </div>
             <span className="text-[10px] text-text-muted font-medium truncate w-full px-1">{cat.name}</span>
             <span className="text-[11px] font-bold text-text mt-0.5">₹{cat.value.toLocaleString('en-IN')}</span>
          </div>
        ))}
        {topCategories.length === 0 && Array(3).fill(0).map((_, i) => (
           <div key={i} className={`flex flex-col items-center text-center opacity-20 ${i < 2 ? 'border-r border-border/30' : ''}`}>
             <div className="w-8 h-8 rounded-full bg-border mb-2"></div>
             <div className="w-12 h-2 bg-border rounded mb-1"></div>
             <div className="w-16 h-3 bg-border rounded"></div>
           </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-auto">
        <div className="flex items-center justify-between p-2 sm:p-3 bg-surface/50 border border-border/30 rounded-xl gap-2">
           <span className="text-[9px] sm:text-xs text-text-muted leading-tight">Monthly spending limit: <span className="text-text font-bold">₹2,00,000</span>.</span>
           <i className="pi pi-info-circle text-text-muted text-xs shrink-0"></i>
        </div>
      </div>

    </div>
  );
};

export default CategoryChart;
