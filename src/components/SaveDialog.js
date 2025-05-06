import { saveReportTemplate } from '../services/api';
import { Button, InputField, Modal } from '@dhis2/ui';

const SaveDialog = ({ template, onClose }) => {
  const [name, setName] = useState('');
  const [mutate, { loading, error }] = saveReportTemplate();

  const handleSave = async () => {
    await mutate({
      name,
      designContent: JSON.stringify(template),
      type: 'REPORT_TABLE'
    });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <InputField
        label="Report Name"
        value={name}
        onChange={({ value }) => setName(value)}
      />
      {error && <Alert error>{error.message}</Alert>}
      <Button primary loading={loading} onClick={handleSave}>
        Save to DHIS2
      </Button>
    </Modal>
  );
};