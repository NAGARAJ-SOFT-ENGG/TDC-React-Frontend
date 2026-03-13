 export const parseDateDMY = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split(/[-\/\\:_]/);
  if (parts.length !== 3) return null;
  
  const [day, month, year] = parts;
  return new Date(`${year}-${month}-${day}`);
};

