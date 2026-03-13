import React from 'react';
import { InputField } from '@components';
import {Search} from 'lucide-react'
export const SearchBar = ({ searchTerm, onSearchChange, placeholder = "Search..." }) => {
  return (
    <div className="relative w-full">
      <InputField
        name="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pr-10"
      />
      <Search className="w-4 h-4 text-icon absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
    </div>
  );
};
