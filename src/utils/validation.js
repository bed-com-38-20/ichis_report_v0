export const validateCombination = (item, column) => {
    if (column.type === 'indicator' && item.type !== 'indicator') {
      return {
        valid: false,
        message: 'Only indicators can be added to indicator columns'
      };
    }
    
    if (column.categoryCombo && 
        item.metadata.categoryCombo?.id !== column.categoryCombo) {
      return {
        valid: false,
        message: 'Category combo mismatch'
      };
    }
    
    return { valid: true };
  };
  
  export const validateDropLocation = (item, columns, dropIndex) => {
    if (dropIndex < 2) {
      return {
        valid: false,
        message: 'Cannot replace system columns'
      };
    }
    
    const targetColumn = columns[dropIndex];
    if (targetColumn) {
      return validateCombination(item, targetColumn);
    }
    
    return { valid: true };
  };