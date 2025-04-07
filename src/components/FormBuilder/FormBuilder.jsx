import React, { useState, Suspense, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { AlertBar } from '@dhis2/ui';

// Lazy-loaded components
const FormField = React.lazy(() => import('./FormField'));
const FieldTypesPanel = React.lazy(() => import('./FieldTypesPanel'));

const FieldTypes = {
  TEXT: 'text',
  SELECT: 'select',
  CHECKBOX: 'checkbox'
};

// Helper function to ensure ID is always a string
const getSafeId = (id) => {
  if (id === null || id === undefined) return ''; // Ensure null/undefined aren't passed
  if (typeof id === 'string') return id;
  return String(id); // Force conversion to string if it's not a string or number
};

// Create field function
const createField = (type) => {
    const uniqueId = `field-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const baseField = {
      id: uniqueId, // Ensure unique ID is a string
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false
    };
  
    switch(type) {
      case FieldTypes.SELECT:
        return {
          ...baseField,
          options: ['Option 1', 'Option 2'],
          value: ''
        };
      case FieldTypes.CHECKBOX:
        return {
          ...baseField,
          value: false
        };
      default:
        return {
          ...baseField,
          value: ''
        };
    }
  };


export const FormBuilder = () => {
  const [fields, setFields] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [error, setError] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  // Ensure IDs are strings
  const fieldIds = useMemo(() => fields.map(field => String(field.id)), [fields]);

  const handleAddField = (type) => {
    try {
      const newField = createField(type);
      console.log("New Field Created:", newField);
      setFields(prev => [...prev, newField]);
    } catch (e) {
      setError(`Failed to add field: ${e.message}`);
    }
  };

  const handleDragEnd = (event) => {
    try {
      const { active, over } = event;

      console.log("Drag End Event:", active, over);

      if (active && over && active.id !== over.id) {
        setFields(prev => {
          const activeIndex = prev.findIndex(f => String(f.id) === String(active.id));
          const overIndex = prev.findIndex(f => String(f.id) === String(over.id));
          console.log("Active Index:", activeIndex, "Over Index:", overIndex);
          return arrayMove(prev, activeIndex, overIndex);
        });
      }
    } catch (e) {
      setError(`Drag operation failed: ${e.message}`);
    }
  };

  const handleUpdateField = (id, updates) => {
    setFields(prev => 
      prev.map(field => 
        String(field.id) === String(id) ? { ...field, ...updates } : field
      ).filter(field => !updates.deleted)
    );
  };

  return (
    <div className="form-builder">
      {error && (
        <AlertBar critical onHidden={() => setError(null)}>
          {String(error)} {/* Ensure error is a string */}
        </AlertBar>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => {
          setActiveField(fields.find(f => String(f.id) === String(active.id)));
        }}
      >
        <div className="builder-container">
          <Suspense fallback={<div>Loading...</div>}>
            <FieldTypesPanel 
              fieldTypes={Object.values(FieldTypes)} 
              onAddField={handleAddField} 
            />
          </Suspense>

          <div className="form-preview">
            <h3>Form Preview</h3>
            <SortableContext
              items={fieldIds}
              strategy={verticalListSortingStrategy}
            >
              <Suspense fallback={<div>Loading...</div>}>
                {fields.map(field => (
                  <FormField
                    key={field.id}
                    field={field}
                    onUpdate={(updates) => handleUpdateField(field.id, updates)}
                  />
                ))}
              </Suspense>
            </SortableContext>
          </div>
        </div>
      </DndContext>
    </div>
  );
};

