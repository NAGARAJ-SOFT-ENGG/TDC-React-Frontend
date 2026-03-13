import React from 'react';

export const TextareaField = ({
  name,
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
}) => {
  return (
    <div className="relative w-full">
      <textarea
        id={name}
        name={name}
        placeholder=" "
        value={value}
        onChange={onChange}
        required={required}
        className={`textSecondary peer block w-full px-3 pt-5 pb-2 text-sm border border-textInactive rounded appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none  h-[16vh] ${className}`}
      ></textarea>
      <label
        htmlFor={name}
        className="absolute textSecondary duration-200 transform -translate-y-3 scale-75 top-1 left-3 z-10 origin-[0] bg-white px-1 
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:translate-y-4 
          peer-focus:scale-75 
          peer-focus:-translate-y-3 
          peer-focus:text-primary"
      >
        {placeholder}
      </label>
    </div>
  );
};
