/**
 * Filters an array of objects based on a search term and specified fields.
 * @param {Array<Object>} items - The array of objects to filter.
 * @param {string} searchTerm - The string to search for.
 * @param {Array<string>} fieldsToSearch - An array of keys (field names) in the objects to search within.
 * @returns {Array<Object>} - The filtered array of objects.
 */
export const filterData = (items, searchTerm, fieldsToSearch) => {
  if (!searchTerm || !searchTerm.trim()) {
    return items; // Return all items if searchTerm is empty or just whitespace
  }

  const lowercasedSearchTerm = searchTerm.toLowerCase();

  return items.filter(item => {
    return fieldsToSearch.some(field => {
      // Helper to get nested property value
      const getNestedValue = (obj, path) => {
        const parts = path.split('.');
        let value = obj;
        for (let i = 0; i < parts.length; i++) {
          if (value === null || value === undefined) return undefined;
          value = value[parts[i]];
        }
        return value;
      };

      const fieldValue = getNestedValue(item, field);

      if (fieldValue === null || fieldValue === undefined) {
        return false;
      }

      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(lowercasedSearchTerm);
      }

      if (typeof fieldValue === 'number') {
        return fieldValue.toString().toLowerCase().includes(lowercasedSearchTerm);
      }

      return false;
    });
  });
};
