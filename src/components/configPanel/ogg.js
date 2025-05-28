import React from "react";
import {
  Button,
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  ButtonStrip,
  Box,
} from "@dhis2/ui";

// Import the OrganisationUnitTree component which should be defined elsewhere
// This is just an interface for the existing OrganisationUnitTree component
const OrganisationUnitSelector = ({ 
  isOpen, 
  onClose, 
  selectedOrgUnits = [], 
  onSave, 
  OrganisationUnitTree 
}) => {
  const [tempSelectedOrgUnits, setTempSelectedOrgUnits] = React.useState([]);

  // Initialize selected org units when opening modal
  React.useEffect(() => {
    if (isOpen) {
      setTempSelectedOrgUnits(selectedOrgUnits);
    }
  }, [isOpen, selectedOrgUnits]);

  // Handle saving the selection
  const handleSave = () => {
    onSave(tempSelectedOrgUnits);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal position="middle" large onClose={onClose}>
      <ModalTitle>Select Organisation Units</ModalTitle>
      <ModalContent>
        <Box>
          {/* Pass the OrganisationUnitTree component and update local selection state */}
          {OrganisationUnitTree && (
            <OrganisationUnitTree
              selectedOrgUnits={tempSelectedOrgUnits}
              setSelectedOrgUnits={setTempSelectedOrgUnits}
            />
          )}
          {!OrganisationUnitTree && (
            <p>Organisation Unit Tree component not provided</p>
          )}
        </Box>
      </ModalContent>
      <ModalActions>
        <ButtonStrip>
          <Button onClick={onClose}>Cancel</Button>
          <Button primary onClick={handleSave}>Add Selected Units</Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
};

export default OrganisationUnitSelector;