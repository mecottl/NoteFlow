// components/Header/HeaderActions.jsx
import React from "react";

export default function HeaderActions({ onCreateNote }) {
  return (
    <div
      className="header-actions"
      style={{
        position: "absolute",
        right: 32,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        zIndex: 1100,
      }}
    >
      <button className="new-btn" onClick={onCreateNote}>
        Crear nota
      </button>
    </div>
  );
}
