import React from 'react';

export default function DateTime({ date, options = {} }) {
  // Default options jika tidak diberikan
  const {
    weekday = 'short',
    year = 'numeric',
    month = 'long',
    day = 'numeric',
    hour = 'numeric',
    minute = 'numeric',
    second = 'numeric',
  } = options;

  // Dapatkan locale saat ini
  const currentLocale = new Intl.DateTimeFormat().resolvedOptions().locale;

  // Fungsi format tanggal
  const getDate = () =>
    new Intl.DateTimeFormat(currentLocale, {
      year,
      month,
      weekday,
      day,
      hour,
      minute,
      second,
    }).format(Date.parse(date));

  return <>{getDate()}</>;
}

// Default Props Dideklarasikan di Luar Fungsi
DateTime.defaultProps = {
  options: {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  },
};
