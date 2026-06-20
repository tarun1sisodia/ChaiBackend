import React from 'react';
import type { ChaiFile, ChaiFolder } from '../types';
import { FileCard } from './FileCard';

interface FileGridProps {
  files: ChaiFile[];
  folders: ChaiFolder[];
  selectedFileIds: string[];
  onSelectToggle: (id: string, isCtrlKey: boolean) => void;
  onOpenFolder: (id: string) => void;
  onFileClick: (file: ChaiFile) => void;
  onRenameFile: (id: string, currentName: string) => void;
  onRenameFolder: (id: string, currentName: string) => void;
  onDeleteFile: (id: string) => void;
  onRestoreFile: (id: string) => void;
  onDeletePermanently: (id: string) => void;
}

export const FileGrid: React.FC<FileGridProps> = React.memo(({
  files,
  folders,
  selectedFileIds,
  onSelectToggle,
  onOpenFolder,
  onFileClick,
  onRenameFile,
  onRenameFolder,
  onDeleteFile,
  onRestoreFile,
  onDeletePermanently
}) => {
  const hasFolders = folders.length > 0;
  const hasFiles = files.length > 0;

  if (!hasFolders && !hasFiles) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted">
        <p className="text-sm font-bold">No folders or files found in this directory</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Folders Section */}
      {hasFolders && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4 pl-1">Folders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {folders.map((folder) => (
              <FileCard
                key={folder.id}
                folder={folder}
                isSelected={selectedFileIds.includes(folder.id)}
                onSelectToggle={onSelectToggle}
                onOpenFolder={onOpenFolder}
                onRenameFolder={onRenameFolder}
              />
            ))}
          </div>
        </div>
      )}

      {/* Files Section */}
      {hasFiles && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4 pl-1">Files</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                isSelected={selectedFileIds.includes(file.id)}
                onSelectToggle={onSelectToggle}
                onFileClick={onFileClick}
                onRenameFile={onRenameFile}
                onDeleteFile={onDeleteFile}
                onRestoreFile={onRestoreFile}
                onDeletePermanently={onDeletePermanently}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

FileGrid.displayName = 'FileGrid';
