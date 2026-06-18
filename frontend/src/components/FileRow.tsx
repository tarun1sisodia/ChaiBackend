import React from 'react';
import type { ChaiFile, ChaiFolder } from '../types';
import { formatBytes, formatDate } from '../utils/format';
import { 
  Folder, 
  File, 
  FileText, 
  FileVideo, 
  FileAudio, 
  Image as ImageIcon, 
  FileArchive, 
  MoreVertical,
  Download,
  Trash2,
  RotateCcw,
  Edit2
} from 'lucide-react';

interface FileRowProps {
  file?: ChaiFile;
  folder?: ChaiFolder;
  isSelected?: boolean;
  onSelectToggle?: (id: string, isCtrlKey: boolean) => void;
  onOpenFolder?: (id: string) => void;
  onFileClick?: (file: ChaiFile) => void;
  onRenameFile?: (id: string, currentName: string) => void;
  onRenameFolder?: (id: string, currentName: string) => void;
  onDeleteFile?: (id: string) => void;
  onRestoreFile?: (id: string) => void;
  onDeletePermanently?: (id: string) => void;
}

const getFileIcon = (mimeType: string, fileName: string) => {
  const nameLower = fileName.toLowerCase();
  if (mimeType.startsWith('image/') || nameLower.endsWith('.jpg') || nameLower.endsWith('.jpeg') || nameLower.endsWith('.png')) {
    return ImageIcon;
  }
  if (mimeType.startsWith('video/') || nameLower.endsWith('.mp4') || nameLower.endsWith('.mkv')) {
    return FileVideo;
  }
  if (mimeType.startsWith('audio/') || nameLower.endsWith('.mp3') || nameLower.endsWith('.wav')) {
    return FileAudio;
  }
  if (mimeType.includes('pdf') || nameLower.endsWith('.pdf')) {
    return FileText;
  }
  if (mimeType.includes('zip') || nameLower.endsWith('.zip') || nameLower.endsWith('.rar')) {
    return FileArchive;
  }
  return File;
};

export const FileRow: React.FC<FileRowProps> = React.memo(({
  file,
  folder,
  isSelected = false,
  onSelectToggle,
  onOpenFolder,
  onFileClick,
  onRenameFile,
  onRenameFolder,
  onDeleteFile,
  onRestoreFile,
  onDeletePermanently
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLTableCellElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Folder UI Item
  if (folder) {
    const folderId = folder.id;
    return (
      <tr 
        onDoubleClick={() => onOpenFolder?.(folderId)}
        onClick={(e) => {
          onSelectToggle?.(folderId, e.ctrlKey || e.metaKey);
        }}
        className={`group border-b border-border-custom/80 transition-all select-none cursor-pointer ${
          isSelected 
            ? 'bg-primary/[0.03] hover:bg-primary/[0.05]' 
            : 'hover:bg-bg-main/60'
        }`}
      >
        <td className="px-6 py-4 flex items-center gap-3">
          {/* Checkbox */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onSelectToggle?.(folderId, true);
            }}
            className="p-1 hover:bg-bg-main rounded-md border border-border-custom mr-1 shrink-0"
          >
            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
              isSelected 
                ? 'bg-primary border-primary text-white' 
                : 'border-text-muted/40 hover:border-primary'
            }`}>
              {isSelected && <span className="text-[9px] font-black leading-none">✓</span>}
            </div>
          </div>

          <Folder className="w-5 h-5 text-primary shrink-0 fill-primary/10" />
          <span className="text-sm font-bold text-text-main group-hover:text-primary truncate max-w-md" title={folder.name}>
            {folder.name}
          </span>
        </td>
        <td className="px-6 py-4 text-xs font-bold text-text-muted">Folder</td>
        <td className="px-6 py-4 text-xs font-bold text-text-muted">--</td>
        <td className="px-6 py-4 text-xs font-semibold text-text-muted">{formatDate(folder.createdAt)}</td>
        
        {/* Actions Menu */}
        <td className="px-6 py-4 text-right relative" ref={menuRef}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1.5 text-text-muted hover:text-text-main rounded-lg hover:bg-bg-main/80 cursor-pointer transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {menuOpen && (
            <div className="absolute right-6 mt-1 w-36 rounded-xl bg-bg-sidebar border border-border-custom shadow-xl py-1 z-30 animate-fade-in text-left">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRenameFolder?.(folderId, folder.name);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-text-main hover:text-primary hover:bg-bg-main/60 transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Rename</span>
              </button>
            </div>
          )}
        </td>
      </tr>
    );
  }

  // File UI Item
  if (file) {
    const fileId = file.id;
    const Icon = getFileIcon(file.type, file.name);
    
    return (
      <tr 
        onDoubleClick={() => !file.isTrash && onFileClick?.(file)}
        onClick={(e) => {
          onSelectToggle?.(fileId, e.ctrlKey || e.metaKey);
        }}
        className={`group border-b border-border-custom/80 transition-all select-none cursor-pointer ${
          isSelected 
            ? 'bg-primary/[0.03] hover:bg-primary/[0.05]' 
            : 'hover:bg-bg-main/60'
        }`}
      >
        <td className="px-6 py-4 flex items-center gap-3">
          {/* Checkbox */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onSelectToggle?.(fileId, true);
            }}
            className="p-1 hover:bg-bg-main rounded-md border border-border-custom mr-1 shrink-0"
          >
            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
              isSelected 
                ? 'bg-primary border-primary text-white' 
                : 'border-text-muted/40 hover:border-primary'
            }`}>
              {isSelected && <span className="text-[9px] font-black leading-none">✓</span>}
            </div>
          </div>

          <Icon className="w-5 h-5 text-text-muted group-hover:text-primary shrink-0" />
          <span className="text-sm font-bold text-text-main group-hover:text-primary truncate max-w-md" title={file.name}>
            {file.name}
          </span>
        </td>
        <td className="px-6 py-4 text-xs font-bold text-text-muted">{file.type.split('/')[1]?.toUpperCase() || 'FILE'}</td>
        <td className="px-6 py-4 text-xs font-bold text-text-main">{formatBytes(file.size)}</td>
        <td className="px-6 py-4 text-xs font-semibold text-text-muted">{formatDate(file.createdAt)}</td>

        {/* Actions Menu */}
        <td className="px-6 py-4 text-right relative" ref={menuRef}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1.5 text-text-muted hover:text-text-main rounded-lg hover:bg-bg-main/80 cursor-pointer transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {menuOpen && (
            <div className="absolute right-6 mt-1 w-44 rounded-xl bg-bg-sidebar border border-border-custom shadow-xl py-1 z-30 animate-fade-in text-left">
              {file.isTrash ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestoreFile?.(fileId);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-text-main hover:text-emerald-500 hover:bg-bg-main/60"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Restore</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePermanently?.(fileId);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Forever</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileClick?.(file);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-text-main hover:text-primary hover:bg-bg-main/60"
                  >
                    <File className="w-3.5 h-3.5" />
                    <span>Preview Details</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRenameFile?.(fileId, file.name);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-text-main hover:text-primary hover:bg-bg-main/60"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Rename</span>
                  </button>
                  {file.dataUrl && (
                    <a
                      href={file.dataUrl}
                      download={file.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-text-main hover:text-primary hover:bg-bg-main/60"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile?.(fileId);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Move to Trash</span>
                  </button>
                </>
              )}
            </div>
          )}
        </td>
      </tr>
    );
  }

  return null;
});

FileRow.displayName = 'FileRow';
