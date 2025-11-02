'use client';

import { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { DiscoveryFilters } from '@/types/discovery';
import { COUNTRIES, LANGUAGES } from '@/constants/data';

interface DiscoveryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: DiscoveryFilters;
  onApplyFilters: (filters: DiscoveryFilters) => void;
}

export default function DiscoveryFilterModal({ isOpen, onClose, filters, onApplyFilters }: DiscoveryFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<DiscoveryFilters>(filters);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Discovery Filters</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
            <select
              value={localFilters.country || ''}
              onChange={(e) => setLocalFilters({...localFilters, country: e.target.value || undefined})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Countries</option>
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Spoken Language</label>
            <select
              value={localFilters.spokenLanguage || ''}
              onChange={(e) => setLocalFilters({...localFilters, spokenLanguage: e.target.value || undefined})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Any Language</option>
              {LANGUAGES.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Learning Language</label>
            <select
              value={localFilters.learningLanguage || ''}
              onChange={(e) => setLocalFilters({...localFilters, learningLanguage: e.target.value || undefined})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Any Language</option>
              {LANGUAGES.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleClear}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}