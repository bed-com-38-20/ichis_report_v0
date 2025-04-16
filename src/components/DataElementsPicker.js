const METADATA_QUERY = {
    dataElements: {
        resource: 'dataElements',
        params: ({ search, categoryComboId }) => ({
            fields: ['id', 'displayName', 'categoryCombo[id,displayName]'],
            filter: [
                search ? `displayName:ilike:${search}` : undefined,
                categoryComboId ? `categoryCombo.id:eq:${categoryComboId}` : undefined
            ].filter(Boolean),
            paging: false,
        }),
    },
    indicators: {
        resource: 'indicators',
        params: ({ search }) => ({
            fields: ['id', 'displayName', 'indicatorType[id,displayName]'],
            filter: search ? `displayName:ilike:${search}` : undefined,
            paging: false,
        }),
    },
    categoryCombos: {
        resource: 'categoryCombos',
        params: {
            fields: ['id', 'displayName'],
            paging: false,
        },
    },
};

const DataElementPicker = ({ onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryComboId, setCategoryComboId] = useState('');
    const [metadataType, setMetadataType] = useState('dataElements');
    const [isOpen, setIsOpen] = useState(false);
    
    const { loading, error, data, refetch } = useDataQuery(METADATA_QUERY, {
        variables: { search: searchTerm, categoryComboId },
        lazy: true,
    });

    useEffect(() => {
        if (searchTerm.length > 2) {
            refetch({ search: searchTerm, categoryComboId });
            setIsOpen(true);
        }
    }, [searchTerm, categoryComboId, metadataType, refetch]);

    const handleSelect = (item) => {
        onSelect(item);
        setIsOpen(false);
        setSearchTerm('');
    };

    const renderItems = () => {
        const items = data?.[metadataType]?.[metadataType] || [];
        
        if (loading) return <MenuItem label="Loading..." />;
        if (error) return <MenuItem label={`Error: ${error.message}`} />;
        if (items.length === 0) return <MenuItem label="No results found" />;
        
        return items.map((item) => (
            <MenuItem
                key={item.id}
                label={
                    <div>
                        <div>{item.displayName}</div>
                        <div style={{ fontSize: '0.8em', color: '#666' }}>
                            {item.categoryCombo?.displayName || item.indicatorType?.displayName}
                        </div>
                    </div>
                }
                onClick={() => handleSelect(item)}
            />
        ));
    };

    return (
        <div style={{ position: 'relative', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <SingleSelect
                    selected={metadataType}
                    onChange={({ selected }) => setMetadataType(selected)}
                    label="Metadata type"
                    style={{ width: '180px' }}
                >
                    <SingleSelectOption label="Data Elements" value="dataElements" />
                    <SingleSelectOption label="Indicators" value="indicators" />
                </SingleSelect>
                
                {metadataType === 'dataElements' && (
                    <SingleSelect
                        selected={categoryComboId}
                        onChange={({ selected }) => setCategoryComboId(selected)}
                        label="Filter by category"
                        placeholder="Select category"
                        style={{ width: '200px' }}
                    >
                        <SingleSelectOption label="All categories" value="" />
                        {data?.categoryCombos?.categoryCombos?.map(cc => (
                            <SingleSelectOption 
                                key={cc.id} 
                                label={cc.displayName} 
                                value={cc.id} 
                            />
                        ))}
                    </SingleSelect>
                )}
                
                <InputField
                    value={searchTerm}
                    onChange={({ value }) => setSearchTerm(value)}
                    placeholder="Type to search..."
                    style={{ flex: 1 }}
                />
            </div>
            
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    zIndex: 1000,
                    width: '100%',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}>
                    {renderItems()}
                </div>
            )}
        </div>
    );
};