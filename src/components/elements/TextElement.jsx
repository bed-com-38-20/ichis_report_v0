import React, { useState, useEffect } from "react";
import { InputField } from "@dhis2/ui";

const TextElement = ({ text: initialText, onUpdate, isEditing }) => {
  const [text, setText] = useState(initialText || "");
  const [isFocused, setIsFocused] = useState(false);

  // Update parent when text changes (debounced)
  useEffect(() => {
    if (!isFocused && text !== initialText) {
      onUpdate?.(text);
    }
  }, [text, isFocused, initialText, onUpdate]);

  return (
    <div className="text-element" style={{ padding: "8px" }}>
      {isEditing ? (
        <InputField
          dense
          value={text}
          onChange={({ value }) => setText(value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter text..."
        />
      ) : (
        <div className="text-display">{text || "Double-click to edit"}</div>
      )}
    </div>
  );
};

export default TextElement;