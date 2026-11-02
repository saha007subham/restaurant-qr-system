/**
 * Currency and string formatting utilities
 */

export const formatINR = (amount) => {
  if (typeof amount !== 'number') amount = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPhone = (phone, countryCode = '+91') => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${countryCode} ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return `${countryCode} ${cleaned}`;
};

export const generateOrderNumber = () => {
  const letters = 'CR'; // Cafe Rustique
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `#${letters}-${randomDigits}`;
};

