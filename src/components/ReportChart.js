import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const ReportChart = ({ data }) => {
    if (!data || Object.keys(data).length === 0) return <p>No chart data available</p>;

    const datasets = Object.keys(data).map((key) => ({
        label: key,
        data: data[key],
        borderColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
        borderWidth: 2,
        fill: false
    }));

    const chartData = {
        labels: data[Object.keys(data)[0]].map((d) => d.x),
        datasets
    };

    return <Line data={chartData} />;
};

export default ReportChart;
