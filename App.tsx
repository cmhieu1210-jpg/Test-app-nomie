
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Charm, BraceletSize, BraceletLink, AppMode } from './types';
import { SIZES, LINK_ASSETS } from './constants';
import BraceletBuilder from './components/BraceletBuilder';
import CharmLibrary from './components/CharmLibrary';
import SizeSelector from './components/SizeSelector';
import AiStudio from './components/AiStudio';

const App: React.FC = () => {
  const [currentSize, setCurrentSize] = useState<BraceletSize>(SIZES[2]); // Default Medium
  const [bracelet, setBracelet] = useState<BraceletLink[]>([]);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.BUILDER);
  
  // State cho ảnh nền mắt xích (Base Link)
  const [customBaseImage, setCustomBaseImage] = useState<string | null>(null);
  
  // State cho ảnh nền khu vực thiết kế (Scene Background)
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);
  
  // State cho charms do người dùng upload
  const [customCharms, setCustomCharms] = useState<Charm[]>([]);

  const baseImageInputRef = useRef<HTMLInputElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize bracelet slots based on size
  useEffect(() => {
    setBracelet(prev => {
      const newLinks: BraceletLink[] = [];
      for (let i = 0; i < currentSize.links; i++) {
        // Try to preserve existing charms if resizing
        const existingCharm = prev[i]?.charm || null;
        newLinks.push({ id: `slot-${i}`, charm: existingCharm });
      }
      return newLinks;
    });
  }, [currentSize]);

  const handleDropCharm = useCallback((charm: Charm, index: number) => {
    setBracelet(prev => {
      const newLinks = [...prev];
      if (index >= 0 && index < newLinks.length) {
        newLinks[index] = { ...newLinks[index], charm: charm };
      }
      return newLinks;
    });
  }, []);

  // Helper for clicking from library (fills first empty slot)
  const handleSelectCharm = useCallback((charm: Charm) => {
    setBracelet(prev => {
      const firstEmptyIndex = prev.findIndex(link => link.charm === null);
      if (firstEmptyIndex !== -1) {
        const newLinks = [...prev];
        newLinks[firstEmptyIndex] = { ...newLinks[firstEmptyIndex], charm: charm };
        return newLinks;
      } else {
        alert("Vòng đã đầy! Hãy xóa bớt charm hoặc tăng kích thước vòng.");
        return prev;
      }
    });
  }, []);

  const handleRemoveCharm = useCallback((index: number) => {
    setBracelet(prev => {
      const newLinks = [...prev];
      newLinks[index] = { ...newLinks[index], charm: null };
      return newLinks;
    });
  }, []);

  // Upload handlers
  const handleBaseImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomBaseImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadCustomCharm = useCallback((newCharm: Charm) => {
    setCustomCharms(prev => [newCharm, ...prev]);
  }, []);

  const totalPrice = bracelet.reduce((sum, link) => sum + (link.charm?.price || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white font-serif font-bold text-lg shadow-md">C</div>
             <h1 className="text-xl font-serif font-bold tracking-tight text-slate-900">Nomie Charm <span className="text-slate-400 font-sans text-xs font-normal ml-1">Configurator</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setActiveMode(AppMode.AI_STUDIO)}
               className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 border border-indigo-100 text-indigo-700 font-medium text-sm transition-all"
             >
               <span className="text-lg">✨</span>
               <span>AI Studio</span>
             </button>
             
             <div className="flex flex-col items-end border-l border-slate-200 pl-4">
               <span className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Total Est.</span>
               <span className="font-bold text-slate-900 text-lg leading-none">${totalPrice.toFixed(2)}</span>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        
        {/* Controls Row */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Tùy chỉnh Giao diện</h2>
            <p className="text-slate-500 text-xs mt-1">Tải lên hình ảnh thực tế để tạo trải nghiệm chân thực.</p>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            {/* Upload Base Image Button */}
            <div className="relative group">
              <button 
                onClick={() => baseImageInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-all text-sm font-medium"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Ảnh Mắt Xích
              </button>
              <input 
                type="file" 
                ref={baseImageInputRef} 
                onChange={handleBaseImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

             {/* Upload Background Image Button */}
             <div className="relative group">
              <button 
                onClick={() => bgImageInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-all text-sm font-medium"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
                Ảnh Nền
              </button>
              <input 
                type="file" 
                ref={bgImageInputRef} 
                onChange={handleBackgroundImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

            <button 
              onClick={() => setIsSizeModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 transition-colors shadow-sm"
            >
              <span className="text-sm font-medium">Size: <span className="font-bold text-slate-900">{currentSize.name}</span></span>
            </button>
            
            <button 
               onClick={() => setBracelet(bracelet.map(l => ({...l, charm: null})))}
               className="px-4 py-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all"
               title="Clear all charms"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </div>

        {/* Builder Area */}
        <section className="w-full">
          <BraceletBuilder 
            links={bracelet} 
            onRemoveCharm={handleRemoveCharm}
            onDropCharm={handleDropCharm}
            customBaseImage={customBaseImage || LINK_ASSETS.steel}
            customBackgroundImage={customBackgroundImage}
          />
        </section>

        {/* Selection Area */}
        <section className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
           <div className="p-4 flex-1 min-h-[350px]">
              <CharmLibrary 
                onSelectCharm={handleSelectCharm} 
                customBaseImage={customBaseImage || LINK_ASSETS.steel}
                customCharms={customCharms}
                onUploadCharm={handleUploadCustomCharm}
              />
           </div>
        </section>

      </main>

      {/* Footer Actions Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex justify-around z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <button 
           onClick={() => setActiveMode(AppMode.AI_STUDIO)}
           className="flex flex-col items-center gap-1 text-indigo-600"
         >
           <span className="text-xl">✨</span>
           <span className="text-[10px] font-bold uppercase">AI Studio</span>
         </button>
         <button 
           onClick={() => setIsSizeModalOpen(true)}
           className="flex flex-col items-center gap-1 text-slate-600"
         >
           <span className="text-xl">📏</span>
           <span className="text-[10px] font-bold uppercase">Size</span>
         </button>
      </div>

      {/* Modals */}
      <SizeSelector 
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        currentSizeId={currentSize.id}
        onSelect={setCurrentSize}
      />

      {activeMode === AppMode.AI_STUDIO && (
        <AiStudio onClose={() => setActiveMode(AppMode.BUILDER)} />
      )}
    </div>
  );
};

export default App;
