/**
 * Format a number in Indian number format (with commas for lakhs and crores)
 */
export function formatIndianNumber(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return '0';

  const numStr = Math.round(num).toString();

  if (numStr.length <= 3) {
    return numStr;
  }

  // Get the last 3 digits
  let result = numStr.slice(-3);
  let remaining = numStr.slice(0, -3);

  // Add commas for every 2 digits in the remaining part
  while (remaining.length > 0) {
    const chunk = remaining.slice(-2);
    result = chunk + ',' + result;
    remaining = remaining.slice(0, -2);
  }

  // Remove leading comma if present
  return result.replace(/^,/, '');
}

/**
 * Format a number as Indian currency
 */
export function formatIndianCurrency(num: number): string {
  return '₹' + formatIndianNumber(num);
}
