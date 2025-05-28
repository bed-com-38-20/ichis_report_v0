import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CircularLoader,
  InputField,
  ButtonStrip,
  Box,
  Divider,
} from '@dhis2/ui';
import DataEngine from './DataEngine';
import OrganisationUnitTree from './OrganizationUnitTree';
import ReportConfigForm from './ReportConfigForm';
import DataSelector from './dataSelector';
import PeriodSelector from './piri';
import OrganisationUnitSelector from './ogg';
import { fetchGroups, fetchAlternatives } from '../../api/dimensions';
import './ConfigPanel.css';

const ConfigPanel = ({
  reportConfig = {},
  loading = false,
  handlers = {},
  engine, // Receive engine prop
}) => {
  const [dimensionSearchTerm, setDimensionSearchTerm] = useState('');
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [periodModalOpen, setPeriodModalOpen] = useState(false);
  const [orgUnitModalOpen, setOrgUnitModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState(reportConfig.items || []);
  const [selectedPeriods, setSelectedPeriods] = useState(reportConfig.periods || []);
  const [indicatorGroups, setIndicatorGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [availableItems, setAvailableItems] = useState([]);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Log engine prop
  useEffect(() => {
    console.log('ConfigPanel engine prop:', engine);
    if (!engine) {
      setFetchError('DataEngine is missing. Ensure DataEngine is provided in ReportBuilderPage.');
    }
  }, [engine]);

  // Fetch indicator groups on mount
  useEffect(() => {
    if (!engine) {
      console.warn('DataEngine is not provided for fetching indicator groups');
      return;
    }

    setMetadataLoading(true);
    console.log('Fetching indicator groups...');
    fetchGroups(engine, 'indicators', 'displayName')
      .then(groups => {
        console.log('Indicator groups fetched:', groups);
        setIndicatorGroups(groups);
        setMetadataLoading(false);
      })
      .catch(error => {
        console.error('Error fetching indicator groups:', error);
        setFetchError(`Failed to fetch indicator groups: ${error.message}`);
        setMetadataLoading(false);
      });
  }, [engine]);

  // Fetch all data types when group or search term changes
  useEffect(() => {
    if (!engine) {
      console.warn('DataEngine is not provided for fetching data types');
      return;
    }

    setMetadataLoading(true);
    setFetchError(null);
    console.log('Fetching data types with search term:', dimensionSearchTerm);
    const dataTypes = [
      'indicators',
      'dataElements',
      'dataSets',
      'eventDataItems',
      'programIndicators',
    ];

    Promise.all(
      dataTypes.map(dataType =>
        fetchAlternatives({
          engine,
          dataType,
          groupId: dataType === 'indicators' ? selectedGroup : 'ALL',
          filterText: dimensionSearchTerm || undefined,
          nameProp: 'displayName',
        })
          .then(({ dimensionItems }) => {
            console.log(`Fetched ${dataType}:`, dimensionItems);
            return dimensionItems.map(item => ({
              ...item,
              type: dataType === 'indicators' ? 'indicator' :
                    dataType === 'dataElements' ? 'dataElement' :
                    dataType === 'dataSets' ? 'dataSet' :
                    dataType === 'eventDataItems' ? 'eventDataItem' :
                    'programIndicator',
            }));
          })
          .catch(error => {
            console.error(`Error fetching ${dataType}:`, error);
            setFetchError(`Failed to fetch ${dataType}: ${error.message}`);
            return [];
          })
      )
    )
      .then(results => {
        const combinedItems = results.flat();
        console.log('Combined availableItems:', combinedItems);
        setAvailableItems(combinedItems);
        setMetadataLoading(false);
      })
      .catch(error => {
        console.error('Error combining items:', error);
        setFetchError(`Failed to combine data items: ${error.message}`);
        setMetadataLoading(false);
      });
  }, [engine, selectedGroup, dimensionSearchTerm]);

  const handleDataSave = (items) => {
    console.log('Saving selected items:', items);
    setSelectedItems(items);
    handlers.handleItemsChange && handlers.handleItemsChange(items);
    setDataModalOpen(false);
  };

  const handlePeriodSave = (periods) => {
    setSelectedPeriods(periods);
    handlers.handlePeriodsChange && handlers.handlePeriodsChange(periods);
    setPeriodModalOpen(false);
  };

  const handleOrgUnitSave = (orgUnits) => {
    handlers.handleOrgUnitChange && handlers.handleOrgUnitChange(orgUnits);
    setOrgUnitModalOpen(false);
  };

  return (
    <div className="config-panel">
      <Card>
        <div className="config-content">
          <h3>Report Configuration</h3>
          
          {fetchError && (
            <Box mb={16}>
              <p style={{ color: 'red' }}>{fetchError}</p>
            </Box>
          )}
          
          <Box mb={16}>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="ALL">All Indicators</option>
              {indicatorGroups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </Box>
          
          <Box mb={16}>
            <InputField
              value={dimensionSearchTerm}
              onChange={({ value }) => setDimensionSearchTerm(value)}
              placeholder="Search for data items..."
              style={{ width: '100%' }}
            />
          </Box>
          
          <Box mb={16}>
            <Button onClick={() => setDataModalOpen(true)} disabled={metadataLoading}>
              🔍 Data {selectedItems.length > 0 && `(${selectedItems.length} selected)`}
            </Button>
            {metadataLoading && <CircularLoader small />}
          </Box>
          
          <Box mb={16}>
            <Button onClick={() => setPeriodModalOpen(true)}>
              📅 Period {selectedPeriods.length > 0 && `(${selectedPeriods.length} selected)`}
            </Button>
          </Box>
          
          <Box mb={16}>
            <Button onClick={() => setOrgUnitModalOpen(true)}>
              🏢 Organisation Unit {reportConfig?.orgUnits?.length > 0 && `(${reportConfig.orgUnits.length} selected)`}
            </Button>
          </Box>
          
          <Divider margin="16px 0" />
          
          <ReportConfigForm
            title={reportConfig?.title || ''}
            subtitle={reportConfig?.subtitle || ''}
            logo={reportConfig?.logo || null}
            onTitleChange={handlers?.handleTitleChange}
            onSubtitleChange={handlers?.handleSubtitleChange}
            onLogoUpload={handlers?.handleLogoUpload}
          />
          
          <Divider margin="16px 0" />
          
          <Box>
            <ButtonStrip>
              <Button primary onClick={handlers.handlePrint}>
                Generate Report
              </Button>
              <Button onClick={handlers.handleSave}>
                Save Configuration
              </Button>
            </ButtonStrip>
          </Box>
          
          <DataSelector
            isOpen={dataModalOpen}
            onClose={() => setDataModalOpen(false)}
            availableItems={availableItems}
            selectedItems={selectedItems}
            onSave={handleDataSave}
          />
          
          <PeriodSelector
            isOpen={periodModalOpen}
            onClose={() => setPeriodModalOpen(false)}
            selectedPeriods={selectedPeriods}
            onSave={handlePeriodSave}
          />
          
          <OrganisationUnitSelector
            isOpen={orgUnitModalOpen}
            onClose={() => setOrgUnitModalOpen(false)}
            selectedOrgUnits={reportConfig?.orgUnits || []}
            onSave={handleOrgUnitSave}
            OrganisationUnitTree={OrganisationUnitTree}
          />
          
          {loading && <CircularLoader />}
        </div>
      </Card>
    </div>
  );
};

ConfigPanel.propTypes = {
  reportConfig: PropTypes.object,
  metadata: PropTypes.object,
  loading: PropTypes.bool,
  handlers: PropTypes.object,
};

export default ConfigPanel;
