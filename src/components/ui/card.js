import React from "react";

export const Card = ({ children, className }) => {
    return (
        <div className={`border shadow-md rounded p-4 ${className}`}>
            {children}
        </div>
    );
};

export const CardContent = ({ children }) => {
    return <div className="p-2">{children}</div>;
};
