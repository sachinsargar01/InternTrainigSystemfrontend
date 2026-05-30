import React from "react";

function Modal({ title, show, onClose, children }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-lg"
        >
          ×
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
