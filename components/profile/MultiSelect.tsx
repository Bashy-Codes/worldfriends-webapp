'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  maxSelections?: number;
}

export default function MultiSelect({ options, selected, onChange, placeholder, maxSelections }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(search.toLowerCase()) && !selected.includes(option)
  );

  const handleSelect = (option: string) => {
    if (maxSelections && selected.length >= maxSelections) return;
    onChange([...selected, option]);
    setSearch('');
  };

  const handleRemove = (option: string) => {
    onChange(selected.filter(item => item !== option));
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white cursor-pointer flex items-center justify-between"
      >
        <div className="flex flex-wrap gap-2">
          {selected.length > 0 ? (
            selected.map(item => (
              <span key={item} className="bg-blue-600 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                {item}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-gray-300" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 border-b border-gray-600 outline-none"
          />
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.map(option => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className="p-3 hover:bg-gray-600 cursor-pointer text-white"
              >
                {option}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="p-3 text-gray-400 text-center">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}