import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";

const ReportConfigurator = () => {
    const [fields, setFields] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [location, setLocation] = useState("");

    useEffect(() => {
        // Fetch available fields from iCHIS/DHIS2 API
        fetch("/api/ichis/data-fields")
            .then(res => res.json())
            .then(data => setFields(data));
    }, []);

    const handleGenerateReport = () => {
        console.log("Generating report with:", selectedFields, startDate, endDate, location);
        // Call backend API to fetch and generate the report
    };

    return (
        <div className="p-6">
            <Card>
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">Configure Report</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            multiple
                            onValueChange={setSelectedFields}
                            placeholder="Select data fields"
                        >
                            {fields.map(field => (
                                <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
                            ))}
                        </Select>
                        <Input
                            placeholder="Enter location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <DatePicker onChange={setStartDate} placeholder="Start Date" />
                        <DatePicker onChange={setEndDate} placeholder="End Date" />
                    </div>
                    <Button className="mt-4" onClick={handleGenerateReport}>Generate Report</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReportConfigurator;
