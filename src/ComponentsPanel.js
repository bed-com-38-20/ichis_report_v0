import React from 'react';
import { useDrag } from 'react-dnd';
import { Card } from '@dhis2/ui';

const ComponentsPanel = () => {
  const columns = [
    { id: 'col-a', name: '(A) Beginning Stock', type: 'COLUMN' },
    { id: 'col-b', name: '(B) Dispensed', type: 'COLUMN' },
    { id: 'col-c', name: '(C) Losses', type: 'COLUMN' },
    { id: 'col-d', name: '(D) Adjustment', type: 'COLUMN' },
    { id: 'col-e', name: '(E) Received', type: 'COLUMN' },
    { id: 'col-f', name: '(F) New Stock', type: 'COLUMN' },
    { id: 'col-g', name: '(G) Days Out of Stock', type: 'COLUMN' },
    { id: 'col-h', name: '(H) 7+ Days Stock Out', type: 'COLUMN' }
  ];

  const items = [
    { id: 'item1', name: 'LA 6-1', unit: 'Tablet', type: 'ITEM' },
    { id: 'item2', name: 'LA 6-2', unit: 'Tablet', type: 'ITEM' },
    { id: 'item3', name: 'Recall Attesturele', unit: 'Supp.', type: 'ITEM' },
    { id: 'item4', name: 'RDT', unit: 'Kits', type: 'ITEM' },
    { id: 'item5', name: 'Paracetamol', unit: 'Tablet', type: 'ITEM' },
    { id: 'item6', name: 'ORS', unit: 'Sachet', type: 'ITEM' },
    { id: 'item7', name: 'Zinc', unit: 'Tablet', type: 'ITEM' }
  ];

  return (
    <Card>
      <h3>Drag to Build Report</h3>
      
      <h4>Table Columns</h4>
      {columns.map(col => (
        <DraggableComponent key={col.id} item={col} />
      ))}
      
      <h4>Drugs/Supplies</h4>
      {items.map(item => (
        <DraggableComponent key={item.id} item={item} />
      ))}
    </Card>
  );
};

const DraggableComponent = ({ item }) => {
  const [{ isDragging }, drag] = useDrag({
    type: item.type,
    item: item,
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '8px 0',
        border: '1px solid #ddd',
        backgroundColor: '#f9f9f9',
        cursor: 'move'
      }}
    >
      {item.name} {item.unit && `(${item.unit})`}
    </div>
  );
};

export default ComponentsPanel;