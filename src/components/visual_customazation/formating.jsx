import React, { useState } from 'react';
import './conditional.css'; 

const ConditionalFormatting = ({ onFormatChange }) => {
  const [rules, setRules] = useState([
    { id: 1, field: '', operator: '>', value: 0, color: '#FF0000' }
  ]);

  const operators = ['>', '>=', '=', '<=', '<', '!='];

  const handleAddRule = () => {
    const newRule = {
      id: Date.now(),
      field: '',
      operator: '>',
      value: 0,
      color: '#FF0000'
    };
    setRules([...rules, newRule]);
    onFormatChange([...rules, newRule]);
  };

  const handleRemoveRule = (id) => {
    const updatedRules = rules.filter(rule => rule.id !== id);
    setRules(updatedRules);
    onFormatChange(updatedRules);
  };

  const handleRuleChange = (id, field, value) => {
    const updatedRules = rules.map(rule => {
      if (rule.id === id) {
        return { ...rule, [field]: value };
      }
      return rule;
    });
    setRules(updatedRules);
    onFormatChange(updatedRules);
  };

  return (
    <div className="conditional-formatting">
      <h3>Conditional Formatting Rules</h3>
      
      {rules.map(rule => (
        <div key={rule.id} className="format-rule">
          <div className="rule-field">
            <label>Field:</label>
            <input 
              type="text" 
              value={rule.field} 
              onChange={(e) => handleRuleChange(rule.id, 'field', e.target.value)}
              placeholder="Enter field name"
            />
          </div>
          
          <div className="rule-operator">
            <label>Condition:</label>
            <select 
              value={rule.operator}
              onChange={(e) => handleRuleChange(rule.id, 'operator', e.target.value)}
            >
              {operators.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>
          
          <div className="rule-value">
            <label>Value:</label>
            <input 
              type="number" 
              value={rule.value}
              onChange={(e) => handleRuleChange(rule.id, 'value', parseFloat(e.target.value))}
            />
          </div>
          
          <div className="rule-color">
            <label>Format Color:</label>
            <input 
              type="color" 
              value={rule.color}
              onChange={(e) => handleRuleChange(rule.id, 'color', e.target.value)}
            />
          </div>
          
          <button 
            className="remove-rule" 
            onClick={() => handleRemoveRule(rule.id)}
          >
            Remove
          </button>
        </div>
      ))}
      
      <button className="add-rule" onClick={handleAddRule}>
        Add Rule
      </button>
    </div>
  );
};

export default ConditionalFormatting;