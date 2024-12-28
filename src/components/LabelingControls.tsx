import React from 'react';
import { LabelCategory } from '../types/audio';
import { categories } from '../config/categories';

interface LabelingControlsProps {
  onLabel: (category: LabelCategory) => void;
  disabled?: boolean;
}

export function LabelingControls({ onLabel, disabled }: LabelingControlsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {categories.map(({ value, label, color }) => (
        <button
          key={value}
          onClick={() => onLabel(value)}
          disabled={disabled}
          className={`${color} text-white font-semibold py-3 px-6 rounded-lg 
            transition-all duration-200 transform hover:scale-105 
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            min-w-[120px]`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}