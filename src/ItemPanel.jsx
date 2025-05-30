import React from 'react';
import { useDrag } from 'react-dnd';
import { Card } from '@dhis2/ui';

const ItemPanel = () => {
  const availableColumns = [
    { id: 'col-a', name: '(A) Beginning Stock', type: 'COLUMN' },
    { id: 'col-b', name: '(B) Dispensed', type: 'COLUMN' },
    { id: 'col-c', name: '(C) Losses', type: 'COLUMN' },
    { id: 'col-d', name: '(D) Adjustment', type: 'COLUMN' },
    { id: 'col-e', name: '(E) Received', type: 'COLUMN' },
    { id: 'col-f', name: '(F) New Stock', type: 'COLUMN' },
    { id: 'col-g', name: '(G) Days Out of Stock', type: 'COLUMN' },
    { id: 'col-h', name: '(H) 7+ Days Stock Out', type: 'COLUMN' }
  ];

  const availableItems = [
    { id: 'item1', name: 'LA 6-1', unit: 'Tablet', type: 'ITEM' },
    { id: 'item2', name: 'LA 6-2', unit: 'Tablet', type: 'ITEM' },
    { id: 'item3', name: 'Recall Attesturele', unit: 'Supp.', type: 'ITEM' },
    { id: 'item4', name: 'RDT', unit: 'Kits', type: 'ITEM' },
    { id: 'item5', name: 'Paracetamol', unit: 'Tablet', type: 'ITEM' },
    { id: 'item6', name: 'ORS', unit: 'Sachet', type: 'ITEM' },
    { id: 'item7', name: 'Zinc', unit: 'Tablet', type: 'ITEM' },
    { id: 'item8', name: 'Amoxicillin', unit: 'Tablets', type: 'ITEM' },
    { id: 'item9', name: 'Eye ointment', unit: 'Tube', type: 'ITEM' },
    { id: 'item10', name: 'Glove disposable', unit: 'Pair', type: 'ITEM' }
  ];

  return (
    <Card style={styles.card}>
      <h4 style={styles.sectionTitle}>Drag to Build Report</h4>
      
      <div style={styles.section}>
        <h5 style={styles.subtitle}>Table Columns</h5>
        {availableColumns.map(item => (
          <DraggableBox key={item.id} item={item} />
        ))}
      </div>
      
      <div style={styles.section}>
        <h5 style={styles.subtitle}>Drugs/Supplies</h5>
        {availableItems.map(item => (
          <DraggableBox key={item.id} item={item} />
        ))}
      </div>
    </Card>
  );
};

const DraggableBox = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: item.type,
    item: item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        marginBottom: '8px',
        padding: '8px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        backgroundColor: isDragging ? '#f0f7ff' : '#f9f9f9'
      }}
    >
      {item.name}
      {item.unit && <span style={{ color: '#666', marginLeft: '8px' }}>({item.unit})</span>}
    </div>
  );
};

const styles = {
  card: {
    marginTop: '16px',
    padding: '16px',
    height: 'calc(100vh - 300px)',
    overflowY: 'auto'
  },
  sectionTitle: {
    margin: '0 0 16px 0',
    color: '#212934',
    fontSize: '14px',
    fontWeight: '500'
  },
  subtitle: {
    margin: '16px 0 8px 0',
    fontSize: '13px',
    color: '#4a5768',
    fontWeight: '500'
  },
  section: {
    marginBottom: '20px'
  }
};

export default ItemPanel;