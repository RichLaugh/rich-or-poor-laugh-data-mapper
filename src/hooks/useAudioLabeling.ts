import { useState } from 'react';
import { AudioFile, LabelCategory } from '../types/audio';

export function useAudioLabeling(audioFiles: AudioFile[]) {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [labeledFiles, setLabeledFiles] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);

  const currentFile = audioFiles[currentFileIndex];
  const totalFiles = audioFiles.length;

  const handleLabel = (category: LabelCategory) => {
    if (currentFile) {
      // In a real app, make an API call to save the label
      console.log(`Labeling file ${currentFile.name} as ${category}`);
      
      setLabeledFiles(prev => new Set([...prev, currentFile.id]));
      
      // Move to next file if available
      if (currentFileIndex < totalFiles - 1) {
        setCurrentFileIndex(prev => prev + 1);
      }
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return {
    currentFile,
    currentFileIndex,
    totalFiles,
    labeledFiles,
    handleLabel,
    handleAudioEnd,
  };
}