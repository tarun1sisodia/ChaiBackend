import React, { useEffect, useRef, useState } from 'react';
import { FolderPlus, X } from 'lucide-react';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [folderName, setFolderName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      setFolderName('');
      setErrorMsg(null);
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!folderName.trim()) {
      setErrorMsg('Folder name is required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(folderName.trim());
      dialogRef.current?.close();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="glass-modal rounded-3xl p-0 w-full max-w-sm overflow-hidden border border-border-custom text-text-main outline-none select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-custom">
        <h2 className="text-base font-bold text-text-main flex items-center gap-2">
          <FolderPlus className="w-4.5 h-4.5 text-primary" />
          <span>New Folder</span>
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-bg-main/85 rounded-xl text-text-muted hover:text-text-main transition-all cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {errorMsg && (
          <div className="text-red-500 text-xs font-semibold pl-1">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-0.5">Folder Name</label>
          <input
            type="text"
            required
            autoFocus
            placeholder="e.g. Invoices 2026"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full px-4 py-2.5 bg-bg-main/40 border border-border-custom rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm placeholder:text-text-muted/40 text-text-main transition-all"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-bg-main border border-border-custom hover:bg-border-custom text-text-main text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </dialog>
  );
};
