import {useState, useEffect} from 'react';
import {AudioPlayer} from './components/AudioPlayer';
import {LabelingControls} from './components/LabelingControls';
import {ProgressBar} from './components/ProgressBar';
import {useAudioLabeling} from './hooks/useAudioLabeling';
import {AudioFile} from './types/audio';
import {AuthGuard} from './components/AuthGuard';
import {useAuth} from './hooks/useAuth';
import Select from 'react-select';
function App() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { user, logout, token } = useAuth();

  const fetchCategories = async () => {
    const response = await fetch(`${import.meta.env.VITE_APP_HOST}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  };

  const fetchAudios = async (category) => {
    const url = category
        ? `${import.meta.env.VITE_APP_HOST}/audio/audio-list?category=${category}`
        : `${import.meta.env.VITE_APP_HOST}/audio/audio-list`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch audios');
    return await response.json();
  };
  const categoryOptions = categories.map((category) => ({
      value: category.name,
      label: category.label,
    }));
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadCategories();
    fetch(`${import.meta.env.VITE_APP_HOST}/audio/audio-list`, {
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
  useEffect(() => {
    console.log('App user from useAuth hook changed:', user);
  }, [user]);
  return (
    <AuthGuard>
      <div className="min-h-screen bg-blue-200 px-4">
        <div className="max-w-4xl mx-auto">
          <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categoryOptions}
                placeholder="Выберите категорию"
                isClearable
              />
          <div className="flex items-center space-x-4 py-1 justify-end">
            <span className="text-gray-600">Welcome, {user?.username}</span>
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
                src={currentFile.url}
                onEnded={handleAudioEnd}
              />

              <LabelingControls
                categories={categories}
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