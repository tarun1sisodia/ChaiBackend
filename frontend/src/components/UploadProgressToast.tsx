import React, { useState } from 'react';
import type { UploadTask } from '../types';
import { CheckCircle, AlertCircle, Loader2, X, ChevronUp, ChevronDown } from 'lucide-react';

interface UploadProgressToastProps {
  tasks: UploadTask[];
}

export const UploadProgressToast: React.FC<UploadProgressToastProps> = ({ tasks }) => {
  const [minimized, setMinimized] = useState(false);
  const [closed, setClosed] = useState(false);

  if (tasks.length === 0 || closed) return null;

  const uploadingCount = tasks.filter(t => t.status === 'uploading').length;
  const totalCount = tasks.length;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-bg-sidebar/95 border border-border-custom shadow-2xl rounded-2xl overflow-hidden z-50 animate-fade-in backdrop-blur-md text-text-main transition-colors duration-200">
      {/* Title Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg-main border-b border-border-custom select-none">
        <span className="text-xs font-bold text-text-main">
          {uploadingCount > 0 
            ? `Uploading ${uploadingCount} of ${totalCount} items...` 
            : `Uploaded ${totalCount} items`
          }
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1 hover:bg-bg-main/80 text-text-muted hover:text-text-main rounded-lg transition-all cursor-pointer"
          >
            {minimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setClosed(true)}
            className="p-1 hover:bg-bg-main/80 text-text-muted hover:text-text-main rounded-lg transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task Rows List */}
      {!minimized && (
        <div className="max-h-60 overflow-y-auto divide-y divide-border-custom/50 p-1">
          {tasks.map((task) => (
            <div key={task.id} className="p-3 space-y-2">
              <div className="flex items-start justify-between gap-3 select-none">
                <span className="text-xs font-semibold text-text-main truncate pr-4" title={task.fileName}>
                  {task.fileName}
                </span>
                
                {/* Status Indicator Icon */}
                <div className="shrink-0">
                  {task.status === 'uploading' && (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  )}
                  {task.status === 'completed' && (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                  {task.status === 'error' && (
                    <div title={task.errorMsg}>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {task.status === 'uploading' && (
                <div className="space-y-1">
                  <div className="w-full h-1 bg-bg-main rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-150 rounded-full"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold text-text-muted">
                    <span>{Math.round(task.progress)}%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
