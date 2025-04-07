import React from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { useDhis2Data } from "../../hook/useDhis2Data";

const TableElement = ({ dataSource }) => {
  const { data, loading } = useDhis2Data(dataSource);

  const columns = data?.metaData?.dimensions?.dx?.map((id) => ({
    field: id,
    headerName: id,
  }));

  return (
    <DataGrid
      rows={data?.rows || []}
      columns={columns || []}
      loading={loading}
    />
  );
};

export default TableElement;