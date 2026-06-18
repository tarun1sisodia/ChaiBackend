import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ChaiFile, ChaiFolder, UploadTask, QueuedFile } from '../types';
import { useAuth } from './AuthContext';

interface StorageContextType {
  files: ChaiFile[];
  folders: ChaiFolder[];
  activeUploads: UploadTask[];
  currentFolderId: string | null;
  searchQuery: string;
  activeCategory: string; // 'all' | 'images' | 'documents' | 'videos' | 'audios' | 'trash'
  viewMode: 'grid' | 'list';
  error: string | null;
  isOnline: boolean;
  offlineQueue: QueuedFile[];
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setCurrentFolderId: (id: string | null) => void;
  createFolder: (name: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  restoreFile: (id: string) => Promise<void>;
  deleteFilePermanently: (id: string) => Promise<void>;
  uploadFile: (file: File) => Promise<void>;
  renameFile: (id: string, newName: string) => Promise<void>;
  renameFolder: (id: string, newName: string) => Promise<void>;
  clearError: () => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

const SEED_FOLDERS: ChaiFolder[] = [
  { id: 'f-1', name: 'Work Documents', parentId: null, createdAt: new Date(Date.now() - 50 * 3600000).toISOString() },
  { id: 'f-2', name: 'Personal Photos', parentId: null, createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: 'f-3', name: 'System Backups', parentId: null, createdAt: new Date(Date.now() - 120 * 3600000).toISOString() },
];

const SEED_FILES: ChaiFile[] = [
  { id: 'fi-1', name: 'Invoice_June2026.pdf', size: 42500, type: 'application/pdf', folderId: 'f-1', createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), updatedAt: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: 'fi-2', name: 'Project_Specification.docx', size: 120400, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', folderId: 'f-1', createdAt: new Date(Date.now() - 10 * 3600000).toISOString(), updatedAt: new Date(Date.now() - 10 * 3600000).toISOString() },
  { id: 'fi-3', name: 'Vacation_Selfie.jpg', size: 852100, type: 'image/jpeg', folderId: 'f-2', createdAt: new Date(Date.now() - 20 * 3600000).toISOString(), updatedAt: new Date(Date.now() - 20 * 3600000).toISOString() },
  { id: 'fi-4', name: 'Podcast_Episode_1.mp3', size: 8421000, type: 'audio/mpeg', folderId: null, createdAt: new Date(Date.now() - 12 * 3600000).toISOString(), updatedAt: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: 'fi-5', name: 'Intro_Demo.mp4', size: 15240000, type: 'video/mp4', folderId: null, createdAt: new Date(Date.now() - 30 * 3600000).toISOString(), updatedAt: new Date(Date.now() - 30 * 3600000).toISOString() },
  { id: 'fi-6', name: 'Chai_Recipe.txt', size: 154, type: 'text/plain', folderId: null, createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), updatedAt: new Date(Date.now() - 2 * 3600000).toISOString() },
];

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, authFetch } = useAuth();
  
  const [files, setFiles] = useState<ChaiFile[]>([]);
  const [folders, setFolders] = useState<ChaiFolder[]>([]);
  const [activeUploads, setActiveUploads] = useState<UploadTask[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);

  // Network offline/online status tracking
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<QueuedFile[]>([]);

  // Clear errors helper
  const clearError = () => setError(null);

  // Sync to local storage
  const syncToLocalStorage = (newFiles: ChaiFile[], newFolders: ChaiFolder[]) => {
    if (!user) return;
    const userPrefix = `chaidrive_${user.id}`;
    localStorage.setItem(`${userPrefix}_files`, JSON.stringify(newFiles));
    localStorage.setItem(`${userPrefix}_folders`, JSON.stringify(newFolders));
  };

  const syncQueueToLocalStorage = (newQueue: QueuedFile[]) => {
    if (!user) return;
    const userPrefix = `chaidrive_${user.id}`;
    localStorage.setItem(`${userPrefix}_offline_queue`, JSON.stringify(newQueue));
  };

  // Monitor network status change
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load from local storage or seed
  useEffect(() => {
    if (!user) return;
    
    // User-specific prefix to isolate localStorage keys
    const userPrefix = `chaidrive_${user.id}`;
    const storedFiles = localStorage.getItem(`${userPrefix}_files`);
    const storedFolders = localStorage.getItem(`${userPrefix}_folders`);
    const storedQueue = localStorage.getItem(`${userPrefix}_offline_queue`);

    if (storedFiles && storedFolders) {
      setFiles(JSON.parse(storedFiles));
      setFolders(JSON.parse(storedFolders));
    } else {
      // Seed initial data
      setFiles(SEED_FILES);
      setFolders(SEED_FOLDERS);
      localStorage.setItem(`${userPrefix}_files`, JSON.stringify(SEED_FILES));
      localStorage.setItem(`${userPrefix}_folders`, JSON.stringify(SEED_FOLDERS));
    }

    if (storedQueue) {
      setOfflineQueue(JSON.parse(storedQueue));
    } else {
      setOfflineQueue([]);
    }
  }, [user]);

  // Network Sync: Process offline queue when online and user is authorized
  useEffect(() => {
    if (isOnline && user && offlineQueue.length > 0) {
      const processQueue = async () => {
        const queueToProcess = [...offlineQueue];
        
        for (const item of queueToProcess) {
          if (!user.token) continue; // Requires token validation
          
          const taskId = 't-queued-' + item.id;
          
          // Transition state in active list
          setActiveUploads(prev => 
            prev.map(t => t.id === taskId ? { ...t, status: 'uploading', errorMsg: undefined } : t)
          );
          
          try {
            let uploadedFile: ChaiFile | null = null;
            
            // Reconstruct file data
            try {
              const formData = new FormData();
              let fileToUpload: File | Blob;
              
              if (item.fileObj) {
                fileToUpload = item.fileObj;
              } else if (item.dataUrl) {
                const res = await fetch(item.dataUrl);
                const blob = await res.blob();
                fileToUpload = new File([blob], item.name, { type: item.type });
              } else {
                fileToUpload = new Blob(['Recovered payload'], { type: item.type });
              }
              
              formData.append('file', fileToUpload);
              if (item.folderId) {
                formData.append('folderId', item.folderId);
              }
              
              const response = await authFetch('/api/upload-file', {
                method: 'POST',
                body: formData,
              });
              if (response.ok) {
                uploadedFile = await response.json();
              }
            } catch (err) {
              console.warn('Backend offline on sync recovery, executing simulated upload', err);
            }
            
            // Progress animation
            for (let i = 1; i <= 5; i++) {
              await new Promise(resolve => setTimeout(resolve, 150));
              setActiveUploads(prev => 
                prev.map(t => t.id === taskId ? { ...t, progress: i * 20 } : t)
              );
            }

            // Create new file meta
            const newFile: ChaiFile = uploadedFile || {
              id: 'fi-' + Date.now(),
              name: item.name,
              size: item.size,
              type: item.type,
              dataUrl: item.dataUrl || undefined,
              folderId: item.folderId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            setFiles(prev => {
              const updated = [newFile, ...prev];
              syncToLocalStorage(updated, folders);
              return updated;
            });

            // Set progress status
            setActiveUploads(prev => 
              prev.map(t => t.id === taskId ? { ...t, status: 'completed', progress: 100 } : t)
            );
            
            // Clean up queue list
            setOfflineQueue(prev => {
              const updated = prev.filter(q => q.id !== item.id);
              syncQueueToLocalStorage(updated);
              return updated;
            });

            setTimeout(() => {
              setActiveUploads(prev => prev.filter(t => t.id !== taskId));
            }, 5000);
            
          } catch (err: any) {
            setActiveUploads(prev => 
              prev.map(t => t.id === taskId ? { ...t, status: 'error', errorMsg: err.message || 'Queued upload failed' } : t)
            );
          }
        }
      };

      processQueue();
    }
  }, [isOnline, user, offlineQueue]);

  // Create folder operation
  const createFolder = async (name: string) => {
    try {
      if (!name.trim()) throw new Error('Folder name cannot be empty');
      
      // Template for backend request
      try {
        const response = await authFetch('/api/folders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, parentId: currentFolderId }),
        });
        if (response.ok) {
          const newFolderFromServer = await response.json();
          const updatedFolders = [...folders, newFolderFromServer];
          setFolders(updatedFolders);
          syncToLocalStorage(files, updatedFolders);
          return;
        }
      } catch (err) {
        console.warn('Backend API unavailable. Executing local mock operation.', err);
      }

      // Mock Local Fallback
      const newFolder: ChaiFolder = {
        id: 'f-' + Date.now(),
        name,
        parentId: currentFolderId,
        createdAt: new Date().toISOString(),
      };

      const updatedFolders = [...folders, newFolder];
      setFolders(updatedFolders);
      syncToLocalStorage(files, updatedFolders);
    } catch (err: any) {
      setError(err.message || 'Failed to create folder');
      throw err;
    }
  };

  // Move to trash / Delete file
  const deleteFile = async (id: string) => {
    try {
      try {
        const response = await authFetch(`/api/files/${id}/trash`, {
          method: 'PATCH',
        });
        if (response.ok) { /* sync */ }
      } catch (err) {
        console.warn('Backend API unavailable. Mocking delete.', err);
      }

      const updatedFiles = files.map(file => 
        file.id === id ? { ...file, isTrash: true } : file
      );
      setFiles(updatedFiles);
      syncToLocalStorage(updatedFiles, folders);
    } catch (err: any) {
      setError(err.message || 'Failed to delete file');
    }
  };

  // Restore file from trash
  const restoreFile = async (id: string) => {
    try {
      try {
        const response = await authFetch(`/api/files/${id}/restore`, {
          method: 'PATCH',
        });
        if (response.ok) { /* sync */ }
      } catch (err) {
        console.warn('Backend API unavailable. Mocking restore.', err);
      }

      const updatedFiles = files.map(file => 
        file.id === id ? { ...file, isTrash: false } : file
      );
      setFiles(updatedFiles);
      syncToLocalStorage(updatedFiles, folders);
    } catch (err: any) {
      setError(err.message || 'Failed to restore file');
    }
  };

  // Delete file permanently
  const deleteFilePermanently = async (id: string) => {
    try {
      try {
        const response = await authFetch(`/api/files/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) { /* sync */ }
      } catch (err) {
        console.warn('Backend API unavailable. Mocking permanent deletion.', err);
      }

      const updatedFiles = files.filter(file => file.id !== id);
      setFiles(updatedFiles);
      syncToLocalStorage(updatedFiles, folders);
    } catch (err: any) {
      setError(err.message || 'Failed to permanently delete file');
    }
  };

  // Rename File
  const renameFile = async (id: string, newName: string) => {
    try {
      if (!newName.trim()) throw new Error('File name cannot be empty');
      
      try {
        const response = await authFetch(`/api/files/${id}/rename`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName }),
        });
        if (response.ok) { /* sync */ }
      } catch (err) {
        console.warn('Backend API unavailable. Mocking file rename.', err);
      }

      const updatedFiles = files.map(file => 
        file.id === id ? { ...file, name: newName, updatedAt: new Date().toISOString() } : file
      );
      setFiles(updatedFiles);
      syncToLocalStorage(updatedFiles, folders);
    } catch (err: any) {
      setError(err.message || 'Failed to rename file');
      throw err;
    }
  };

  // Rename Folder
  const renameFolder = async (id: string, newName: string) => {
    try {
      if (!newName.trim()) throw new Error('Folder name cannot be empty');

      try {
        const response = await authFetch(`/api/folders/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName }),
        });
        if (response.ok) { /* sync */ }
      } catch (err) {
        console.warn('Backend API unavailable. Mocking folder rename.', err);
      }

      const updatedFolders = folders.map(f => 
        f.id === id ? { ...f, name: newName } : f
      );
      setFolders(updatedFolders);
      syncToLocalStorage(files, updatedFolders);
    } catch (err: any) {
      setError(err.message || 'Failed to rename folder');
      throw err;
    }
  };

  // Upload file handler with offline queueing support
  const uploadFile = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      if (file.size < 4000000) { 
        reader.readAsDataURL(file);
      } else {
        resolve('');
      }
    });

    if (!isOnline) {
      // Offline mode: Queue file
      const queuedItem: QueuedFile = {
        id: 'q-' + Date.now(),
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        dataUrl: dataUrl || undefined,
        fileObj: file, // Keep file references in memory
        folderId: currentFolderId,
        createdAt: new Date().toISOString()
      };

      setOfflineQueue(prev => {
        const updated = [...prev, queuedItem];
        syncQueueToLocalStorage(updated);
        return updated;
      });

      // Add to tasks list as 'queued'
      const newTask: UploadTask = {
        id: 't-queued-' + queuedItem.id,
        fileName: file.name,
        progress: 0,
        status: 'queued',
        errorMsg: 'Waiting for internet connection...'
      };
      
      setActiveUploads(prev => [newTask, ...prev]);
      return;
    }

    // Standard online upload workflow
    const taskId = 't-' + Date.now();
    const newTask: UploadTask = {
      id: taskId,
      fileName: file.name,
      progress: 0,
      status: 'uploading'
    };

    setActiveUploads(prev => [newTask, ...prev]);

    try {
      let uploadedFile: ChaiFile | null = null;
      try {
        const formData = new FormData();
        formData.append('file', file);
        if (currentFolderId) {
          formData.append('folderId', currentFolderId);
        }

        const response = await authFetch('/api/upload-file', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          uploadedFile = await response.json();
        }
      } catch (err) {
        console.warn('Backend API unavailable or error during upload. Simulating upload.', err);
      }

      // Progress animation
      const duration = Math.min(2000, Math.max(800, file.size / 60000));
      const steps = 10;
      const intervalTime = duration / steps;
      
      for (let i = 1; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, intervalTime));
        setActiveUploads(prev => 
          prev.map(t => t.id === taskId ? { ...t, progress: (i / steps) * 100 } : t)
        );
      }

      setActiveUploads(prev => 
        prev.map(t => t.id === taskId ? { ...t, status: 'completed', progress: 100 } : t)
      );

      const newFile: ChaiFile = uploadedFile || {
        id: 'fi-' + Date.now(),
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        dataUrl: dataUrl || undefined,
        folderId: currentFolderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setFiles(prev => {
        const updated = [newFile, ...prev];
        syncToLocalStorage(updated, folders);
        return updated;
      });

      setTimeout(() => {
        setActiveUploads(prev => prev.filter(t => t.id !== taskId));
      }, 5000);

    } catch (err: any) {
      setActiveUploads(prev => 
        prev.map(t => t.id === taskId ? { ...t, status: 'error', errorMsg: err.message || 'Upload failed' } : t)
      );
      setError(err.message || 'Upload failed');
    }
  };

  return (
    <StorageContext.Provider value={{
      files,
      folders,
      activeUploads,
      currentFolderId,
      searchQuery,
      activeCategory,
      viewMode,
      error,
      isOnline,
      offlineQueue,
      setSearchQuery,
      setActiveCategory,
      setViewMode,
      setCurrentFolderId,
      createFolder,
      deleteFile,
      restoreFile,
      deleteFilePermanently,
      uploadFile,
      renameFile,
      renameFolder,
      clearError
    }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};
