import React from "react";

const Select = ({ children, onChange, className }) => {
    return (
        <select className={`border p-2 rounded ${className}`} onChange={onChange}>
            {children}
        </select>
    );
};

export default Select;
