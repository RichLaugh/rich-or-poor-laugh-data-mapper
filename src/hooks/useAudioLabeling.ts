import {useEffect, useState} from 'react';
import { AudioFile, LabelCategory } from '../types/audio';
import {markAudio} from "../services/audio.ts";
import {toast} from 'react-toastify';

export function useAudioLabeling(audioFiles: AudioFile[]) {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [labeledFiles, setLabeledFiles] = useState<Set<string>>(new Set());

  const currentFile = audioFiles[currentFileIndex];
  const totalFiles = audioFiles.length;

  useEffect(()=>{
    setLabeledFiles(new Set())
    setCurrentFileIndex(0)
  }, [audioFiles])

  const handleLabel = async (category: LabelCategory) => {
    if (currentFile) {
      // In a real app, make an API call to save the label
      console.log(currentFile, category);
      await markAudio(currentFile.name, category);
      setLabeledFiles(prev => new Set([...prev, currentFile.id]));
      let old = currentFile.category ? currentFile.category : 'unsorted';
      toast.info(`${currentFile.name} moved from ${old} to ${category}`)
      // Move to next file if available
      if (currentFileIndex < totalFiles - 1) {
        setCurrentFileIndex(prev => prev + 1);
      }
    }
  };

  const skip = (skip_count) => {
    if (currentFileIndex < totalFiles - 1) {
        setCurrentFileIndex(prev => prev + skip_count);
    }
  }

  return {
    currentFile,
    currentFileIndex,
    totalFiles,
    labeledFiles,
    handleLabel,
    skip
  };
}