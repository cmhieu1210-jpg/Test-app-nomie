
import React, { useState, useRef, useEffect } from 'react';
import { Charm } from '../types';
import { CHARMS } from '../constants';

interface CharmLibraryProps {
  onSelectCharm: (charm: Charm) => void;
  customBaseImage: string;
  customCharms: Charm[];
  onUploadCharm: (charm: Charm) => void;
}

const categories = ['all', 'custom', 'symbol', 'letter', 'animal', 'stone', 'flag'];

const CharmLibrary: React.FC<CharmLibraryProps> = ({ 
  onSelectCharm, 
  customBaseImage, 
  customCharms,
  onUploadCharm 
}) => {
  const [filter, setFilter] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [charmName, setCharmName] = useState('');
  const [isFullLink, setIsFullLink] = useState(true); // Default to true as users likely upload photos

  // Tự động chuyển sang tab 'custom' khi có charm mới được thêm vào
  useEffect(() => {
    if (customCharms.length > 0 && filter !== 'custom') {
      setFilter('custom');
    }
  }, [customCharms.length]);

  // Combine default charms with user uploaded charms
  const allCharms = [...customCharms, ...CHARMS];

  const filteredCharms = filter === 'all' 
    ? allCharms 
    : allCharms.filter(c => c.category === filter || (filter === 'custom' && c.category === 'custom'));

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, charm: Charm) => {
    e.dataTransfer.setData("application/json", JSON.stringify(charm));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPendingImage(reader.result as string);
        setCharmName(`My Charm ${customCharms.length + 1}`);
        setIsUploadModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveCharm = () => {
    if (!pendingImage) return;

    const newCharm: Charm = {
        id: `custom-${Date.now()}`,
        name: charmName || 'Unnamed Charm',
        category: 'custom',
        imageUrl: pendingImage,
        price: 0,
        isGold: false,
        isFullLink: isFullLink
    };
    
    onUploadCharm(newCharm);
    setIsUploadModalOpen(false);
    setPendingImage(null);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header & Upload */}
      <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif font-semibold text-slate-800">Thư viện Charm</h3>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-slate-700 transition-colors shadow-sm"
          >
            <span className="font-bold text-lg leading-none">+</span> Tải Charm Lên
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto pb-4 mb-2 gap-2 no-scrollbar scroll-smooth">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`
              px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0
              ${filter === cat 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}
            `}
          >
            {cat} {cat === 'custom' && customCharms.length > 0 && `(${customCharms.length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 overflow-y-auto max-h-[400px] p-1 pb-10">
        {/* Show "Add New" card shortcut */}
        {(filter === 'all' || filter === 'custom') && (
             <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center cursor-pointer group h-full min-h-[80px]"
             >
                <div className="w-[72px] h-[56px] border-2 border-dashed border-slate-300 rounded-sm flex items-center justify-center group-hover:border-slate-400 group-hover:bg-slate-50 transition-colors">
                    <svg className="w-6 h-6 text-slate-300 group-hover:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <span className="text-[10px] mt-2 text-slate-400 font-medium">Upload</span>
             </div>
        )}

        {filteredCharms.map(charm => (
          <div
            key={charm.id}
            draggable
            onDragStart={(e) => handleDragStart(e, charm)}
            onClick={() => onSelectCharm(charm)}
            className="group cursor-grab active:cursor-grabbing flex flex-col items-center animate-in fade-in duration-300"
          >
            {/* Preview Box */}
            <div className="relative w-[72px] h-[56px] shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-200 rounded-sm overflow-hidden bg-white">
               {/* Base Logic: If full link, don't show base behind it in preview (optional, but good for consistency) */}
               {!charm.isFullLink && (
                   <img src={customBaseImage} className="w-full h-full object-cover opacity-90" alt="base" />
               )}
               
               {/* Charm Image */}
               <div className={`absolute inset-0 flex items-center justify-center ${charm.isFullLink ? 'p-0' : 'p-2'} z-10`}>
                 <img 
                   src={charm.imageUrl} 
                   alt={charm.name} 
                   className={`${charm.isFullLink ? 'w-full h-full object-cover' : 'max-w-[85%] max-h-[85%] object-contain filter drop-shadow-sm'} hover:scale-110 transition-transform`}
                 />
               </div>
               
               {/* Badges */}
               {charm.category === 'custom' && (
                   <div className="absolute top-0 right-0 bg-blue-500 text-[8px] text-white font-bold px-1 rounded-bl-md z-20">
                     NEW
                   </div>
               )}
            </div>
            
            <div className="mt-2 text-center w-full">
              <p className="text-[10px] font-medium text-slate-600 truncate px-1">{charm.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Thêm Charm Mới</h3>
                    <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                
                <div className="p-4 space-y-4">
                    {/* Preview Area */}
                    <div className="flex justify-center">
                        <div className="relative w-[144px] h-[112px] border border-slate-200 rounded shadow-sm overflow-hidden bg-white">
                             {/* Simulate Base if NOT full link */}
                             {!isFullLink && (
                                 <img src={customBaseImage} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="base preview" />
                             )}
                             <img 
                                src={pendingImage!} 
                                className={`absolute inset-0 m-auto ${isFullLink ? 'w-full h-full object-cover' : 'w-3/4 h-3/4 object-contain'}`} 
                                alt="Preview" 
                             />
                        </div>
                    </div>

                    {/* Name Input */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tên Charm</label>
                        <input 
                            type="text" 
                            value={charmName}
                            onChange={(e) => setCharmName(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Type Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Loại hình ảnh</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => setIsFullLink(true)}
                                className={`p-2 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1 ${isFullLink ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <span className="text-lg">📸</span>
                                <span>Ảnh Nguyên Hạt</span>
                                <span className="text-[9px] font-normal opacity-70">(Gồm cả viền sắt)</span>
                            </button>
                            <button 
                                onClick={() => setIsFullLink(false)}
                                className={`p-2 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1 ${!isFullLink ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <span className="text-lg">⭐</span>
                                <span>Icon / Symbol</span>
                                <span className="text-[9px] font-normal opacity-70">(Nền trong suốt)</span>
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 italic">
                            *Chọn "Ảnh Nguyên Hạt" nếu bạn chụp ảnh thực tế sản phẩm như ảnh mẫu để tránh bị chồng hình.
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
                    <button onClick={() => setIsUploadModalOpen(false)} className="flex-1 py-2 text-slate-600 font-medium text-sm hover:bg-slate-200 rounded-lg transition-colors">Hủy</button>
                    <button onClick={handleSaveCharm} className="flex-1 py-2 bg-slate-800 text-white font-medium text-sm rounded-lg hover:bg-slate-900 transition-colors shadow-md">Lưu Charm</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CharmLibrary;
