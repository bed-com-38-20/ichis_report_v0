import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  InputField,
  ButtonStrip,
  TextArea,
  Radio,
  Field,
} from '@dhis2/ui';
import { useReportBuilder } from '../ReportBuilderContext';

const DynamicFieldButton = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [placement, setPlacement] = useState('top');
  const { addDynamicText } = useReportBuilder();

  const handleAdd = () => {
    if (!text.trim()) return;

    const dynamicTextItem = {
      content: text.trim(),
      placement,
      includeVariables: true,
      formatting: {
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontSize: 'medium',
        textAlign: 'left'
      }
    };

    addDynamicText(dynamicTextItem);
    setOpen(false);
    setText('');
    setPlacement('top');
  };

  const handleRadioChange = ({ value }) => {
    setPlacement(value);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} icon={<i className="material-icons"></i>}>
        Add Dynamic Text
      </Button>

      {open && (
        <Modal onClose={() => setOpen(false)} position="middle" large>
          <ModalTitle>Add Dynamic Text</ModalTitle>
          <ModalContent>
            <TextArea
              label="Enter your text"
              name="text"
              value={text}
              onChange={({ value }) => setText(value)}
              placeholder="e.g. Report generated for ${orgUnit.name} during ${period.name}..."
              rows={4}
            />

            <Field label="Where should this text appear in the report?">
              <Radio
                label="Top of Report"
                value="top"
                checked={placement === 'top'}
                onChange={handleRadioChange}
                name="placement"
              />
              <Radio
                label="Bottom of Report"
                value="bottom"
                checked={placement === 'bottom'}
                onChange={handleRadioChange}
                name="placement"
              />
            </Field>
          </ModalContent>

          <ModalActions>
            <ButtonStrip>
              <Button primary onClick={handleAdd}>Add</Button>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
            </ButtonStrip>
          </ModalActions>
        </Modal>
      )}
    </>
  );
};

export default DynamicFieldButton;