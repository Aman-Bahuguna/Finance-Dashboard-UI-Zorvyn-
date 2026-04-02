import React from 'react';
import { motion } from 'framer-motion';

const BudgetTracker = () => {
    // Standard mockup data for premium feel
    const budgets = [
        { name: 'Food & Drinks', spent: 12000, limit: 15000, color: 'primary' },
        { name: 'Shopping', spent: 8500, limit: 10000, color: 'secondary' },
        { name: 'Rent', spent: 25000, limit: 25000, color: 'accent' },
    ];

    return (
        <div className="glass p-6 rounded-[2.5rem] flex flex-col relative overflow-hidden h-full">
            <h3 className="text-lg font-display font-semibold text-text mb-6">Budget Tracker</h3>
            
            <div className="flex flex-col gap-6">
                {budgets.map((b, i) => {
                    const percentage = Math.min((b.spent / b.limit) * 100, 100);
                    return (
                        <div key={i} className="space-y-2">
                             <div className="flex justify-between items-center text-xs">
                                 <span className="text-text-muted font-medium">{b.name}</span>
                                 <span className="text-text font-bold">₹{b.spent.toLocaleString()} / ₹{b.limit.toLocaleString()}</span>
                             </div>
                             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className={`h-full rounded-full ${
                                        b.color === 'primary' ? 'bg-primary' : 
                                        b.color === 'secondary' ? 'bg-secondary' : 
                                        'bg-accent'
                                    }`}
                                 />
                             </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-auto pt-8">
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl relative overflow-hidden">
                     <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Savings Potential</p>
                     <div className="flex items-baseline gap-1">
                         <span className="text-2xl font-display font-bold text-text">₹24,500</span>
                         <span className="text-[10px] text-text-muted font-medium">available for investment</span>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetTracker;
