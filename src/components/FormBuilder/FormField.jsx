import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Input,
  SingleSelect,
  SingleSelectOption,
  Checkbox,
  Button
} from '@dhis2/ui';

// Helper to ensure ID is always a string
const getSafeId = (id) => {
  if (id === null || id === undefined) return '';  // Ensure null/undefined aren't passed
  if (typeof id === 'string') return id;
  return String(id);  // Force conversion to string if it's not a string or number
}

const FormField = React.memo(({ field, onUpdate }) => {
  const safeId = String(field.id);  // Ensure the id is always a string

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: safeId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    margin: '8px 0',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
  }

  const renderFieldContent = () => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            label={field.label}
            value={field.value || ''}
            onChange={({ value }) => onUpdate({ value })}
          />
        );
      case 'select':
        return (
          <SingleSelect
            selected={field.value}
            onChange={({ selected }) => onUpdate({ value: selected })}
            label={field.label}
          >
            <SingleSelectOption label="Option 1" value="option1" />
            <SingleSelectOption label="Option 2" value="option2" />
          </SingleSelect>
        );
      case 'checkbox':
        return (
          <Checkbox
            label={field.label}
            checked={field.value || false}
            onChange={({ checked }) => onUpdate({ value: checked })}
          />
        );
      default:
        return <Input label={field.label} />;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="field-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button {...listeners} className="drag-handle" style={{ cursor: 'grab', fontSize: '18px' }}>
          ☰
        </button>
        <div style={{ flex: 1 }}>{renderFieldContent()}</div>
        <Button small destructive onClick={() => onUpdate({ deleted: true })}>
          Remove
        </Button>
      </div>
    </div>
  );
});

export default FormField;
