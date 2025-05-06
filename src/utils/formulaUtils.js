export const evaluateFormula = (formula, period, orgUnit, data) => {
    try {
      const expression = formula.replace(/[a-zA-Z0-9_.]+/g, (match) => {
        const key = `${period.id}-${orgUnit.id}-${match}`;
        const value = data[key]?.value;
        return isNaN(Number(value)) ? '0' : value;
      });
      // Evaluate using Function to avoid `eval`
      return new Function(`return ${expression}`)();
    } catch (error) {
      return 'Error';
    }
  };
  