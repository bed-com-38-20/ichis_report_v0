import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReportProvider } from "./context/ReportContext"; // Import ReportProvider
import SavedReports from "./pages/SavedReports";
import ReportBuilder from "./components/ReportBuilder";
import ViewReport from "./pages/ViewReport";

function App() {
    return (
        <ReportProvider> {/* Wrap the entire Router inside ReportProvider */}
            <Router>
                <Routes>
                    <Route path="/" element={<SavedReports />} />
                    <Route path="/create-report" element={<ReportBuilder />} />
                    <Route path="/view-report/:id" element={<ViewReport />} />
                </Routes>
            </Router>
        </ReportProvider>
    );
}

export default App;
