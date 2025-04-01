import React from "react";

const ReportTable = ({ data }) => {
    if (!data || data.length === 0) return <p>No data available</p>;

    return (
        <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-100">
                    {Object.keys(data[0]).map((key) => (
                        <th key={key} className="border p-2">{key}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index} className="border">
                        {Object.values(row).map((value, i) => (
                            <td key={i} className="border p-2">{value}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ReportTable;
