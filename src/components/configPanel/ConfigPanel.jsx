import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CircularLoader,
  InputField,
  SingleSelect,
  SingleSelectOption,
  Menu,
  MenuItem,
  Tooltip,
  Divider
} from "@dhis2/ui";
import { useDataQuery } from "@dhis2/app-runtime";
import { PeriodDimension } from '@dhis2/analytics'
import { useDrag } from "react-dnd";
import OrganisationUnitPicker from "./OrganizationUnitTree"; 
import PeriodSelector from "./PeriodSelector";
import ReportConfigForm from "./ReportConfigForm";
import PropTypes from "prop-types";
import PeriodSelectPopup from "./PeriodDimensions";
import "./ConfigPanel.css";

const METADATA_QUERY = {
  dataElements: {
    resource: "dataElements",
    params: ({ search, categoryComboId }) => ({
      fields: ["id", "displayName", "categoryCombo[id,displayName]"],
      filter: [
        search ? `displayName:ilike:${search}` : undefined,
        categoryComboId ? `categoryCombo.id:eq:${categoryComboId}` : undefined,
      ].filter(Boolean),
      paging: false,
    }),
  },
  indicators: {
    resource: "indicators",
    params: ({ search }) => ({
      fields: ["id", "displayName", "indicatorType[id,displayName]"],
      filter: search ? `displayName:ilike:${search}` : undefined,
      paging: false,
    }),
  },
  categoryCombos: {
    resource: "categoryCombos",
    params: {
      fields: ["id", "displayName"],
      paging: false,
    },
  },
};

const DraggableItem = ({ item, onRemove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ITEM",
    item: {
      id: item.id,
      name: item.name,
      type: item.type,
      metadata: item.metadata,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Tooltip
        content={`${
          item.type === "indicator" ? "Indicator" : "Data Element"
        }: ${
          item.metadata?.indicatorType?.displayName ||
          item.metadata?.categoryCombo?.displayName
        }`}
      >
        <Button small>{item.name}</Button>
      </Tooltip>
      <Button small destructive onClick={() => onRemove(item.id)}>
        Remove
      </Button>
    </div>
  );
};

const ConfigPanel = ({
  reportConfig = {},
  metadata = {},
  loading = false,
  handlers = {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryComboId, setCategoryComboId] = useState("");
  const [metadataType, setMetadataType] = useState("dataElements");
  const [isOpen, setIsOpen] = useState(false);

  const {
    loading: queryLoading,
    error,
    data,
    refetch,
  } = useDataQuery(METADATA_QUERY, {
    
    lazy: true,
  });

  useEffect(() => {
    if (searchTerm.length > 2) {
      refetch({ search: searchTerm, categoryComboId });
      setIsOpen(true);
    }
  }, [searchTerm, categoryComboId, metadataType, refetch]);
  
  const handleSelect = (item) => {
    handlers.handleSelectDataElement(item);
    setIsOpen(false);
    setSearchTerm("");
  };

  const renderItems = () => {
    const items = data?.[metadataType]?.[metadataType] || [];

    if (queryLoading) return <MenuItem label="Loading..." />;
    if (error) return <MenuItem label={`Error: ${error.message}`} />;
    if (items.length === 0) return <MenuItem label="No results found" />;

    return items.map((item) => (
      <MenuItem
        key={item.id}
        label={
          <div>
            <div>{item.displayName}</div>
            <div style={{ fontSize: "0.8em", color: "#666" }}>
              {item.categoryCombo?.displayName ||
                item.indicatorType?.displayName}
            </div>
          </div>
        }
        onClick={() => handleSelect(item)}
      />
    ));
  };

  const PeriodSelectTest = () => {
    const [selectedPeriods, setSelectedPeriods] = useState([]);
    return (
        <PeriodDimension
            selectedPeriods={selectedPeriods}
            onSelect={(periods) => {
                setSelectedPeriods(periods);
                console.log("Selected Periods:", periods);
            }}
        />
    );
};

  return (
    <div className="config-panel">
      <Card>
        <div className="config-content">
          <h3>Report Configuration</h3>

          {/* ✅ Replaced OrgUnitSelector with OrganisationUnitPicker */}
          <h4>Select Organisation Units</h4>
          <OrganisationUnitPicker
            selectedOrgUnits={reportConfig?.orgUnits || []}
            setSelectedOrgUnits={handlers?.handleOrgUnitChange}
          />

          <PeriodSelectPopup/>

          {loading && <CircularLoader small />}

          <ReportConfigForm
            title={reportConfig?.title || ""}
            subtitle={reportConfig?.subtitle || ""}
            logo={reportConfig?.logo || null}
            onTitleChange={handlers?.handleTitleChange}
            onSubtitleChange={handlers?.handleSubtitleChange}
            onLogoUpload={handlers?.handleLogoUpload}
          />

          <Divider />

          <h3>Data Elements</h3>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <SingleSelect
                selected={metadataType}
                onChange={({ selected }) => setMetadataType(selected)}
                label="Metadata type"
                style={{ width: "180px" }}
              >
                <SingleSelectOption
                  label="Data Elements"
                  value="dataElements"
                />
                <SingleSelectOption label="Indicators" value="indicators" />
              </SingleSelect>

              {metadataType === "dataElements" && (
                <SingleSelect
                  selected={categoryComboId}
                  onChange={({ selected }) => setCategoryComboId(selected)}
                  label="Filter by category"
                  placeholder="Select category"
                  style={{ width: "200px" }}
                >
                  <SingleSelectOption label="All categories" value="" />
                  {data?.categoryCombos?.categoryCombos?.map((cc) => (
                    <SingleSelectOption
                      key={cc.id}
                      label={cc.displayName}
                      value={cc.id}
                    />
                  ))}
                </SingleSelect>
              )}
            </div>

            <InputField
              value={searchTerm}
              onChange={({ value }) => setSearchTerm(value)}
              placeholder="Type to search..."
              style={{ width: "100%" }}
            />

            {isOpen && (
              <div
                style={{
                  position: "relative",
                  zIndex: 1000,
                  width: "100%",
                  maxHeight: "300px",
                  overflowY: "auto",
                  backgroundColor: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  marginTop: "8px",
                }}
              >
                {renderItems()}
              </div>
            )}
          </div>

          <Divider />

          <h4>Selected Items</h4>
          {reportConfig.items?.length === 0 ? (
            <p>No items selected yet</p>
          ) : (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {reportConfig.items?.map((item) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  onRemove={handlers.handleRemoveItem}
                />
              ))}
            </div>
          )}

          <Divider />

          <div className="button-group">
            <Button primary onClick={handlers.handlePrint}>
              Print Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

ConfigPanel.propTypes = {
  reportConfig: PropTypes.object,
  metadata: PropTypes.object,
  loading: PropTypes.bool,
  handlers: PropTypes.object,
};

ConfigPanel.defaultProps = {
  reportConfig: {},
  metadata: {},
  loading: false,
  handlers: {},
};

export default ConfigPanel;
