import React, { useState } from 'react';
import { Button } from '@dhis2/ui';
import CalculatedFieldModal from './CalculatedFieldModal';
import { useReportBuilder } from '../ReportBuilderContext';

const CalculatedFieldButton = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { addCalculatedField } = useReportBuilder();

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        icon={<i className="material-icons"></i>}
      >
        Add Calculated Field
      </Button>
      <CalculatedFieldModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={(field) => {
          addCalculatedField(field);
          setModalOpen(false);
        }}
      />
    </>
  );
};

export default CalculatedFieldButton;
