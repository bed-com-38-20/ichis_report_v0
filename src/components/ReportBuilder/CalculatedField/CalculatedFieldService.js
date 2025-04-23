// import { useDataQuery } from '@dhis2/app-runtime';

// const DHIS2_API_URL = 'https://play.im.dhis2.org/stable-2-41-3-1';

// /**
//  * Fetch formula hints from DHIS2 API
//  * 
//  * @returns {Promise<Array>} Array of formula hints
//  */
// export const fetchFormulaHints = async () => {
//   try {
//     const response = await fetch(`${DHIS2_API_URL}/api/expressions`, {
//       method: 'GET',
//       headers: {
//         'Authorization': 'Basic ' + btoa('admin:district'), 
//         'Content-Type': 'application/json'
//       }
//     });
    
//     if (!response.ok) {
//       throw new Error(`Error fetching formulas: ${response.status}`);
//     }
    
//     const data = await response.json();
//     return data.expressions || [];
//   } catch (error) {
//     console.error('Failed to fetch formula hints:', error);
//     throw error;
//   }
// };

// /**
//  * Evaluate a formula using data from DHIS2
//  * 
//  * @param {string} formula The formula to evaluate
//  * @param {Object} context Data context for evaluation (org units, periods, etc.)
//  * @returns {Promise<number|string>} The result of the formula evaluation
//  */
// export const evaluateFormula = async (formula, context = {}) => {
//   try {
//     // In a real implementation, you would:
//     // 1. Parse the formula
//     // 2. Fetch the necessary data from DHIS2 using the context
//     // 3. Apply the formula logic
//     // 4. Return the result
    
//     // Mock implementation for demonstration
//     const response = await fetch(`${DHIS2_API_URL}/api/analytics/evaluate`, {
//       method: 'POST',
//       headers: {
//         'Authorization': 'Basic ' + btoa('admin:district'), // Replace with your auth method
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         expression: formula,
//         ...context
//       })
//     });
    
//     if (!response.ok) {
//       throw new Error(`Error evaluating formula: ${response.status}`);
//     }
    
//     const data = await response.json();
//     return data.result || 'N/A';
//   } catch (error) {
//     console.error('Failed to evaluate formula:', error);
//     return 'Error';
//   }
// };

// /**
//  * Hook for getting formula data from DHIS2
//  */
// export const useFormulaData = () => {
//   const { loading, error, data, refetch } = useDataQuery({
//     expressions: {
//       resource: 'expressions',
//       params: {
//         fields: 'id,name,expression,description',
//         paging: false
//       }
//     }
//   });

//   return {
//     loading,
//     error,
//     data: data?.expressions?.expressions || [],
//     refetch
//   };
// };

// /**
//  * Get a list of available indicators from DHIS2
//  * 
//  * @returns {Promise<Array>} Array of indicators
//  */
// export const fetchIndicators = async () => {
//   try {
//     const response = await fetch(`${DHIS2_API_URL}/api/indicators?fields=id,name,description&paging=false`, {
//       method: 'GET',
//       headers: {
//         'Authorization': 'Basic ' + btoa('admin:district'), // Replace with your auth method
//         'Content-Type': 'application/json'
//       }
//     });
    
//     if (!response.ok) {
//       throw new Error(`Error fetching indicators: ${response.status}`);
//     }
    
//     const data = await response.json();
//     return data.indicators || [];
//   } catch (error) {
//     console.error('Failed to fetch indicators:', error);
//     throw error;
//   }
// };

// /**
//  * Get a list of available data elements from DHIS2
//  * 
//  * @returns {Promise<Array>} Array of data elements
//  */
// export const fetchDataElements = async () => {
//   try {
//     const response = await fetch(`${DHIS2_API_URL}/api/dataElements?fields=id,name,valueType&paging=false`, {
//       method: 'GET',
//       headers: {
//         'Authorization': 'Basic ' + btoa('admin:district'), // Replace with your auth method
//         'Content-Type': 'application/json'
//       }
//     });
    
//     if (!response.ok) {
//       throw new Error(`Error fetching data elements: ${response.status}`);
//     }
    
//     const data = await response.json();
//     return data.dataElements || [];
//   } catch (error) {
//     console.error('Failed to fetch data elements:', error);
//     throw error;
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
    // NOTE: Avoid eval in production if user input is involved; use a math parser like math.js
    return eval(parsedFormula);
  } catch (error) {
    console.error('Error evaluating formula:', formula, error);
    return null;
  }
};
