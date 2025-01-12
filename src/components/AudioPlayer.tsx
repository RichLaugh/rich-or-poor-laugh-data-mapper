import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { formatTime } from '../utils/time';

interface AudioPlayerProps {
  src: string;
  onEnded?: () => void;
}

export function AudioPlayer({ src, onEnded }: AudioPlayerProps) {
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    skip,
    handleTimeUpdate,
    handleLoadedMetadata,
  } = useAudioPlayer();

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-4">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEnded}
      />
      
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={() => skip(-10)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button
          onClick={togglePlay}
          className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8" />
          )}
        </button>
        
        <button
          onClick={() => skip(10)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min={0}
          max={duration * 100}
          value={currentTime * 100}
          onChange={(e) => seek(Number(e.target.value)/ 100)}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}