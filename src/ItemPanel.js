import React from 'react';
import { Card } from '@dhis2/ui';
import DraggableItem from './DraggableItem';

const ItemPanel = () => {
  // Sample items  
  const columnItems = [
    { id: 'col-a', name: '(A) Beginning Stock', type: 'column' },
    { id: 'col-b', name: '(B) Dispensed', type: 'column' },
    { id: 'col-c', name: '(C) Losses', type: 'column' },
    { id: 'col-d', name: '(D) Adjustment', type: 'column' },
    { id: 'col-e', name: '(E) Received', type: 'column' },
    { id: 'col-f', name: '(F) New Stock', type: 'column' },
    { id: 'col-g', name: '(G) Days Out of Stock', type: 'column' },
    { id: 'col-h', name: '(H) 7+ Days Stock Out', type: 'column' }
  ];

  // Sample drug/supply items  
  const drugItems = [
    { id: 'drug1', name: 'LA 6-1', type: 'drug', unit: 'Tablet' },
    { id: 'drug2', name: 'LA 6-2', type: 'drug', unit: 'Tablet' },
    { id: 'drug3', name: 'Recall Attesturele', type: 'drug', unit: 'Supp.' },
    { id: 'drug4', name: 'RDT', type: 'drug', unit: 'Kits' },
    { id: 'drug5', name: 'Paracetamol', type: 'drug', unit: 'Tablet' },
    { id: 'drug6', name: 'ORS', type: 'drug', unit: 'Sachet' },
    { id: 'drug7', name: 'Zinc', type: 'drug', unit: 'Tablet' },
    { id: 'drug8', name: 'Amoxicillin', type: 'drug', unit: 'Tablets' },
    { id: 'drug9', name: 'Eye ointment', type: 'drug', unit: 'Tube' },
    { id: 'drug10', name: 'Glove disposable', type: 'drug', unit: 'Pair' }
  ];

  return (
    <Card style={styles.card}>
      <h4 style={styles.sectionTitle}>Report Components</h4>
      
      <div style={styles.section}>
        <h5 style={styles.subtitle}>Table Columns</h5>
        {columnItems.map(item => (
          <DraggableItem key={item.id} item={item} />
        ))}
      </div>
      
      <div style={styles.section}>
        <h5 style={styles.subtitle}>Drugs/Supplies</h5>
        {drugItems.map(item => (
          <DraggableItem key={item.id} item={item} />
        ))}
      </div>

      <div style={styles.section}>
        <h5 style={styles.subtitle}>Form Elements</h5>
        <DraggableItem item={{ id: 'input', name: 'Text Input', type: 'element' }} />
        <DraggableItem item={{ id: 'checkbox', name: 'Checkbox', type: 'element' }} />
        <DraggableItem item={{ id: 'signature', name: 'Signature Line', type: 'element' }} />
      </div>
    </Card>
  );
};

const styles = {
  card: {
    marginTop: '16px',
    padding: '16px',
    height: 'calc(100vh - 400px)',
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