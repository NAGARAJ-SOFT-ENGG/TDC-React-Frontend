// components/datepickerinput.jsx
import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt } from 'react-icons/fa';
import {CalendarDays} from 'lucide-react'
import 'react-datepicker/dist/react-datepicker.css';
import { InputField } from './input'; // 

export const DatePickerComponent = ({
  name,
  placeholderText,
  selected,
  onChange,
  required = false,
  className = '',
}) => {
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className="relative w-full" onClick={onClick} ref={ref}>
      <InputField
        name={name}
        value={value}
        onChange={() => {}}
        placeholder={placeholderText}
        className={className}
        required={required}
        readOnly
      />
      <CalendarDays
        className="absolute right-3 top-1/2 -translate-y-1/2 text-icon pointer-events-none"
        size={16}
      />
    </div>
  ));

  return (
    <div className="w-full">
      <DatePicker
        id={name}
        name={name}
        selected={selected}
        onChange={onChange}
        required={required}
        placeholderText={placeholderText}
        popperClassName="!z-[9999]"
        customInput={<CustomInput />}
      />
    </div>
  );
};
