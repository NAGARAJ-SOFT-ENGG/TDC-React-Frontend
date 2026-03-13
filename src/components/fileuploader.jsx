import React from 'react';
import { FiUploadCloud } from 'react-icons/fi';

export const FileUploader = ({ name, label, accept = 'image/*,.pdf', onChange }) => {
  const inputId = `${name}-file`;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const syntheticEvent = {
        target: {
          name: name,
          files: e.target.files
        }
      };
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="mt-2">
      <input
        type="file"
        id={inputId}
        name={name}
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
      <label htmlFor={inputId} className="cursor-pointer flex items-center gap-2 textSecondary hover:text-primary transition">
        <FiUploadCloud className="text-xl text-icon" />
        <span>{label}</span>
      </label>
    </div>
  );
};