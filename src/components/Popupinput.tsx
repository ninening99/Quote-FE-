// === components/Popupinput.tsx ===
import React from "react";
import "../styles/Popupinput.css";

type PopupInputProps = {
  title: string;
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

const PopupInput: React.FC<PopupInputProps> = ({ title, value, onChange, onCancel, onSave }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h2>{title}</h2>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter quote text..."
        />
        <div className="popup-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default PopupInput;
