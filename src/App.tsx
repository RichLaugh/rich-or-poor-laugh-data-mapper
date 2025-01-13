import {useState, useEffect, useMemo} from 'react';
import {AudioPlayer} from './components/AudioPlayer';
import {LabelingControls} from './components/LabelingControls';
import {ProgressBar} from './components/ProgressBar';
import {useAudioLabeling} from './hooks/useAudioLabeling';
import {AudioFile} from './types/audio';
import {AuthGuard} from './components/AuthGuard';
import {useAuth} from './hooks/useAuth';
import Select from 'react-select';
import {getAudioList, getCategories} from "./services/audio.ts";
function App() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { user, loading, login, register, logout } = useAuth();
  const {
    currentFile,
    currentFileIndex,
    totalFiles,
    labeledFiles,
    handleLabel,
    handleAudioEnd,
    skip
  } = useAudioLabeling(audioFiles);

  const categoryOptions = useMemo(() => categories.map((category) => ({
      value: category.name,
      label: category.label,
    })), [categories]);
  const loadAudioList = async () => {
    let audioList = await getAudioList(selectedCategory?.value);
    setAudioFiles(audioList)
  }
  useEffect(() => {
    loadAudioList();
  }, [selectedCategory]);

  useEffect(() => {
    const loadCategories = async () => {
      let categoriesLoaded = await getCategories();
      setCategories(categoriesLoaded)
    }
    loadCategories();
  }, [currentFile]);

  return (
    <AuthGuard user={user} loading={loading} login={login} register={register}>
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
              current={currentFileIndex}
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
                skip={skip}
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
            <div className="text-center p-8 bg-white rounded-lg">
              <h2 className="text-2xl font-bold text-black-800 mb-2">
                No files here for labeling!
              </h2>
              <p className="text-green-700">
                Select another category
              </p>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

export default App;