import React from 'react';
import { Bar } from "react-chartjs-2";
import { useDhis2Data } from "../../hook/useDhis2Data";

const ChartElement = ({ dataSource }) => {
  const { data } = useDhis2Data(dataSource);

  const chartData = {
    labels: data?.metaData?.dimensions?.ou || [],
    datasets: [
      {
        label: dataSource.indicator,
        data: data?.rows?.map((row) => row[2]) || [], // Assuming 3rd column is value
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default ChartElement;