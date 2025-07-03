import React from "react";

type PopupCardProps = {
  message: string;
  onClose: () => void;
  type?: "error" | "success";
};

const PopupCard: React.FC<PopupCardProps> = ({ message, onClose, type = "error" }) => {
  const bgColor = type === "error" ? "#ffe0e0" : "#e0ffe0";
  const borderColor = type === "error" ? "#ff4d4f" : "#4caf50";
  const textColor = type === "error" ? "#b00020" : "#2e7d32";

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        width: "300px",
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "8px",
        padding: "1rem",
        zIndex: 10,
        color: textColor,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          fontWeight: "bold",
          fontSize: "1.2rem",
          cursor: "pointer",
          color: textColor,
          marginLeft: "1rem",
        }}
        aria-label="Close popup"
      >
        ✖
      </button>
    </div>
  );
};

export default PopupCard;
