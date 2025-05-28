import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  ButtonStrip,
  Box,
} from "@dhis2/ui";
import { PeriodDimension } from "@dhis2/analytics";

const PeriodSelector = ({ isOpen, onClose, selectedPeriods = [], onSave }) => {
  const [tempSelectedPeriods, setTempSelectedPeriods] = useState([]);

  // Sync tempSelectedPeriods with selectedPeriods when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("selectedPeriods (prop):", selectedPeriods);
      const validPeriods = Array.isArray(selectedPeriods) ? selectedPeriods : [];
      setTempSelectedPeriods(validPeriods);
    }
  }, [isOpen, selectedPeriods]);

  // Handle saving selected periods
  const handleSave = () => {
    console.log("Saving periods:", tempSelectedPeriods);
    onSave(tempSelectedPeriods);
    onClose();
  };

  // Handle period selection from PeriodDimension
  const handleSelect = (selection) => {
    console.log("onSelect raw output:", selection);
    // Extract periods from selection.items (DHIS2 PeriodDimension format)
    const periods = Array.isArray(selection?.items) ? selection.items : [];
    console.log("Processed periods:", periods);
    setTempSelectedPeriods(periods);
  };

  if (!isOpen) return null;

  return (
    <Modal position="middle" onClose={onClose} open={isOpen}>
      <ModalTitle>Select Periods</ModalTitle>
      <ModalContent>
        <Box minHeight="400px">
          <PeriodDimension
            selectedPeriods={tempSelectedPeriods}
            onSelect={handleSelect}
          />
        </Box>
      </ModalContent>
      <ModalActions>
        <ButtonStrip end>
          <Button onClick={onClose}>Cancel</Button>
          <Button primary onClick={handleSave}>
            Add Selected Periods
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
};

export default PeriodSelector;