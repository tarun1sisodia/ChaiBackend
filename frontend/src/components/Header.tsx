import React, { useRef, useState, useEffect } from 'react';
import { useStorage } from '../context/StorageContext';
import { 
  Search, 
  Plus, 
  Grid, 
  List, 
  Upload, 
  FolderPlus, 
  ChevronDown,
  Sun,
  Moon,
  Type,
  Wifi,
  WifiOff
} from 'lucide-react';
import type { FontOption } from '../types';

interface HeaderProps {
  onCreateFolderClick: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const FONTS: FontOption[] = [
  { id: 'inter', name: 'Inter Standard', className: 'font-inter' },
  { id: 'outfit', name: 'Outfit Premium', className: 'font-outfit' },
  { id: 'jakarta', name: 'Jakarta Sans', className: 'font-jakarta' },
  { id: 'readex', name: 'Readex Clean', className: 'font-readex' },
  { id: 'sora', name: 'Sora Tech', className: 'font-sora' },
  { id: 'lexend', name: 'Lexend Cozy', className: 'font-lexend' },
  { id: 'dmsans', name: 'DM Sans Minimal', className: 'font-dmsans' },
  { id: 'urbanist', name: 'Urbanist Geometric', className: 'font-urbanist' },
  { id: 'bricolage', name: 'Bricolage Grotesque', className: 'font-bricolage' },
  { id: 'space', name: 'Space Grotesque', className: 'font-space' },
];

export const Header: React.FC<HeaderProps> = ({ onCreateFolderClick, theme, toggleTheme }) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    viewMode, 
    setViewMode, 
    uploadFile, 
    activeCategory,
    isOnline,
    offlineQueue
  } = useStorage();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState(() => {
    return localStorage.getItem('chaidrive_font') || 'space';
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fontRef = useRef<HTMLDivElement>(null);

  // Apply font dynamically to body
  useEffect(() => {
    const body = document.body;
    FONTS.forEach(f => body.classList.remove(f.className));
    const active = FONTS.find(f => f.id === selectedFont);
    if (active) {
      body.classList.add(active.className);
    }
    localStorage.setItem('chaidrive_font', selectedFont);
  }, [selectedFont]);

  // Close dropdowns on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (fontRef.current && !fontRef.current.contains(e.target as Node)) {
        setFontOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (filesList && filesList.length > 0) {
      Array.from(filesList).forEach(file => {
        uploadFile(file);
      });
      e.target.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setDropdownOpen(false);
  };

  const isTrashActive = activeCategory === 'trash';
  const activeFontName = FONTS.find(f => f.id === selectedFont)?.name || 'Outfit Premium';

  return (
    <header className="h-16 border-b border-border-custom bg-bg-sidebar flex items-center justify-between px-8 gap-4 shrink-0 transition-colors duration-200">
      {/* Search Input Bar */}
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-4 top-3 w-5 h-5 text-text-muted" />
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-2 bg-bg-main/50 border border-border-custom rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm placeholder:text-text-muted text-text-main transition-all font-semibold"
        />
      </div>

      {/* Action triggers */}
      <div className="flex items-center gap-3">
        {/* Network Status Badge */}
        <div 
          title={isOnline ? 'Internet connection active' : 'Offline. Uploads will be queued.'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all select-none ${
            isOnline 
              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' 
              : 'bg-amber-500/5 border-amber-500/20 text-amber-500 animate-pulse'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span>Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline ({offlineQueue.length})</span>
            </>
          )}
        </div>

        {/* Font Switcher Dropdown */}
        <div className="relative" ref={fontRef}>
          <button
            onClick={() => setFontOpen(!fontOpen)}
            title="Switch Font Style"
            className="flex items-center gap-1.5 px-3 py-2 text-text-muted hover:text-text-main hover:bg-bg-main/60 rounded-xl transition-all cursor-pointer border border-transparent hover:border-border-custom text-xs font-bold"
          >
            <Type className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline truncate max-w-24">{activeFontName}</span>
            <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
          </button>

          {fontOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-bg-sidebar border border-border-custom shadow-xl py-1.5 z-40 max-h-64 overflow-y-auto animate-fade-in select-none">
              <div className="px-3 py-1 text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border-custom/50 mb-1">
                Select Font
              </div>
              {FONTS.map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFont(f.id);
                    setFontOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-all text-left cursor-pointer hover:bg-bg-main/60 ${
                    selectedFont === f.id ? 'text-primary' : 'text-text-main'
                  } ${f.className}`}
                >
                  <span>{f.name}</span>
                  {selectedFont === f.id && <span className="text-[10px]">●</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggler (Sun/Moon) */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 text-text-muted hover:text-text-main hover:bg-bg-main/60 rounded-xl transition-all cursor-pointer border border-transparent hover:border-border-custom"
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* Toggle Grid/List layout */}
        <div className="flex bg-bg-main p-0.5 rounded-xl border border-border-custom">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              viewMode === 'grid' 
                ? 'bg-accent-light text-primary font-bold' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="List View"
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              viewMode === 'list' 
                ? 'bg-accent-light text-primary font-bold' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* "New" dropdown button */}
        {!isTrashActive && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-2xl shadow-md cursor-pointer transition-all active:scale-[0.98]"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>New</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-bg-sidebar border border-border-custom shadow-xl py-1.5 z-40 animate-fade-in">
                <button
                  onClick={handleUploadClick}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-text-main hover:text-primary hover:bg-bg-main/60 text-left transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-text-muted" />
                  <span>Upload File</span>
                </button>
                <button
                  onClick={() => {
                    onCreateFolderClick();
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-text-main hover:text-primary hover:bg-bg-main/60 text-left transition-all cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4 text-text-muted" />
                  <span>New Folder</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
