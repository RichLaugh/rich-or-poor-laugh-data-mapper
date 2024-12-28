import React from 'react';
import { AudioPlayer } from './components/AudioPlayer';
import { LabelingControls } from './components/LabelingControls';
import { ProgressBar } from './components/ProgressBar';
import { useAudioLabeling } from './hooks/useAudioLabeling';
import { AudioFile } from './types/audio';

// Mock data - replace with actual API calls
const mockAudioFiles: AudioFile[] = [
  { id: '1', name: 'audio1.mp3', path: '/dataset/audio1.mp3', duration: 120 },
  { id: '2', name: 'audio2.mp3', path: '/dataset/audio2.mp3', duration: 180 },
];

function App() {
  const {
    currentFile,
    currentFileIndex,
    totalFiles,
    labeledFiles,
    handleLabel,
    handleAudioEnd,
  } = useAudioLabeling(mockAudioFiles);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Audio Labeling Tool
          </h1>
          <p className="text-gray-600">
            Listen to each audio file and select the appropriate category
          </p>
        </header>

        <ProgressBar
          current={labeledFiles.size}
          total={totalFiles}
        />

        {currentFile && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Current File: {currentFile.name}
              </h2>
              <p className="text-gray-600">
                File {currentFileIndex + 1} of {totalFiles}
              </p>
            </div>

            <AudioPlayer
              src={currentFile.path}
              onEnded={handleAudioEnd}
            />

            <LabelingControls
              onLabel={handleLabel}
              disabled={false}
            />
          </div>
        )}

        {labeledFiles.size === totalFiles && (
          <div className="text-center p-8 bg-green-100 rounded-lg">
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              All files have been labeled!
            </h2>
            <p className="text-green-700">
              Great job! You've completed the labeling task.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;