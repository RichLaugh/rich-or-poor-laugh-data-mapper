import React from 'react';
import { AudioPlayer } from './components/AudioPlayer';
import { LabelingControls } from './components/LabelingControls';
import { ProgressBar } from './components/ProgressBar';
import { useAudioLabeling } from './hooks/useAudioLabeling';
import { AudioFile } from './types/audio';
import { AuthGuard } from './components/AuthGuard';
import { useAuth } from './hooks/useAuth';

// Mock data - replace with actual API calls
const mockAudioFiles: AudioFile[] = [
  { id: '1', name: 'audio1.mp3', path: '/dataset/audio1.mp3', duration: 120 },
  { id: '2', name: 'audio2.mp3', path: '/dataset/audio2.mp3', duration: 180 },
  { id: '3', name: 'audio3.mp3', path: '/dataset/audio3.mp3', duration: 160 },
];

function App() {
  const [audioFiles, setAudioFiles] = React.useState<AudioFile[]>([]);
  const { user, logout, token } = useAuth();

  React.useEffect(() => {
    fetch('http://localhost:8000/audio-list', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при загрузке списка аудио');
        }
        return response.json();
      })
      .then((data: AudioFile[]) => {
        setAudioFiles(data);
      })
      .catch(error => {
        console.error('Ошибка загрузки /audio-list:', error);
      });
  }, [token]);

  const {
    currentFile,
    currentFileIndex,
    totalFiles,
    labeledFiles,
    handleLabel,
    handleAudioEnd,
  } = useAudioLabeling(audioFiles);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-blue-200 px-4">
        <div className="max-w-4xl mx-auto">

          <div className="flex items-center space-x-4 py-1 justify-end">
            {user && <span className="text-gray-600">Welcome, {user.username}</span>}
            <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
              Logout
            </button>
          </div>

          <header className="text-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Audio Labeling Tool
              </h1>
              <p className="text-gray-600">
                Listen to each audio file and select the appropriate category
              </p>
            </div>
          </header>

          <ProgressBar
              current={labeledFiles.size}
              total={totalFiles}
          />

          {currentFile && (
              <div className="bg-white rounded-lg shadow-2xl p-6 mb-6 bg-gray-200">
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
    </AuthGuard>
  );
}

export default App;