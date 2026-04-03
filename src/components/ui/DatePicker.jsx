import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';

const DatePicker = ({ value, onChange, label }) => {
  // Parse incoming value or fallback to today
  const currentVal = value || new Date().toISOString().split('T')[0];
  const [yearStr, monthStr, dayStr] = currentVal.split('-');
  
  const handleDateChange = (type, newVal) => {
    let y = parseInt(yearStr, 10);
    let m = parseInt(monthStr, 10);
    let d = parseInt(dayStr, 10);
    
    if (type === 'year') y = parseInt(newVal, 10);
    if (type === 'month') m = parseInt(newVal, 10);
    if (type === 'day') d = parseInt(newVal, 10);
    
    // Ensure day is valid for the selected month/year
    const maxDays = new Date(y, m, 0).getDate();
    const validDay = d > maxDays ? maxDays : d;
    
    onChange(`${y}-${String(m).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`);
  };

  const daysOptions = Array.from({length: 31}, (_, i) => {
    const val = String(i + 1).padStart(2, '0');
    return { value: val, label: val };
  });

  const monthsOptions = [
    { value: '01', label: 'Jan' },
    { value: '02', label: 'Feb' },
    { value: '03', label: 'Mar' },
    { value: '04', label: 'Apr' },
    { value: '05', label: 'May' },
    { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' },
    { value: '08', label: 'Aug' },
    { value: '09', label: 'Sep' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' },
  ];

  const currentYear = new Date().getFullYear();
  const yearsOptions = Array.from({length: 10}, (_, i) => {
    const val = String(currentYear - 5 + i);
    return { value: val, label: val };
  });

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-text-muted">{label}</label>}
      <div className="flex items-center gap-1.5 w-full">
        <Dropdown 
          value={monthStr} 
          options={monthsOptions} 
          onChange={(v) => handleDateChange('month', v)} 
          className="flex-[1.2] min-w-0"
          buttonClassName="!min-w-0 !w-full !px-1.5 !py-2 flex justify-between !gap-0.5 text-[11px] sm:text-xs"
          menuClassName="!min-w-[80px]"
        />
        <Dropdown 
          value={dayStr} 
          options={daysOptions} 
          onChange={(v) => handleDateChange('day', v)} 
          className="flex-1 min-w-0"
          buttonClassName="!min-w-0 !w-full !px-1.5 !py-2 flex justify-between !gap-0.5 text-[11px] sm:text-xs"
          menuClassName="!min-w-[60px]"
        />
        <Dropdown 
          value={yearStr} 
          options={yearsOptions} 
          onChange={(v) => handleDateChange('year', v)} 
          className="flex-[1.3] min-w-0"
          buttonClassName="!min-w-0 !w-full !px-1.5 !py-2 flex justify-between !gap-0.5 text-[11px] sm:text-xs"
          menuClassName="!min-w-[80px]"
        />
      </div>
    </div>
  );
};

export default DatePicker;
