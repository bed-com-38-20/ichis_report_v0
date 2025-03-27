import React from "react";

const Input = ({ placeholder, onChange, className }) => {
    return (
        <input
            type="text"
            className={`border p-2 rounded w-full ${className}`}
            placeholder={placeholder}
            onChange={onChange}
        />
    );
};

export default Input;
