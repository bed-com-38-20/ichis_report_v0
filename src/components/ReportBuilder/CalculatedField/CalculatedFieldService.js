// const DHIS2_API_URL = 'https://play.im.dhis2.org/stable-2-41-3-1';

// /**
//  * Fetch hints from DHIS2 indicators to guide formula creation.
//  */
// export const fetchFormulaHints = async () => {
//   try {
//     const response = await fetch(
//       `${DHIS2_API_URL}/api/indicators?fields=id,name,numerator,denominator&paging=false`,
//       {
//         headers: {
//           Authorization: 'Basic ' + btoa('admin:district'),
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (!response.ok) throw new Error(`API Error: ${response.status}`);

//     const { indicators } = await response.json();
//     return indicators.map((ind) => ({
//       name: ind.name,
//       expression: `${ind.numerator} / ${ind.denominator}`,
//     }));
//   } catch (error) {
//     console.error('Failed to fetch formula hints:', error);
//     return [];
//   }
// };

// /**
//  * Evaluates a formula string using a provided context of values.
//  * 
//  * Example:
//  *   formula: "A + B - C"
//  *   context: { A: 10, B: 5, C: 3 }
//  *   result: 12
//  */
// export const evaluateFormula = (formula, context = {}) => {
//   try {
//     // Replace variable names in the formula with values from the context
//     const parsedFormula = formula.replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, (match) => {
//       if (context.hasOwnProperty(match)) {
//         return context[match];
//       } else {
//         console.warn(`Missing value for variable: ${match}`);
//         return '0';
//       }
//     });

//     // Evaluate the parsed formula safely
//     // NOTE: Avoid eval in production if user input is involved; use a math parser like math.js
//     return eval(parsedFormula);
//   } catch (error) {
//     console.error('Error evaluating formula:', formula, error);
//     return null;
//   }
// };

const DHIS2_API_URL = 'https://play.im.dhis2.org/stable-2-41-3-1';

/**
 * Fetch hints from DHIS2 indicators to guide formula creation.
 */
export const fetchFormulaHints = async () => {
  try {
    const response = await fetch(
      `${DHIS2_API_URL}/api/indicators?fields=id,name,numerator,denominator&paging=false`,
      {
        headers: {
          Authorization: 'Basic ' + btoa('admin:district'),
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const { indicators } = await response.json();
    return indicators.map((ind) => ({
      name: ind.name,
      expression: `${ind.numerator} / ${ind.denominator}`,
    }));
  } catch (error) {
    console.error('Failed to fetch formula hints:', error);
    return [];
  }
};

/**
 * Returns readable formula hints like "Malaria Rate: numerator / denominator"
 */
export const getFormulaHintsAsText = async () => {
  const hints = await fetchFormulaHints();
  return hints.map((hint) => `${hint.name}: ${hint.expression}`);
};

/**
 * Evaluates a formula string using a provided context of values.
 * 
 * Example:
 *   formula: "A + B - C"
 *   context: { A: 10, B: 5, C: 3 }
 *   result: 12
 */
export const evaluateFormula = (formula, context = {}) => {
  try {
    // Replace variable names in the formula with values from the context
    const parsedFormula = formula.replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, (match) => {
      if (context.hasOwnProperty(match)) {
        return context[match];
      } else {
        console.warn(`Missing value for variable: ${match}`);
        return '0';
      }
    });

    // Evaluate the parsed formula safely
    return eval(parsedFormula);
  } catch (error) {
    console.error('Error evaluating formula:', formula, error);
    return null;
  }
};
