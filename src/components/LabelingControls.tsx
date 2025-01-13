import React from 'react';
import Tooltip from "./Tooltip.tsx";

export function LabelingControls({ onLabel, disabled, categories}) {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {categories.map(({ name, label, color, description, audio_count }) => (<Tooltip text={description} key={name}>
        <button
          onClick={() => onLabel(name)}
          disabled={disabled}
          className={`${color} text-white font-semibold py-3 px-6 rounded-lg
            transition-all duration-200 transform hover:scale-105
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            min-w-[120px]`}
        >
          {label} ({audio_count})
        </button>
      </Tooltip>))}
    </div>
  );
}