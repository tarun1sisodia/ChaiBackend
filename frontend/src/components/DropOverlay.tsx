import React from 'react';
import { UploadCloud } from 'lucide-react';

interface DropOverlayProps {
  isDragging: boolean;
}

export const DropOverlay: React.FC<DropOverlayProps> = ({ isDragging }) => {
  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-50 bg-bg-main/80 backdrop-blur-md flex flex-col items-center justify-center border-4 border-dashed border-primary/50 m-4 rounded-3xl select-none pointer-events-none animate-fade-in transition-colors duration-200">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4 animate-bounce">
        <UploadCloud className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-text-main tracking-tight">Drop files anywhere to upload</h2>
      <p className="text-sm text-text-muted mt-2 font-bold">Add files to your ChaiDrive workspace instantly</p>
    </div>
  );
};
