import React, { useState } from 'react';
import './HeaderActions.css';

const HeaderActions = ({ 
  onPrint, 
  onSave, 
  onLoadTemplate, 
  savedTemplates, 
  isSaving, 
  activeTab, 
  setActiveTab 
}) => {
  const [showTemplates, setShowTemplates] = useState(false);
  
  return (
    <div className="header-actions">
      <div className="logo">
        <h2>Community Health Register</h2>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'design' ? 'active' : ''}`}
          onClick={() => setActiveTab('design')}
        >
          Design
        </button>
        {/* <button 
          className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          Data
        </button> */}
        <button 
          className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Templates
        </button>
      </div>
      
      <div className="actions">
        {/* <div className="templates-dropdown">
          <button 
            className="template-button"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            Templates
          </button>
          
          {showTemplates && (
            <div className="templates-menu">
              <h4>Saved Templates</h4>
              {savedTemplates.length === 0 ? (
                <p>No saved templates</p>
              ) : (
                <ul>
                  {savedTemplates.map(template => (
                    <li key={template.id}>
                      <button onClick={() => {
                        onLoadTemplate(template.id);
                        setShowTemplates(false);
                      }}>
                        {template.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div> */}
        
        <button 
          className="action-button save-button"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Template'}
        </button>
        
        <button 
          className="action-button print-button"
          onClick={onPrint}
        >
          Print Report
        </button>
      </div>
    </div>
  );
};

export default HeaderActions;