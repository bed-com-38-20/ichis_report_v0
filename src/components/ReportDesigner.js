import { useState } from "react";
import { Card, CardContent } from "/src/D2App/components/ui/card";
import Button from "/src/D2App/components/ui/button";
import Select from "/src/D2App/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useDataQuery } from "@dhis2/app-runtime";

// Query for fetching data elements
const query = {
    dataElements: {
        resource: "dataElements",
    },
};

const ReportDesigner = () => {
    const { error, loading, data } = useDataQuery(query);
    const [selectedElement, setSelectedElement] = useState("");
    const [chartData, setChartData] = useState([]);

    // Handle chart generation and fetching actual data
    const handleGenerateChart = async () => {
        if (selectedElement) {
            try {
                // Example API call to get data for the selected element
                const response = await fetch(
                    `https://project.ccdev.org/ictprojects/api/dataValueSets?dataElement=${selectedElement}&period=202301`,
                    {
                        headers: {
                            Authorization: `Basic ${btoa("Abdulkambalame:Abdul1234@")}`,
                            Accept: "application/json",
                        },
                    }
                );
                const data = await response.json();
    
                // Check if there is any data for the selected data element
                if (data.dataValueSets && data.dataValueSets.length > 0) {
                    // Process the response to extract relevant data for the chart
                    const formattedData = data.dataValueSets.map((entry) => ({
                        name: entry.period, // Or another relevant field for X-axis
                        value: entry.value, // The actual value for the data element
                    }));
                    setChartData(formattedData);
                } else {
                    // If no data exists for the selected data element, show a message
                    setChartData([]);
                    alert("No data found for the selected data element.");
                }
            } catch (error) {
                console.error("Error fetching chart data:", error);
                alert("Error fetching data.");
            }
        }
    };
    

    // Show error/loading states
    if (error) return <span>Error: {error.message}</span>;
    if (loading) return <span>Loading...</span>;

    return (
        <div className="p-4">
            <Card className="mb-4">
                <CardContent>
                    <h2 className="text-xl font-bold mb-2">Design Report Template</h2>
                    <Select onChange={(e) => setSelectedElement(e.target.value)}>
                        <option value="">Select Data Element</option>
                        {data.dataElements.dataElements.map((el) => (
                            <option key={el.id} value={el.id}>
                                {el.displayName}
                            </option>
                        ))}
                    </Select>
                    <Button className="mt-2" onClick={handleGenerateChart}>
                        Generate Chart
                    </Button>
                </CardContent>
            </Card>

            {chartData.length > 0 && (
                <Card>
                    <CardContent>
                        <h3 className="text-lg font-semibold mb-2">Chart Preview</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ReportDesigner;










// import { useState } from "react";
// import { Card, CardContent } from "/src/D2App/components/ui/card";
// import Button from "/src/D2App/components/ui/button";
// import Select from "/src/D2App/components/ui/select";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { useDataQuery } from "@dhis2/app-runtime";

// // Query for fetching data elements
// const query = {
//     dataElements: {
//         resource: "dataElements",
//     },
// };

// const ReportDesigner = () => {
//     const { error, loading, data } = useDataQuery(query);
//     const [selectedElement, setSelectedElement] = useState("");
//     const [chartData, setChartData] = useState([]);

//     // Handle chart generation
//     const handleGenerateChart = () => {
//         if (selectedElement) {
//             // Generate random data for the selected data element
//             setChartData([
//                 { name: "Jan", value: Math.random() * 100 },
//                 { name: "Feb", value: Math.random() * 100 },
//                 { name: "Mar", value: Math.random() * 100 },
//                 { name: "Apr", value: Math.random() * 100 },
//                 { name: "May", value: Math.random() * 100 },
//                 { name: "Jun", value: Math.random() * 100 },
//                 { name: "Jul", value: Math.random() * 100 },
//                 { name: "Aug", value: Math.random() * 100 },
//                 { name: "Sep", value: Math.random() * 100 },
//                 { name: "Oct", value: Math.random() * 100 },
//                 { name: "Nov", value: Math.random() * 100 },
//                 { name: "Dec", value: Math.random() * 100 },
//             ]);
//         }
//     };

//     // Show error/loading states
//     if (error) return <span>Error: {error.message}</span>;
//     if (loading) return <span>Loading...</span>;

//     return (
//         <div className="p-4">
//             <Card className="mb-4">
//                 <CardContent>
//                     <h2 className="text-xl font-bold mb-2">Design Report Template</h2>
//                     <Select onChange={(e) => setSelectedElement(e.target.value)}>
//                         <option value="">Select Data Element</option>
//                         {data.dataElements.dataElements.map((el) => (
//                             <option key={el.id} value={el.id}>
//                                 {el.displayName}
//                             </option>
//                         ))}
//                     </Select>
//                     <Button className="mt-2" onClick={handleGenerateChart}>Generate Chart</Button>
//                 </CardContent>
//             </Card>

//             {chartData.length > 0 && (
//                 <Card>
//                     <CardContent>
//                         <h3 className="text-lg font-semibold mb-2">Chart Preview</h3>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <BarChart data={chartData}>
//                                 <XAxis dataKey="name" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Bar dataKey="value" fill="#8884d8" />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </CardContent>
//                 </Card>
//             )}
//         </div>
//     );
// };

// export default ReportDesigner;
