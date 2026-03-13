import { useState } from "react";

export const ToggleSwitch = ({ icon, isActive, onToggle }) => {

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-lg text-teal-500">{icon}</span>
      </div>

      <button
        onClick={() => onToggle(!isActive)}
        className={`relative w-11 h-5 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${
          isActive ? "bg-icon" : "bg-gray-300"
        }`}
      >
        <span
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isActive ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};
