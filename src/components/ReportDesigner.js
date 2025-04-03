import { useState, useEffect } from "react";
import { Card, CardContent } from "/src/D2App/components/ui/card";
//import { Button } from "/src/D2App/components/ui/button";
import  Button  from "/src/D2App/components/ui/button";
import  Input  from "/src/D2App/components/ui/input";
import  Select  from "/src/D2App/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ReportDesigner =() =>{
    const [dataElements, setDataElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState("");
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetch("https://project.ccdev.org/ictprojects/api/dataElements?paging=false", {
            headers: {
                Authorization: `Basic ${btoa("username:password")}`,
                Accept: "application/json"
            }
        })
        .then(response => response.json())
        .then(data => setDataElements(data.dataElements))
        .catch(error => console.error("Error fetching DHIS2 data elements:", error));
    }, []);

    const handleGenerateChart = () => {
        setChartData([
            { name: "Jan", value: Math.random() * 100 },
            { name: "Feb", value: Math.random() * 100 },
            { name: "Mar", value: Math.random() * 100 },
        ]);
    };

    return (
        <div className="p-4">
            <Card className="mb-4">
                <CardContent>
                    <h2 className="text-xl font-bold mb-2">Design Report Template</h2>
                    <Select onChange={(e) => setSelectedElement(e.target.value)}>
                        <option value="">Select Data Element</option>
                        {dataElements.map((el) => (
                            <option key={el.id} value={el.id}>{el.displayName}</option>
                        ))}
                    </Select>
                    <Button className="mt-2" onClick={handleGenerateChart}>Generate Chart</Button>
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