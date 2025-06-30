import React from "react";

export default function ModalConfirmDelete({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="modal-confirm-overlay">
      <div className="modal-confirm-card">
        <svg fill="none" viewBox="0 0 24 24" width={48} height={48} className="modal-confirm-icon">
          <path
            d="M9 3V4H4V6H20V4H15V3H9ZM5 8V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V8H5ZM8 10H10V17H8V10ZM14 10H16V17H14V10Z"
            fill="#EF4444"
          />
        </svg>
        <h2 className="modal-confirm-title">Are you sure?</h2>
        <p className="modal-confirm-desc">
          Do you really want to continue? <br />This process cannot be undone.
        </p>
        <div className="modal-confirm-actions">
          <button className="modal-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-confirm-btn" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
