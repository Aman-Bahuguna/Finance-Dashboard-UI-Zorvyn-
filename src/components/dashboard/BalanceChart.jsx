import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import Dropdown from '../ui/Dropdown';

const BalanceChart = () => {
  const transactions = useSelector((state) => state.transactions.data);
  const [timeRange, setTimeRange] = useState('This Month');
  const [chartType, setChartType] = useState('area');
  
  // Calculate running balance per day for the chart
  let chartData = [];
  const validTransactions = transactions.filter(t => t.status !== 'Failed');
  
  if (validTransactions.length > 0) {
    const sorted = [...validTransactions].sort((a,b) => new Date(a.date) - new Date(b.date));
    let currentBalance = 0;
    const balanceByDate = {};
    
    sorted.forEach(t => {
      if (t.type === 'income') currentBalance += t.amount;
      else currentBalance -= t.amount;
      
      const dateObj = new Date(t.date);
      const dateStr = `${dateObj.toLocaleString('default', { month: 'short' })} ${dateObj.getDate()}`;
      balanceByDate[dateStr] = currentBalance;
    });
    
    chartData = Object.keys(balanceByDate).map(date => ({
      name: date,
      balance: balanceByDate[date]
    }));
  }

  const timeOptions = [
    { value: 'This Month', label: 'This Month' },
    { value: 'Last Month', label: 'Last Month' }
  ];

  const chartTypeOptions = [
    { value: 'area', label: 'Area Chart' },
    { value: 'bar', label: 'Bar Chart' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border/50 rounded-xl p-3 shadow-[0_10px_25px_rgba(0,0,0,0.1)]">
          <p className="text-text-muted text-xs font-medium mb-1">{label}</p>
          <p className="text-text font-bold text-sm font-display">
            Balance: <span className="text-primary">₹{payload[0].value.toLocaleString('en-IN')}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value) => {
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${value}`;
  };

  return (
    <div className="glass p-6 rounded-2xl h-96 flex flex-col relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-50 w-full">
        <h3 className="text-lg font-display font-semibold text-text">Balance Trend</h3>
        
        <div className="flex gap-3 items-center">
          <Dropdown 
            value={chartType} 
            options={chartTypeOptions} 
            onChange={setChartType} 
            className="w-36 [&_button]:w-full"
          />
          <Dropdown 
            value={timeRange} 
            options={timeOptions} 
            onChange={setTimeRange} 
            className="w-36 [&_button]:w-full"
          />
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0 relative z-10">
        {chartData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-text-muted">
             <i className="pi pi-chart-line text-4xl mb-3 opacity-30"></i>
             <p>No transactions to track balance.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatYAxis} width={45} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="balance" stroke="var(--primary)" strokeWidth={3} fillOpacity={0.1} fill="var(--primary)" />
              </AreaChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatYAxis} width={45} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="balance" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default BalanceChart;
