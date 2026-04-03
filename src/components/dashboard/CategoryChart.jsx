import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Dropdown from '../ui/Dropdown';

const CategoryChart = () => {
  const transactions = useSelector((state) => state.transactions.data);
  const [timePeriod, setTimePeriod] = useState('This Month');
  
  const { totalSpent, topCategories, donutData } = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const spent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    const raw = expenses.reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, []);

    const top = [...raw].sort((a,b) => b.value - a.value).slice(0, 3);
    
    // Prepare data for the half-donut gauge
    const dData = top.map(cat => ({ name: cat.name, value: cat.value }));
    
    // Filler for the gauge (the empty portion)
    dData.push({ name: 'filler', value: Math.max(0, spent * 0.3) });

    return { totalSpent: spent, topCategories: top, donutData: dData };
  }, [transactions]);

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
    <div className="glass p-6 rounded-[2rem] min-h-[400px] flex flex-col relative">
      
      {/* Header */}
      <div className="flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary flex items-center justify-center shadow-lg shadow-primary/5">
            <i className="pi pi-chart-pie text-base animate-pulse-slow"></i>
          </div>
          <h3 className="text-base font-display font-bold text-text tracking-tight">Spending Summary</h3>
        </div>
        <Dropdown 
          value={timePeriod} 
          options={timeOptions} 
          onChange={setTimePeriod} 
          className="[&_button]:min-w-0 [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-[11px] [&_button]:rounded-full [&_button]:border-primary/20"
        />
      </div>

      <div className="w-full border-t border-border/30 my-3 shrink-0"></div>

      {/* Main Gauge Chart */}
      <div className="flex-1 relative flex flex-col items-center justify-center min-h-0">
        <div className="w-full h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="85%"
                startAngle={180}
                endAngle={0}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {donutData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === 'filler' ? 'var(--border)' : COLORS[index % (COLORS.length - 1)]} 
                    fillOpacity={entry.name === 'filler' ? 0.08 : 0.9}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Amount Centered in Gauge - Adjusted Position to avoid overflow */}
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase mb-1 opacity-70">Spent</span>
            <span className="text-2xl sm:text-3xl font-display font-bold text-text tabular-nums tracking-tight">₹{totalSpent.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="w-full border-t border-border/30 my-3 shrink-0"></div>

      {/* Details Grid - Fixed Alignment and reduced bottom margin */}
      <div className="flex items-center w-full mb-2 shrink-0">
        {topCategories.map((cat, idx) => (
          <div key={idx} className={`flex-1 flex flex-col items-center text-center px-1 ${idx < topCategories.length - 1 ? 'border-r border-border/20' : ''}`}>
             <div className={`p-2 rounded-xl mb-1.5 ${idx === 0 ? 'bg-primary/10 text-primary' : idx === 1 ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'}`}>
               <i className={`pi ${getCategoryIcon(cat.name)} text-xs`}></i>
             </div>
             <span className="text-[11px] text-text-muted font-semibold truncate w-full px-2 mb-0.5">{cat.name}</span>
             <span className="text-[13px] font-display font-bold text-text">₹{cat.value.toLocaleString('en-IN')}</span>
          </div>
        ))}
        {topCategories.length === 0 && Array(3).fill(0).map((_, i) => (
           <div key={i} className={`flex-1 flex flex-col items-center text-center opacity-20 ${i < 2 ? 'border-r border-border/20' : ''}`}>
             <div className="w-8 h-8 rounded-xl bg-border mb-2 animate-pulse"></div>
             <div className="w-12 h-2.5 bg-border rounded mb-1.5 animate-pulse"></div>
             <div className="w-16 h-3 bg-border rounded animate-pulse"></div>
           </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-2">
        <div className="flex items-center justify-between p-3 bg-surface/40 hover:bg-surface/60 transition-colors border border-border/20 rounded-2xl gap-3">
           <div className="flex items-center gap-2">
             <i className="pi pi-info-circle text-primary text-xs opacity-80"></i>
             <span className="text-[11px] text-text-muted leading-tight">Monthly spending limit: <span className="text-text font-bold">₹2,00,000</span></span>
           </div>
           <div className="h-1.5 w-16 bg-border/30 rounded-full overflow-hidden shrink-0 hidden sm:block">
             <div className="h-full bg-primary" style={{ width: `${Math.min(100, (totalSpent/200000)*100)}%` }}></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
