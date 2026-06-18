export interface ChaiFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string; // Base64 data url for downloads / mock representation
  folderId: string | null; // null represents root folder
  createdAt: string;
  updatedAt: string;
  isTrash?: boolean;
}

export interface ChaiFolder {
  id: string;
  name: string;
  parentId: string | null; // null represents root folder
  createdAt: string;
}

export interface UploadTask {
  id: string;
  fileName: string;
  progress: number; // 0 to 100
  status: 'uploading' | 'completed' | 'error' | 'queued'; // added 'queued' for offline waiting status
  errorMsg?: string;
}

export interface QueuedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  fileObj?: File; // in-memory file instance
  folderId: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  token?: string; // JWT token
}

export interface FontOption {
  id: string;
  name: string;
  className: string;
}
