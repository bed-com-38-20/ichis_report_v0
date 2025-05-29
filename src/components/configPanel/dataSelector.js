import React, { useState, useEffect } from 'react';
import {
  Button,
  CircularLoader,
  InputField,
  SingleSelect,
  SingleSelectOption,
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableCellHead,
  ButtonStrip,
  Box,
  Tooltip,
} from '@dhis2/ui';

const DataSelector = ({
  isOpen,
  onClose,
  availableItems = [],
  selectedItems = [],
  onSave,
}) => {
  const [dataSearchTerm, setDataSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);
  const [tempSelectedItems, setTempSelectedItems] = useState([]);

  // Initialize selected items when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('DataSelector selectedItems:', selectedItems);
      setTempSelectedItems(selectedItems);
    }
  }, [isOpen, selectedItems]);

  // Filter available items based on search term and type
  useEffect(() => {
    console.log('DataSelector availableItems:', availableItems);
    let items = availableItems;

    // Apply type filter
    if (selectedType !== 'all') {
      items = items.filter(item => {
        const match = item.type === selectedType;
        if (!match) {
          console.log(`Item type ${item.type} does not match selectedType ${selectedType}`);
        }
        return match;
      });
    }

    // Apply search filter
    if (dataSearchTerm.length > 1) {
      items = items.filter(item =>
        item.name?.toLowerCase().includes(dataSearchTerm.toLowerCase())
      );
    }

    // Exclude already selected items
    const selectedIds = tempSelectedItems.map(item => item.id);
    items = items.filter(item => !selectedIds.includes(item.id));

    console.log('DataSelector filteredItems:', items);
    setFilteredItems(items);
  }, [availableItems, selectedType, dataSearchTerm, tempSelectedItems]);

  // Handle moving items between tables
  const moveToSelected = (item) => {
    console.log('Moving to selected:', item);
    setTempSelectedItems(prev => [...prev, item]);
    setFilteredItems(prev => prev.filter(i => i.id !== item.id));
  };

  const moveAllToSelected = () => {
    console.log('Moving all to selected:', filteredItems);
    setTempSelectedItems(prev => [...prev, ...filteredItems]);
    setFilteredItems([]);
  };

  const moveFromSelected = (item) => {
    console.log('Moving from selected:', item);
    setFilteredItems(prev => [...prev, item]);
    setTempSelectedItems(prev => prev.filter(i => i.id !== item.id));
  };

  const moveAllFromSelected = () => {
    console.log('Moving all from selected:', tempSelectedItems);
    setFilteredItems(prev => [...prev, ...tempSelectedItems]);
    setTempSelectedItems([]);
  };

  // Handle saving selections
  const handleSave = () => {
    console.log('Saving selections:', tempSelectedItems);
    onSave(tempSelectedItems);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal position="middle" large onClose={onClose}>
      <ModalTitle>Select Data Items</ModalTitle>
      <ModalContent>
        <Box mb={16}>
          <InputField
            value={dataSearchTerm}
            onChange={({ value }) => setDataSearchTerm(value)}
            placeholder="Search for data items..."
            style={{ width: '100%' }}
          />
        </Box>
        
        <Box mb={16}>
          <SingleSelect
            selected={selectedType}
            onChange={({ selected }) => setSelectedType(selected)}
            placeholder="Select type"
            style={{ width: '100%' }}
          >
            <SingleSelectOption label="All types" value="all" />
            <SingleSelectOption label="Indicators" value="indicator" />
            <SingleSelectOption label="Data elements" value="dataElement" />
            <SingleSelectOption label="Data sets" value="dataSet" />
            <SingleSelectOption label="Event data items" value="eventDataItem" />
            <SingleSelectOption label="Program indicators" value="programIndicator" />
          </SingleSelect>
        </Box>
        
        <div style={{ display: 'flex', gap: '16px', height: '400px' }}>
          {/* Available Items Table */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4>Available Items</h4>
            <div style={{ flex: 1, overflow: 'auto', border: '1px solid #E0E0E0' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCellHead>Name</TableCellHead>
                    <TableCellHead>Type</TableCellHead>
                    <TableCellHead width="80px">Action</TableCellHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan="3">
                        {availableItems.length === 0
                          ? 'No data available. Check DHIS2 connection or metadata.'
                          : 'No items found for the selected type or search term.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name || 'Unknown'}</TableCell>
                        <TableCell>{item.type || 'Unknown'}</TableCell>
                        <TableCell>
                          <Button small onClick={() => moveToSelected(item)}>
                            →
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
            <Tooltip content="Move all to selected">
              <Button onClick={moveAllToSelected} disabled={filteredItems.length === 0}>
                {'>>'}
              </Button>
            </Tooltip>
            <Tooltip content="Move all to available">
              <Button onClick={moveAllFromSelected} disabled={tempSelectedItems.length === 0}>
                {'<<'}
              </Button>
            </Tooltip>
          </div>
          
          {/* Selected Items Table */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4>Selected Items</h4>
            <div style={{ flex: 1, overflow: 'auto', border: '1px solid #E0E0E0' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCellHead>Name</TableCellHead>
                    <TableCellHead>Type</TableCellHead>
                    <TableCellHead width="80px">Action</TableCellHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tempSelectedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan="3">No items selected</TableCell>
                    </TableRow>
                  ) : (
                    tempSelectedItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name || 'Unknown'}</TableCell>
                        <TableCell>{item.type || 'Unknown'}</TableCell>
                        <TableCell>
                          <Button small onClick={() => moveFromSelected(item)}>
                            ←
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </ModalContent>
      <ModalActions>
        <ButtonStrip>
          <Button onClick={onClose}>Cancel</Button>
          <Button primary onClick={handleSave}>Add Selected Items</Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
};

export default DataSelector;