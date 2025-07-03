import React from "react";
import "../styles/Popupinput.css";

type ConfirmPopupProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <p>{message}</p>
        <div className="popup-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="confirm-btn" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
