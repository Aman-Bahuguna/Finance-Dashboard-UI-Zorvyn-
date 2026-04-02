import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ComparisonChart = () => {
    const transactions = useSelector((state) => state.transactions.data);

    // Group by month
    const monthlyData = transactions.reduce((acc, t) => {
        const date = new Date(t.date);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        if (!acc[monthYear]) acc[monthYear] = { name: monthYear, Income: 0, Expenses: 0 };
        if (t.type === 'income') acc[monthYear].Income += t.amount;
        else acc[monthYear].Expenses += t.amount;
        return acc;
    }, {});

    const sortedData = Object.values(monthlyData).sort((a, b) => new Date(a.name) - new Date(b.name)).slice(-6);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#141417]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-3">{label}</p>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center gap-6">
                            <span className="text-xs text-white/60">Income</span>
                            <span className="text-sm font-bold text-[#10b981]">₹{payload[0].value.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center gap-6">
                            <span className="text-xs text-white/60">Expenses</span>
                            <span className="text-sm font-bold text-[#ef4444]">₹{payload[1].value.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass p-6 rounded-[2.5rem] h-full flex flex-col relative overflow-hidden min-h-[380px]">
            <h3 className="text-lg font-display font-semibold text-text mb-6">Income vs Expenses</h3>
            <div className="flex-1 w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sortedData.length > 0 ? sortedData : [{name: 'No Data', Income: 0, Expenses: 0}]} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                           dataKey="name" 
                           stroke="rgba(255,255,255,0.4)" 
                           fontSize={11} 
                           tickLine={false} 
                           axisLine={false} 
                           tickMargin={12}
                        />
                        <YAxis 
                           stroke="rgba(255,255,255,0.4)" 
                           fontSize={11} 
                           tickLine={false} 
                           axisLine={false} 
                           tickFormatter={(val) => `₹${val / 1000}k`}
                           width={45}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 8 }} />
                        <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                        <Bar 
                           dataKey="Income" 
                           fill="#10b981" 
                           radius={[6, 6, 0, 0]} 
                           barSize={32}
                           activeBar={{ fill: '#10b981', stroke: '#10b981', strokeWidth: 2 }}
                        />
                        <Bar 
                           dataKey="Expenses" 
                           fill="#ef4444" 
                           radius={[6, 6, 0, 0]} 
                           barSize={32} 
                           activeBar={{ fill: '#ef4444', stroke: '#ef4444', strokeWidth: 2 }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ComparisonChart;
