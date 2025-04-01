import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReportProvider } from "./context/ReportContext"; // Context for managing reports
import SavedReports from "./pages/SavedReports";
import ReportBuilder from "./components/ReportBuilder";
import ViewReport from "./pages/ViewReport";
import EditReport from "./components/EditReport";  // Import EditReport
import TemplateSelector from "./components/TemplateSelector"; // Import TemplateSelector

function App() {
    return (
        <ReportProvider> {/* Wrap everything inside ReportProvider to manage state globally */}
            <Router>
                <div className="container mx-auto p-4">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                        DHIS2 Report Generator
                    </h1>

                    {/* Template Selector for choosing a report template */}
                    <div className="mb-6">
                        <TemplateSelector />
                    </div>

                    <Routes>
                        <Route path="/" element={<SavedReports />} />
                        <Route path="/create-report" element={<ReportBuilder />} />
                        <Route path="/view-report/:id" element={<ViewReport />} />
                        <Route path="/edit-report/:id" element={<EditReport />} /> {/* New Route for Editing */}
                    </Routes>
                </div>
            </Router>
        </ReportProvider>
    );
}

export default App;
