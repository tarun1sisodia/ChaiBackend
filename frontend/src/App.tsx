import React, { useState, useMemo, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StorageProvider, useStorage } from './context/StorageContext';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FileGrid } from './components/FileGrid';
import { FileList } from './components/FileList';
import { CreateFolderModal } from './components/CreateFolderModal';
import { UploadProgressToast } from './components/UploadProgressToast';
import { DropOverlay } from './components/DropOverlay';
import type { ChaiFile } from './types';
import { 
  ChevronRight, 
  Home, 
  Folder, 
  Trash2, 
  X, 
  Download, 
  ChevronLeft
} from 'lucide-react';
import { formatBytes, formatDate } from './utils/format';

const MainDashboard: React.FC<{ theme: 'light' | 'dark'; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  const { 
    files, 
    folders, 
    currentFolderId, 
    setCurrentFolderId, 
    viewMode, 
    createFolder, 
    deleteFile, 
    restoreFile,
    deleteFilePermanently,
    renameFile,
    renameFolder,
    uploadFile,
    activeUploads,
    activeCategory 
  } = useStorage();

  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [selectedFileForDetails, setSelectedFileForDetails] = useState<ChaiFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Multi-selection state
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  // Clear selection on route/folder change
  useEffect(() => {
    setSelectedFileIds([]);
  }, [currentFolderId, activeCategory]);

  const handleSelectToggle = (id: string, isCtrlKey: boolean) => {
    setSelectedFileIds(prev => {
      if (isCtrlKey) {
        return prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      } else {
        return prev.includes(id) && prev.length === 1 ? [] : [id];
      }
    });
  };

  // Drag-and-drop listener setup
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (activeCategory !== 'trash') {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (activeCategory === 'trash') return;

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      Array.from(droppedFiles).forEach(file => {
        uploadFile(file);
      });
    }
  };

  // Breadcrumbs calculation
  const breadcrumbs = useMemo(() => {
    const trail: { id: string | null; name: string }[] = [{ id: null, name: 'My Drive' }];
    if (!currentFolderId) return trail;

    let current = folders.find(f => f.id === currentFolderId);
    const path: { id: string | null; name: string }[] = [];
    while (current) {
      path.unshift({ id: current.id, name: current.name });
      const parentId = current.parentId;
      current = parentId ? folders.find(f => f.id === parentId) : undefined;
    }
    return [...trail, ...path];
  }, [folders, currentFolderId]);

  // Rename Dialog handler
  const handleRenameFile = (id: string, currentName: string) => {
    const newName = prompt('Enter new filename:', currentName);
    if (newName && newName.trim() !== '' && newName !== currentName) {
      renameFile(id, newName.trim()).catch(err => alert(err.message));
    }
  };

  const handleRenameFolder = (id: string, currentName: string) => {
    const newName = prompt('Enter new folder name:', currentName);
    if (newName && newName.trim() !== '' && newName !== currentName) {
      renameFolder(id, newName.trim()).catch(err => alert(err.message));
    }
  };

  // Files/Folders resolution
  const currentFoldersList = useMemo(() => {
    if (activeCategory !== 'all') return [];
    return folders.filter(f => f.parentId === currentFolderId);
  }, [folders, currentFolderId, activeCategory]);

  const currentFilesList = useMemo(() => {
    return files.filter(file => {
      if (activeCategory === 'trash') return !!file.isTrash;
      if (file.isTrash) return false;
      if (activeCategory === 'all') return file.folderId === currentFolderId;
      if (activeCategory === 'images') return file.type.startsWith('image/');
      if (activeCategory === 'videos') return file.type.startsWith('video/');
      if (activeCategory === 'audios') return file.type.startsWith('audio/');
      if (activeCategory === 'documents') {
        return (
          file.type.includes('pdf') ||
          file.type.includes('document') ||
          file.type.includes('text') ||
          file.type.includes('presentation') ||
          file.name.endsWith('.pdf') ||
          file.name.endsWith('.docx') ||
          file.name.endsWith('.txt')
        );
      }
      return true;
    });
  }, [files, currentFolderId, activeCategory]);

  // Bulk Selection Operations
  const handleSelectAll = () => {
    const allIds = [
      ...currentFoldersList.map(f => f.id),
      ...currentFilesList.map(f => f.id)
    ];
    if (selectedFileIds.length === allIds.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(allIds);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFileIds.length === 0) return;
    const confirmMsg = activeCategory === 'trash'
      ? `Are you sure you want to permanently delete the ${selectedFileIds.length} selected items?`
      : `Are you sure you want to move the ${selectedFileIds.length} selected items to Trash?`;
      
    if (window.confirm(confirmMsg)) {
      for (const id of selectedFileIds) {
        if (activeCategory === 'trash') {
          await deleteFilePermanently(id);
        } else {
          await deleteFile(id);
        }
      }
      setSelectedFileIds([]);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex h-screen bg-bg-main text-text-main overflow-hidden relative"
    >
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Workspace content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-bg-main">
        <Header onCreateFolderClick={() => setIsCreateFolderOpen(true)} theme={theme} toggleTheme={toggleTheme} />

        {/* Directory details / Breadcrumbs & Viewport */}
        <section className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          
          {/* Action header bar */}
          <div className="flex items-center justify-between">
            {/* Breadcrumbs (My Drive > Subfolders) */}
            {activeCategory === 'all' ? (
              <nav className="flex items-center gap-1 text-xs font-semibold text-text-muted select-none">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-text-muted/40" />}
                    <button
                      onClick={() => setCurrentFolderId(crumb.id)}
                      className={`hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer ${
                        idx === breadcrumbs.length - 1 ? 'text-text-main font-bold' : ''
                      }`}
                    >
                      {idx === 0 ? <Home className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5 text-primary" />}
                      <span>{crumb.name}</span>
                    </button>
                  </React.Fragment>
                ))}
              </nav>
            ) : (
              <div className="flex items-center gap-2 text-sm font-bold text-text-main capitalize select-none">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>{activeCategory} Files</span>
              </div>
            )}

            {/* Selection Status controls */}
            {(currentFilesList.length > 0 || currentFoldersList.length > 0) && (
              <button
                onClick={handleSelectAll}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                {selectedFileIds.length === (currentFilesList.length + currentFoldersList.length) 
                  ? 'Deselect All' 
                  : 'Select All'
                }
              </button>
            )}
          </div>

          {/* Render files (Grid vs List layout) */}
          {viewMode === 'grid' ? (
            <FileGrid
              files={currentFilesList}
              folders={currentFoldersList}
              selectedFileIds={selectedFileIds}
              onSelectToggle={handleSelectToggle}
              onOpenFolder={setCurrentFolderId}
              onFileClick={setSelectedFileForDetails}
              onRenameFile={handleRenameFile}
              onRenameFolder={handleRenameFolder}
              onDeleteFile={deleteFile}
              onRestoreFile={restoreFile}
              onDeletePermanently={deleteFilePermanently}
            />
          ) : (
            <FileList
              files={currentFilesList}
              folders={currentFoldersList}
              selectedFileIds={selectedFileIds}
              onSelectToggle={handleSelectToggle}
              onOpenFolder={setCurrentFolderId}
              onFileClick={setSelectedFileForDetails}
              onRenameFile={handleRenameFile}
              onRenameFolder={handleRenameFolder}
              onDeleteFile={deleteFile}
              onRestoreFile={restoreFile}
              onDeletePermanently={deleteFilePermanently}
            />
          )}
        </section>
      </main>

      {/* Floating Selection Batch Action Bar */}
      {selectedFileIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-bg-sidebar border border-border-custom px-6 py-3 rounded-2xl shadow-xl flex items-center gap-6 z-40 animate-fade-in select-none">
          <span className="text-xs font-bold text-text-main">
            {selectedFileIds.length} item{selectedFileIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="w-px h-4 bg-border-custom"></div>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-500 hover:bg-red-650 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{activeCategory === 'trash' ? 'Delete Forever' : 'Trash Selected'}</span>
            </button>
            <button
              onClick={() => setSelectedFileIds([])}
              className="px-3.5 py-1.5 bg-bg-main border border-border-custom hover:bg-border-custom text-text-main text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modals and toast components */}
      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onSubmit={createFolder}
      />

      {/* Full-screen Immersive Media Preview Overlay */}
      {selectedFileForDetails && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between text-white select-none fullscreen-overlay">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/5">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedFileForDetails(null)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h3 className="text-sm font-bold text-slate-100 break-all">{selectedFileForDetails.name}</h3>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  {formatBytes(selectedFileForDetails.size)} • {selectedFileForDetails.type}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFileForDetails(null)}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Central Immersive Media Node */}
          <div className="flex-1 flex items-center justify-center p-8 bg-black/20">
            {selectedFileForDetails.dataUrl && selectedFileForDetails.type.startsWith('image/') ? (
              <img
                src={selectedFileForDetails.dataUrl}
                alt={selectedFileForDetails.name}
                className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl animate-fade-in"
              />
            ) : selectedFileForDetails.dataUrl && selectedFileForDetails.type.startsWith('video/') ? (
              <video
                src={selectedFileForDetails.dataUrl}
                controls
                autoPlay
                className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl animate-fade-in"
              />
            ) : selectedFileForDetails.dataUrl && selectedFileForDetails.type.startsWith('audio/') ? (
              <div className="w-full max-w-md text-center p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl">
                <div className="w-20 h-20 rounded-3xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🎵</span>
                </div>
                <h4 className="text-base font-bold text-slate-100 truncate mb-4">{selectedFileForDetails.name}</h4>
                <audio src={selectedFileForDetails.dataUrl} controls className="w-full" />
              </div>
            ) : (
              <div className="text-center p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md max-w-md shadow-2xl">
                <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-slate-400">📄</span>
                </div>
                <h4 className="text-base font-bold text-slate-100 truncate mb-2">{selectedFileForDetails.name}</h4>
                <p className="text-xs text-slate-400 font-medium mb-6">No full-screen preview is supported for this file structure.</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setSelectedFileForDetails(null)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Go Back
                  </button>
                  {selectedFileForDetails.dataUrl && (
                    <a
                      href={selectedFileForDetails.dataUrl}
                      download={selectedFileForDetails.name}
                      onClick={() => setSelectedFileForDetails(null)}
                      className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-violet-600/20 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions Footer */}
          <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Uploaded: {formatDate(selectedFileForDetails.createdAt)}</span>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  deleteFile(selectedFileForDetails.id);
                  setSelectedFileForDetails(null);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-red-400 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Move to Trash</span>
              </button>
              {selectedFileForDetails.dataUrl && (
                <a
                  href={selectedFileForDetails.dataUrl}
                  download={selectedFileForDetails.name}
                  onClick={() => setSelectedFileForDetails(null)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <UploadProgressToast tasks={activeUploads} />

      <DropOverlay isDragging={isDragging} />
    </div>
  );
};

const ProtectedAppRoute: React.FC<{ theme: 'light' | 'dark'; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center animate-spin text-white">
          ⏳
        </div>
      </div>
    );
  }

  return user ? <MainDashboard theme={theme} toggleTheme={toggleTheme} /> : <Login theme={theme} toggleTheme={toggleTheme} />;
};

function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('chaidrive_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Startup loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('chaidrive_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Render 3D CSS Cube Loading Splash Screen
  if (appLoading) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center select-none relative font-space">
        {/* Background Visual Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="space-y-10 text-center relative z-10 flex flex-col items-center">
          {/* Animated 3D Cube Graphic */}
          <div className="scene-3d mb-4">
            <div className="cube-3d">
              <div className="cube-face face-front">C</div>
              <div className="cube-face face-back">D</div>
              <div className="cube-face face-right">☁️</div>
              <div className="cube-face face-left">🔐</div>
              <div className="cube-face face-top">⚡</div>
              <div className="cube-face face-bottom">☕</div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400 tracking-tight uppercase">
              ChaiDrive
            </h1>
            <div className="flex flex-col items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-widest pl-1">
              <p>Developer: <span className="text-violet-400 font-black">Antigravity</span></p>
              <p>Owner: <span className="text-indigo-400 font-black">Tarun</span></p>
            </div>
          </div>

          {/* Simple horizontal progress bar */}
          <div className="w-56 h-1 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full animate-[loadingProgress_3s_ease-out_forwards]"></div>
          </div>
        </div>

        {/* Custom CSS Animation Injector for progress bar */}
        <style>{`
          @keyframes loadingProgress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthProvider>
      <StorageProvider>
        <ProtectedAppRoute theme={theme} toggleTheme={toggleTheme} />
      </StorageProvider>
    </AuthProvider>
  );
}

export default App;
