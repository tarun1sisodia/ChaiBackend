import React, { useEffect, useRef } from 'react';
import type { ChaiFile } from '../types';
import { formatBytes, formatDate } from '../utils/format';
import { X, Download, Trash2, Calendar, HardDrive, Info } from 'lucide-react';

interface FileDetailsModalProps {
  file: ChaiFile | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const FileDetailsModal: React.FC<FileDetailsModalProps> = ({ file, onClose, onDelete }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (file) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [file]);

  // Support for light dismiss backdrop clicking fallback (e.g. Safari)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      
      const rect = dialog.getBoundingClientRect();
      const isInside = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );

      if (!isInside) {
        onClose();
      }
    };

    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', handleBackdropClick);
    }
    
    // Listen to native cancel (Esc key)
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener('cancel', handleCancel);

    return () => {
      dialog.removeEventListener('click', handleBackdropClick);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  if (!file) return null;

  const handleClose = () => {
    dialogRef.current?.close();
    onClose();
  };

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');

  return (
    <dialog
      ref={dialogRef}
      className="glass-modal rounded-3xl p-0 w-full max-w-lg overflow-hidden border border-border-custom text-text-main outline-none select-none"
      aria-labelledby="modal-title"
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-custom">
        <h2 id="modal-title" className="text-base font-bold text-text-main flex items-center gap-2">
          <Info className="w-4.5 h-4.5 text-primary" />
          <span>File Properties</span>
        </h2>
        <button
          onClick={handleClose}
          className="p-1.5 hover:bg-bg-main/80 rounded-xl text-text-muted hover:text-text-main transition-all cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Preview Section */}
      <div className="bg-bg-main p-6 flex flex-col items-center justify-center border-b border-border-custom min-h-48">
        {file.dataUrl && isImage ? (
          <img
            src={file.dataUrl}
            alt={file.name}
            className="max-h-56 max-w-full rounded-2xl object-contain shadow-md"
          />
        ) : file.dataUrl && isVideo ? (
          <video
            src={file.dataUrl}
            controls
            className="max-h-56 max-w-full rounded-2xl object-contain shadow-md"
          />
        ) : file.dataUrl && isAudio ? (
          <div className="w-full text-center p-4">
            <div className="w-16 h-16 rounded-2xl bg-accent-light border border-accent-border text-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🎵</span>
            </div>
            <audio src={file.dataUrl} controls className="w-full mt-2" />
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-bg-main border border-border-custom flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-text-muted">📄</span>
            </div>
            <p className="text-xs text-text-muted font-bold">No preview available for this file type</p>
          </div>
        )}
      </div>

      {/* Details Meta list */}
      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-0.5">Filename</label>
          <p className="text-sm font-bold text-text-main break-all">{file.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-0.5 flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-text-muted" />
              <span>Size</span>
            </label>
            <p className="text-sm font-bold text-text-main">{formatBytes(file.size)}</p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-0.5">Mime Type</label>
            <p className="text-sm font-bold text-text-main truncate">{file.type}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-text-muted" />
              <span>Created</span>
            </label>
            <p className="text-xs font-semibold text-text-main">{formatDate(file.createdAt)}</p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-text-muted" />
              <span>Updated</span>
            </label>
            <p className="text-xs font-semibold text-text-main">{formatDate(file.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="px-6 py-4 bg-bg-main/30 border-t border-border-custom flex justify-between gap-4">
        <button
          onClick={() => {
            onDelete(file.id);
            handleClose();
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-red-500 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Move to Trash</span>
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-bg-main border border-border-custom hover:bg-border-custom text-text-main text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
          
          {file.dataUrl && (
            <a
              href={file.dataUrl}
              download={file.name}
              onClick={handleClose}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          )}
        </div>
      </div>
    </dialog>
  );
};
