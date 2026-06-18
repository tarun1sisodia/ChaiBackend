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

interface FileCardProps {
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
  if (mimeType.startsWith('image/') || nameLower.endsWith('.jpg') || nameLower.endsWith('.jpeg') || nameLower.endsWith('.png') || nameLower.endsWith('.webp')) {
    return { icon: ImageIcon, color: 'text-purple-500 dark:text-purple-400 bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/15' };
  }
  if (mimeType.startsWith('video/') || nameLower.endsWith('.mp4') || nameLower.endsWith('.mkv') || nameLower.endsWith('.mov')) {
    return { icon: FileVideo, color: 'text-indigo-500 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/15' };
  }
  if (mimeType.startsWith('audio/') || nameLower.endsWith('.mp3') || nameLower.endsWith('.wav') || nameLower.endsWith('.aac')) {
    return { icon: FileAudio, color: 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/15' };
  }
  if (mimeType.includes('pdf') || nameLower.endsWith('.pdf')) {
    return { icon: FileText, color: 'text-red-500 dark:text-red-400 bg-red-500/5 dark:bg-red-500/10 border-red-500/15' };
  }
  if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('gzip') || nameLower.endsWith('.zip') || nameLower.endsWith('.rar') || nameLower.endsWith('.tar.gz')) {
    return { icon: FileArchive, color: 'text-amber-500 dark:text-amber-400 bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/15' };
  }
  return { icon: File, color: 'text-slate-500 dark:text-slate-400 bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/15' };
};

export const FileCard: React.FC<FileCardProps> = React.memo(({
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
  const menuRef = React.useRef<HTMLDivElement>(null);

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
      <div 
        onDoubleClick={() => onOpenFolder?.(folderId)}
        onClick={(e) => {
          onSelectToggle?.(folderId, e.ctrlKey || e.metaKey);
        }}
        className={`group relative glass border p-4 rounded-2xl flex flex-col justify-between hover:bg-bg-sidebar/85 active:scale-[0.99] select-none cursor-pointer transition-all duration-150 ${
          isSelected 
            ? 'border-primary ring-1 ring-primary bg-primary/[0.03]' 
            : 'border-border-custom hover:border-primary/40'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {/* Selection Checkbox */}
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

            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary shrink-0">
              <Folder className="w-5 h-5 fill-primary/10" />
            </div>
          </div>
          
          {/* Options Menu */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 text-text-muted hover:text-text-main rounded-lg hover:bg-bg-main/60 cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-36 rounded-xl bg-bg-sidebar border border-border-custom shadow-xl py-1 z-30 animate-fade-in text-left">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRenameFolder?.(folderId, folder.name);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-text-main hover:text-primary hover:bg-bg-main/60"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Rename</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-bold text-text-main truncate group-hover:text-primary transition-colors" title={folder.name}>
            {folder.name}
          </h3>
          <span className="text-[10px] text-text-muted font-bold block mt-1">
            Folder
          </span>
        </div>
      </div>
    );
  }

  // File UI Item
  if (file) {
    const fileId = file.id;
    const { icon: Icon, color: iconColors } = getFileIcon(file.type, file.name);
    
    return (
      <div 
        onDoubleClick={() => !file.isTrash && onFileClick?.(file)}
        onClick={(e) => {
          onSelectToggle?.(fileId, e.ctrlKey || e.metaKey);
        }}
        className={`group relative glass border p-4 rounded-2xl flex flex-col justify-between hover:bg-bg-sidebar/85 active:scale-[0.99] select-none cursor-pointer transition-all duration-150 ${
          isSelected 
            ? 'border-primary ring-1 ring-primary bg-primary/[0.03]' 
            : 'border-border-custom hover:border-primary/40'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {/* Selection Checkbox */}
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

            {/* Icon/Thumb */}
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${iconColors}`}>
              {file.dataUrl && file.type.startsWith('image/') ? (
                <img 
                  src={file.dataUrl} 
                  alt={file.name} 
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>
          </div>

          {/* Options Menu */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 text-text-muted hover:text-text-main rounded-lg hover:bg-bg-main/60 cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl bg-bg-sidebar border border-border-custom shadow-xl py-1 z-30 animate-fade-in text-left">
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
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-bold text-text-main truncate group-hover:text-primary transition-colors" title={file.name}>
            {file.name}
          </h3>
          <div className="flex items-center justify-between mt-1 text-[10px] text-text-muted font-bold">
            <span>{formatBytes(file.size)}</span>
            <span>{formatDate(file.createdAt).split(',')[0]}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
});

FileCard.displayName = 'FileCard';
