import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  Button,
  ButtonStrip,
  TextAreaField,
  Radio,
  RadioGroup
} from '@dhis2/ui';

/**
 * Modal component for configuring and adding dynamic text
 * 
 * @param {Object} props Component props
 * @param {boolean} props.isOpen Whether the modal is open
 * @param {Function} props.onClose Function to handle modal close
 * @param {Function} props.onAdd Function to handle adding the dynamic text
 * @returns {React.Component} Dynamic text modal
 */
const DynamicTextModal = ({ isOpen, onClose, onAdd }) => {
  const [text, setText] = useState('');
  const [placement, setPlacement] = useState('top');

  const handleSubmit = () => {
    if (!text) {
      return;
    }
    
    onAdd({
      text: text,
      placement: placement
    });
    
    // Reset form and close modal
    setText('');
    setPlacement('top');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal position="middle" onClose={onClose}>
      <ModalTitle>Add Dynamic Text</ModalTitle>
      <ModalContent>
        <div className="modal-form">
          <TextAreaField
            label="Text Content"
            name="dynamicText"
            value={text}
            onChange={({ value }) => setText(value)}
            placeholder="Enter text content"
            rows={5}
            required
          />
          
          <div className="placement-selection">
            <h3>Placement</h3>
            <RadioGroup
              name="placement"
              value={placement}
              onChange={({ value }) => setPlacement(value)}
            >
              <Radio label="Top" value="top" />
              <Radio label="Bottom" value="bottom" />
            </RadioGroup>
          </div>
        </div>
      </ModalContent>
      <ModalActions>
        <ButtonStrip end>
          <Button secondary onClick={onClose}>Cancel</Button>
          <Button primary onClick={handleSubmit} disabled={!text}>Add Text</Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
};

DynamicTextModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
};

export default DynamicTextModal;