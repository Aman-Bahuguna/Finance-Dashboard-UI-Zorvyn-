import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const InsightsPanel = () => {
  const transactions = useSelector((state) => state.transactions.data);

  // Compute highest category
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

  let highestCategory = 'None';
  let highestAmount = 0;
  for (const [key, val] of Object.entries(expenseData)) {
    if (val > highestAmount) {
      highestAmount = val;
      highestCategory = key;
    }
  }

  return (
    <div className="glass p-6 rounded-2xl flex flex-col relative overflow-hidden h-full">
      <h3 className="text-lg font-display font-semibold text-text mb-6 z-10 w-full border-b border-border/50 pb-3">Activity Highlights</h3>
      
      <div className="flex flex-col gap-4 z-10">
        <InsightCard 
          icon="pi-chart-pie" 
          title="Highest Spending" 
          desc={`You spent the most on ${highestCategory} this month (₹${highestAmount.toLocaleString()}).`}
          color="bg-primary/20 text-primary"
        />
        
        <InsightCard 
          icon="pi-calendar-minus" 
          title="Monthly Comparison" 
          desc={`You've spent 12% more this week compared to the same time last month.`}
          color="bg-warning/20 text-warning"
        />

        <InsightCard 
          icon="pi-credit-card" 
          title="Total Transactions" 
          desc={`You have made ${transactions.length} transactions in the current period.`}
          color="bg-secondary/20 text-secondary"
        />
        
        <InsightCard 
          icon="pi-check-circle" 
          title="Good Job!" 
          desc="You've managed to save 20% of your total income. Keep it up!"
          color="bg-success/20 text-success"
        />
      </div>
      
      <div className="mt-auto pt-6">
        <div className="p-4 bg-surface border border-border/50 rounded-xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <i className="pi pi-bolt text-6xl"></i>
          </div>
          <h4 className="font-semibold text-sm text-text mb-1 flex items-center gap-2">
            <i className="pi pi-sparkles text-accent"></i> Upgrade Plan
          </h4>
          <p className="text-xs text-text-muted leading-relaxed">
            Get personalized AI-driven financial planning by upgrading to our premium tier.
          </p>
        </div>
      </div>
    </div>
  );
};

const InsightCard = ({ icon, title, desc, color }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default"
  >
    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${color}`}>
      <i className={`pi ${icon}`}></i>
    </div>
    <div>
      <h4 className="text-sm font-semibold text-text mb-0.5">{title}</h4>
      <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

export default InsightsPanel;
