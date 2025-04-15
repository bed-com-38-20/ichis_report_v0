import { useMetadata } from '../services/api';
import { Menu, MenuItem, InputField } from '@dhis2/ui';

const DataElementPicker = ({ onSelect }) => {
  const { loading, error, data } = useMetadata();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <CircularLoader />;
  if (error) return <Alert error>{error.message}</Alert>;

  const items = [
    ...data.dataElements.dataElements.map(de => ({
      ...de,
      type: 'DATA_ELEMENT'
    })),
    ...data.indicators.indicators.map(ind => ({
      ...ind,
      type: 'INDICATOR'
    }))
  ];

  const filteredItems = items.filter(item =>
    item.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="picker">
      <InputField
        placeholder="Search data elements..."
        value={searchTerm}
        onChange={({ value }) => setSearchTerm(value)}
      />
      <Menu>
        {filteredItems.map(item => (
          <MenuItem
            key={item.id}
            label={item.displayName}
            icon={item.type === 'DATA_ELEMENT' ? <IconData /> : <IconCalculator />}
            onClick={() => onSelect(item)}
          />
        ))}
      </Menu>
    </div>
  );
};