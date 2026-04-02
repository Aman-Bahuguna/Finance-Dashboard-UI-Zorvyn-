/**
 * Converts an array of transaction objects to CSV format.
 * @param {Array} data - The transaction data.
 * @returns {string} - CSV-formatted string.
 */
export const convertToCSV = (data) => {
  if (!data || !data.length) return '';
  
  const headers = ['ID', 'Date', 'Amount (INR)', 'Category', 'Type', 'Status', 'Payment Method'];
  const rows = data.map(t => [
    t.id,
    t.date,
    t.amount,
    t.category,
    t.type,
    t.status || 'Completed',
    t.paymentMethod
  ].join(','));
  
  return [headers.join(','), ...rows].join('\n');
};

/**
 * Triggers a file download in the browser.
 * @param {string} content - The file content.
 * @param {string} fileName - The desired file name.
 * @param {string} contentType - The MIME type of the file.
 */
export const downloadFile = (content, fileName, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
