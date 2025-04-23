import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { evaluateFormula } from '../../utils/formulaUtils';
import jsPDF from 'jspdf';

// Create context
const ReportBuilderContext = createContext();

export const ReportBuilderProvider = ({ children }) => {
  const dataEngine = useDataEngine();
  const { show: showAlert } = useAlert();

  const [reportElements, setReportElements] = useState([]);
  const [reportConfig, setReportConfig] = useState({
    title: 'DHIS2 Report',
    subtitle: '',
    orgUnit: null,
    period: null,
    dataElements: [],
    indicators: []
  });

  const [modalState, setModalState] = useState({ isOpen: false, modalType: null });
  const [isTemplatesLoading, setIsTemplatesLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [dataValues, setDataValues] = useState({});

  // Initial fetch
  useEffect(() => { fetchTemplates(); }, []);

  useEffect(() => {
    if (reportConfig.orgUnit && reportConfig.period &&
      (reportConfig.dataElements.length > 0 || reportConfig.indicators.length > 0)) {
      fetchDataValues();
    }
  }, [reportConfig]);

  const fetchTemplates = async () => {
    setIsTemplatesLoading(true);
    try {
      const query = {
        templates: {
          resource: 'dataStore/reportTemplates',
          params: { fields: 'id,name,created,lastUpdated,user' }
        }
      };
      const response = await dataEngine.query(query);
      setTemplates(response.templates || []);
    } catch (error) {
      showAlert({ message: 'Failed to load report templates', type: 'error' });
    } finally {
      setIsTemplatesLoading(false);
    }
  };

  const fetchDataValues = async () => {
    try {
      const { orgUnit, period, dataElements, indicators } = reportConfig;
      if (!orgUnit || !period || (dataElements.length === 0 && indicators.length === 0)) return;

      let processedValues = {};

      if (dataElements.length > 0) {
        const query = {
          dataValues: {
            resource: 'dataValueSets',
            params: {
              orgUnit: orgUnit.id,
              period: period.id,
              dataElement: dataElements.map(de => de.id).join(';')
            }
          }
        };
        const response = await dataEngine.query(query);
        if (response.dataValues?.dataValues) {
          response.dataValues.dataValues.forEach(dv => {
            const key = `${dv.dataElement}.${dv.categoryOptionCombo}`;
            processedValues[key] = parseFloat(dv.value) || 0;
          });
        }
      }

      // Fetch indicators
      if (indicators.length > 0) {
        const indicatorQuery = {
          analytics: {
            resource: 'analytics',
            params: {
              dimension: `dx:${indicators.map(ind => ind.id).join(';')}`,
              filter: `ou:${orgUnit.id}`,
              period: period.id,
              skipMeta: true,
              skipHeaders: true
            }
          }
        };
        const indResponse = await dataEngine.query(indicatorQuery);
        if (indResponse.analytics?.rows) {
          indResponse.analytics.rows.forEach(row => {
            const key = row[0]; // Indicator ID
            processedValues[key] = parseFloat(row[1]) || 0;
          });
        }
      }

      setDataValues(processedValues);
    } catch (error) {
      showAlert({ message: 'Failed to load data values for calculation', type: 'error' });
    }
  };

  const addCalculatedField = (field) => {
    const result = evaluateFormula(field.formula, dataValues);
    const newElement = {
      id: `calc-${Date.now()}`,
      type: 'calculatedField',
      name: field.name,
      formula: field.formula,
      placement: field.placement,
      result
    };
    setReportElements([...reportElements, newElement]);
    showAlert({ message: 'Calculated field added successfully', type: 'success' });
  };

  const addDynamicText = (textItem) => {
    let processedContent = textItem.content;
    if (textItem.includeVariables) {
      processedContent = processedContent.replace(/\${orgUnit\.name}/g, reportConfig.orgUnit?.name || '')
        .replace(/\${period\.name}/g, reportConfig.period?.name || '')
        .replace(/\${currentDate}/g, new Date().toLocaleDateString())
        .replace(/\${reportTitle}/g, reportConfig.title || '')
        .replace(/\${reportSubtitle}/g, reportConfig.subtitle || '');
    }

    const newElement = {
      id: `text-${Date.now()}`,
      type: 'dynamicText',
      content: processedContent,
      originalContent: textItem.content,
      placement: textItem.placement,
      formatting: textItem.formatting || {
        fontWeight: 'normal', fontStyle: 'normal', fontSize: 'medium', textAlign: 'left'
      }
    };
    setReportElements([...reportElements, newElement]);
    showAlert({ message: 'Dynamic text added successfully', type: 'success' });
  };

  const addChart = (chartConfig) => {
    const newElement = {
      id: `chart-${Date.now()}`,
      type: 'chart',
      title: chartConfig.title,
      chartType: chartConfig.chartType,
      dataSource: chartConfig.dataSource,
      dimensions: chartConfig.dimensions,
      placement: chartConfig.placement,
      visualization: chartConfig.visualization || {}
    };
    setReportElements([...reportElements, newElement]);
    showAlert({ message: 'Chart added successfully', type: 'success' });
  };

  const addDataTable = (tableConfig) => {
    const newElement = {
      id: `table-${Date.now()}`,
      type: 'dataTable',
      title: tableConfig.title,
      columns: tableConfig.columns,
      dataSource: tableConfig.dataSource,
      placement: tableConfig.placement,
      styling: tableConfig.styling || {
        showBorders: true, headerBackground: '#f0f0f0', zebra: true
      }
    };
    setReportElements([...reportElements, newElement]);
    showAlert({ message: 'Data table added successfully', type: 'success' });
  };

  const removeElement = (elementId) => {
    setReportElements(reportElements.filter(element => element.id !== elementId));
    showAlert({ message: 'Element removed from report', type: 'success' });
  };

  const updateElement = (elementId, updatedProps) => {
    setReportElements(reportElements.map(element => {
      if (element.id === elementId) {
        return {
          ...element,
          ...updatedProps,
          ...(element.type === 'calculatedField' && updatedProps.formula
            ? { result: evaluateFormula(updatedProps.formula, dataValues) }
            : {})
        };
      }
      return element;
    }));
    showAlert({ message: 'Element updated successfully', type: 'success' });
  };

  const saveAsTemplate = async (templateName) => {
    if (!templateName?.trim()) {
      showAlert({ message: 'Please provide a valid template name', type: 'warning' });
      return;
    }
    setIsSaving(true);
    try {
      const templateData = {
        id: `template-${Date.now()}`,
        name: templateName,
        config: reportConfig,
        elements: reportElements,
        created: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        user: 'current-user'
      };

      await dataEngine.mutate({
        resource: `dataStore/reportTemplates/${templateData.id}`,
        type: 'create',
        data: templateData
      });

      await fetchTemplates();
      showAlert({ message: 'Report template saved successfully', type: 'success' });
    } catch (error) {
      showAlert({ message: 'Failed to save report template', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const loadTemplate = async (templateId) => {
    try {
      const response = await dataEngine.query({
        template: { resource: `dataStore/reportTemplates/${templateId}` }
      });
      const template = response.template;
      if (template) {
        setReportConfig(template.config);
        setReportElements(template.elements);
        showAlert({ message: `Template "${template.name}" loaded successfully`, type: 'success' });
      }
    } catch (error) {
      showAlert({ message: 'Failed to load report template', type: 'error' });
    }
  };

  const deleteTemplate = async (templateId) => {
    try {
      await dataEngine.mutate({
        resource: `dataStore/reportTemplates/${templateId}`,
        type: 'delete'
      });
      await fetchTemplates();
      showAlert({ message: 'Template deleted successfully', type: 'success' });
    } catch (error) {
      showAlert({ message: 'Failed to delete template', type: 'error' });
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(reportConfig.title || 'DHIS2 Report', 10, 10);
    doc.setFontSize(12);

    reportElements.forEach((element, idx) => {
      let y = 20 + (idx * 10);
      if (element.type === 'dynamicText') {
        doc.text(element.content, 10, y);
      } else if (element.type === 'calculatedField') {
        doc.text(`${element.name}: ${element.result}`, 10, y);
      } else if (element.type === 'dataTable') {
        doc.text(`[Table] ${element.title}`, 10, y);
      } else if (element.type === 'chart') {
        doc.text(`[Chart] ${element.title}`, 10, y);
      }
    });

    doc.save(`${reportConfig.title.replace(/\s+/g, '_')}.pdf`);
    showAlert({ message: 'Report exported as PDF', type: 'success' });
  };

  const openModal = (modalType) => setModalState({ isOpen: true, modalType });
  const closeModal = () => setModalState({ isOpen: false, modalType: null });

  const contextValue = {
    reportElements,
    reportConfig,
    setReportConfig,
    modalState,
    openModal,
    closeModal,
    templates,
    isTemplatesLoading,
    isSaving,
    dataValues,
    addCalculatedField,
    addDynamicText,
    addChart,
    addDataTable,
    removeElement,
    updateElement,
    saveAsTemplate,
    loadTemplate,
    deleteTemplate,
    exportToPDF
    // Add future: collaborative editing functions here
  };

  return (
    <ReportBuilderContext.Provider value={contextValue}>
      {children}
    </ReportBuilderContext.Provider>
  );
};

export const useReportBuilder = () => {
  const context = useContext(ReportBuilderContext);
  if (!context) throw new Error('useReportBuilder must be used within a ReportBuilderProvider');
  return context;
};
