import React from 'react';
import { 
  ButtonStrip,
  Divider,
  Box,
  Tooltip
} from '@dhis2/ui';
import styled from 'styled-components';
import CalculatedFieldButton from './CalculatedField/CalculatedFieldButton';
import DynamicTextButton from './DynamicText/DynamicTextButton';
import { useReportBuilderContext } from '../contexts/ReportBuilderContext';

// Styled components for the toolbar
const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #f5f5f7;
  border-bottom: 1px solid #d5dde5;
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToolbarTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #212934;
`;

/**
 * Toolbar component for the report builder interface
 * 
 * @returns {React.Component} The toolbar component
 */
const ReportBuilderToolbar = () => {
  const { 
    saveAsTemplate, 
    exportToPDF, 
    reportConfig,
    isTemplatesLoading,
    isSaving
  } = useReportBuilder();
  

//   const handleSaveTemplate = () => {
//     saveTemplate();
//   };

//   const handlePrintReport = () => {
//     printReport();
//   };
  const handleSaveTemplate = () => {
    saveAsTemplate(reportConfig?.title || 'My Report Template');
  };
  
  const handlePrintReport = () => {
    exportToPDF();
  };
  

  return (
    <ToolbarContainer>
      <ToolbarSection>
        <ToolbarTitle>
          {reportConfig?.title || 'Community Health Register'}
        </ToolbarTitle>
      </ToolbarSection>
      
      <ToolbarSection>
        <ButtonStrip>
          {/* Design tools for report building */}
          <CalculatedFieldButton />
          <DynamicTextButton />

          <Divider vertical />
          
          {/* Report actions */}
          <Tooltip content="Save the current report as a template for future use">
            <Box>
            <Button 
  onClick={handleSaveTemplate}
  loading={isSaving}
  icon={<i className="material-icons">save</i>}
>
  Save Template
</Button>

            </Box>
          </Tooltip>
          
          <Tooltip content="Print or export the current report to PDF">
            <Box>
              <DynamicTextButton 
                onClick={handlePrintReport}
                icon={<i className="material-icons">print</i>}
              >
                Print Report
              </DynamicTextButton>
            </Box>
          </Tooltip>
        </ButtonStrip>
      </ToolbarSection>
    </ToolbarContainer>
  );
};

export default ReportBuilderToolbar;