import React from 'react';

export default function Price({ price, locale = 'en-US', currency = 'USD' }) {
  // Debugging untuk memastikan currency tidak undefined
  console.log("Currency:", currency);
  console.log("Locale:", locale);
  console.log("Price:", price);

  const formatPrice = () => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || 'USD', // Pastikan currency tidak undefined
    }).format(price);
  };

  return <span>{formatPrice()}</span>;
}
