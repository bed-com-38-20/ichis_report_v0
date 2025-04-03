import React, { useState } from "react";
//import { Button } from "./ui/button"
import  Button from '/src/D2App/components/ui/button.js';
import { Card, CardContent } from "/src/D2App/components/ui/card";
import  Select  from "/src/D2App/components/ui/select";
import  Input  from "/src/D2App/components/ui/input";

import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const TemplateDesigner = () => {
    const [elements, setElements] = useState([]);
    
    const handleDrop = (type) => {
        setElements([...elements, { id: elements.length + 1, type }]);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Template Designer</h2>
            <div className="flex gap-4">
                {/* Toolbox */}
                <div className="w-1/4 border p-2">
                    <h3 className="text-lg font-semibold mb-2">Components</h3>
                    <Button onClick={() => handleDrop("table")}>Add Table</Button>
                    <Button onClick={() => handleDrop("chart")}>Add Chart</Button>
                    <Button onClick={() => handleDrop("image")}>Add Image</Button>
                    <Button onClick={() => handleDrop("text")}>Add Text</Button>
                </div>

                {/* Design Area */}
                <div className="w-3/4 border p-4 min-h-[400px]">
                    <h3 className="text-lg font-semibold mb-2">Template</h3>
                    <DndContext>
                        <div className="border p-4 min-h-[300px]">
                            {elements.map((el) => (
                                <Card key={el.id} className="mb-2 p-2">
                                    <CardContent>
                                        {el.type === "table" && <div>[Table Placeholder]</div>}
                                        {el.type === "chart" && <div>[Chart Placeholder]</div>}
                                        {el.type === "image" && <div>[Image Placeholder]</div>}
                                        {el.type === "text" && <Input placeholder="Enter text..." />}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </DndContext>
                </div>
            </div>
        </div>
    );
};

export default TemplateDesigner;
