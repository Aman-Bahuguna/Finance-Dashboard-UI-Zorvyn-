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

    const sortedData = Object.values(monthlyData).sort((a, b) => {
        const [aMonth, aYear] = a.name.split(' ');
        const [bMonth, bYear] = b.name.split(' ');
        return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
    }).slice(-6);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: '#141417', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 'bold' }}>{label}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>Income</span>
                            <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>₹{payload[0].value.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>Expenses</span>
                            <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>₹{payload[1].value.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass p-6 rounded-[2.5rem] flex flex-col relative overflow-hidden min-h-[420px] w-full">
            <h3 className="text-lg font-display font-semibold text-text mb-8">Income vs Expenses</h3>
            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sortedData.length > 0 ? sortedData : [{name: 'No Data', Income: 0, Expenses: 0}]} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                           dataKey="name" 
                           stroke="rgba(255,255,255,0.5)" 
                           fontSize={11} 
                           tickLine={false} 
                           axisLine={false} 
                           tickMargin={12}
                        />
                        <YAxis 
                           stroke="rgba(255,255,255,0.5)" 
                           fontSize={11} 
                           tickLine={false} 
                           axisLine={false} 
                           tickFormatter={(val) => `₹${val / 1000}k`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 8 }} />
                        <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                        <Bar 
                           dataKey="Income" 
                           fill="#10b981" 
                           radius={[4, 4, 0, 0]} 
                           barSize={32}
                           activeBar={{ fill: '#10b981', stroke: '#10b981', strokeWidth: 1 }}
                        />
                        <Bar 
                           dataKey="Expenses" 
                           fill="#ef4444" 
                           radius={[4, 4, 0, 0]} 
                           barSize={32} 
                           activeBar={{ fill: '#ef4444', stroke: '#ef4444', strokeWidth: 1 }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ComparisonChart;
