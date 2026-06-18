import React, { useMemo } from 'react';
import { useStorage } from '../context/StorageContext';
import { useAuth } from '../context/AuthContext';
import { formatBytes } from '../utils/format';
import { 
  FolderClosed, 
  Image, 
  FileText, 
  Video, 
  Music, 
  Trash2, 
  LogOut, 
  HardDrive, 
  CloudRain 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeCategory, setActiveCategory, files, setCurrentFolderId, setSearchQuery } = useStorage();
  const { logout, user } = useAuth();

  const categories = [
    { id: 'all', name: 'All Files', icon: FolderClosed },
    { id: 'images', name: 'Images', icon: Image },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'videos', name: 'Videos', icon: Video },
    { id: 'audios', name: 'Audios', icon: Music },
    { id: 'trash', name: 'Trash', icon: Trash2 },
  ];

  // Calculate used space based on non-trashed files
  const usedSpace = useMemo(() => {
    return files
      .filter(f => !f.isTrash)
      .reduce((acc, file) => acc + file.size, 0);
  }, [files]);

  const maxSpace = 15 * 1024 * 1024 * 1024; // 15 GB mock
  const percentageUsed = Math.min(100, (usedSpace / maxSpace) * 100);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchQuery(''); // Clear search when switching tabs
    setCurrentFolderId(null); // Reset folder path when switching tabs
  };

  return (
    <aside className="w-64 bg-bg-sidebar border-r border-border-custom flex flex-col h-full shrink-0 transition-colors duration-200">
      {/* Brand Branding */}
      <div className="p-6 flex items-center gap-3 border-b border-border-custom">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/10">
          <CloudRain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-text-main leading-none">ChaiDrive</h2>
          <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">Cloud Space</span>
        </div>
      </div>

      {/* Nav Menu Categories */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-accent-light border border-accent-border text-primary'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-main/60 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Storage Indicator */}
      <div className="p-4 mx-4 mb-2 rounded-2xl bg-bg-main/40 border border-border-custom">
        <div className="flex items-center gap-2 mb-3 text-text-muted">
          <HardDrive className="w-4 h-4 text-text-muted" />
          <span className="text-xs font-semibold">Storage Space</span>
        </div>
        <div className="w-full h-2 rounded-full bg-border-custom overflow-hidden mb-2">
          <div 
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${percentageUsed}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] font-bold text-text-muted">
          <span>{formatBytes(usedSpace)} used</span>
          <span>15 GB</span>
        </div>
      </div>

      {/* Credits / Future Policy Panel */}
      <div className="px-6 py-3 select-none text-[10px] text-text-muted/80 font-semibold space-y-1.5 border-t border-border-custom/40">
        <p>Developer: <span className="text-text-main font-bold">Antigravity</span></p>
        <p>Owner: <span className="text-text-main font-bold">Tarun</span></p>
        <div className="text-[9px] pt-1.5 text-primary font-bold border-t border-border-custom/20">
          ⚠️ Plan: Public accounts will clear uploaded items after 24 hours.
        </div>
      </div>

      {/* User Info & Logout */}
      {user && (
        <div className="p-4 border-t border-border-custom flex items-center justify-between gap-2 bg-bg-main/20">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-accent-light flex items-center justify-center text-primary font-bold text-sm shrink-0 border border-accent-border">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-text-main truncate leading-tight">{user.username}</p>
              <p className="text-[11px] text-text-muted truncate mt-0.5 font-medium">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-text-muted hover:text-red-500 rounded-xl transition-all cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
