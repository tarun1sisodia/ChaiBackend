import React from 'react';
import type { ChaiFile, ChaiFolder } from '../types';
import { FileRow } from './FileRow';

interface FileListProps {
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

export const FileList: React.FC<FileListProps> = React.memo(({
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
    <div className="overflow-x-auto rounded-2xl border border-border-custom bg-bg-sidebar shadow-sm">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-border-custom text-text-muted text-xs font-bold uppercase tracking-wider bg-bg-main/30">
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4 w-32">Type</th>
            <th className="px-6 py-4 w-32">Size</th>
            <th className="px-6 py-4 w-48">Modified At</th>
            <th className="px-6 py-4 w-16 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {/* Folders first */}
          {folders.map((folder) => (
            <FileRow
              key={folder.id}
              folder={folder}
              isSelected={selectedFileIds.includes(folder.id)}
              onSelectToggle={onSelectToggle}
              onOpenFolder={onOpenFolder}
              onRenameFolder={onRenameFolder}
            />
          ))}

          {/* Files second */}
          {files.map((file) => (
            <FileRow
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
        </tbody>
      </table>
    </div>
  );
});

FileList.displayName = 'FileList';
