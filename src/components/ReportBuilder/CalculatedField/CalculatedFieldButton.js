// import React, { useState } from 'react';
// import {
//   Button,
//   Modal,
//   ModalTitle,
//   ModalContent,
//   ModalActions,
//   InputField,
//   TextArea,
//   ButtonStrip,
//   NoticeBox,
//   IconInfo16
// } from '@dhis2/ui';
// import { useReportBuilder } from '../ReportBuilderContext';

// const CalculatedFieldButton = () => {
//   const [open, setOpen] = useState(false);
//   const [fieldName, setFieldName] = useState('');
//   const [formula, setFormula] = useState('');
//   const [showHints, setShowHints] = useState(false);
//   const { addCalculatedField } = useReportBuilder();

//   const handleAdd = () => {
//     if (!fieldName.trim() || !formula.trim()) return;

//     const field = {
//       name: fieldName.trim(),
//       formula: formula.trim(),
//       placement: 'body' // or other layout logic
//     };

//     addCalculatedField(field);
//     setOpen(false);
//     setFieldName('');
//     setFormula('');
//   };

//   return (
//     <>
//       <Button onClick={() => setOpen(true)} icon={<i className="material-icons">functions</i>}>
//         Add Calculated Field
//       </Button>

//       {open && (
//         <Modal onClose={() => setOpen(false)} position="middle" large>
//           <ModalTitle>Add Calculated Field</ModalTitle>
//           <ModalContent>
//             <InputField
//               label="Field Name"
//               name="fieldName"
//               value={fieldName}
//               onChange={({ value }) => setFieldName(value)}
//               placeholder="e.g. Total Cases"
//             />
//             <TextArea
//               label="Formula"
//               name="formula"
//               value={formula}
//               onChange={({ value }) => setFormula(value)}
//               placeholder="e.g. #{abc123} + #{xyz456}"
//               rows={3}
//             />
//             <ButtonStrip>
//               <Button small onClick={() => setShowHints(!showHints)}>
//                 {showHints ? 'Hide Hints' : 'Show Formula Hints'}
//               </Button>
//             </ButtonStrip>

//             {showHints && (
//               <NoticeBox title="Formula Hints" icon={IconInfo16}>
//                 Use <code>#{dataElementID}</code> to refer to data elements. <br />
//                 Use <code>#{indicatorID}</code> for indicators. <br />
//                 You can perform operations like <code>+</code>, <code>-</code>, <code>/</code>, and <code>*</code>.
//                 <br />
//                 Example: <code>(#{abc123} + #{def456}) / #{xyz789}</code>
//               </NoticeBox>
//             )}
//           </ModalContent>
//           <ModalActions>
//             <ButtonStrip>
//               <Button primary onClick={handleAdd}>Add</Button>
//               <Button onClick={() => setOpen(false)}>Cancel</Button>
//             </ButtonStrip>
//           </ModalActions>
//         </Modal>
//       )}
//     </>
//   );
// };

// export default CalculatedFieldButton;

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
