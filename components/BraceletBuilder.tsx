
import React from 'react';
import { BraceletLink, Charm } from '../types';

interface BraceletBuilderProps {
  links: BraceletLink[];
  onRemoveCharm: (index: number) => void;
  onDropCharm: (charm: Charm, index: number) => void;
  customBaseImage: string;
  customBackgroundImage: string | null;
}

const BraceletBuilder: React.FC<BraceletBuilderProps> = ({ 
  links, 
  onRemoveCharm, 
  onDropCharm, 
  customBaseImage, 
  customBackgroundImage 
}) => {

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const charmData = e.dataTransfer.getData("application/json");
    if (charmData) {
      try {
        const charm = JSON.parse(charmData) as Charm;
        onDropCharm(charm, index);
      } catch (err) {
        console.error("Failed to parse dropped charm", err);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Bracelet Container */}
      <div 
        className="w-full py-24 rounded-xl flex items-center justify-center relative overflow-hidden border border-slate-200 shadow-inner transition-all duration-500"
        style={{
          backgroundImage: customBackgroundImage ? `url(${customBackgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: customBackgroundImage ? 'transparent' : '#ffffff'
        }}
      >
        
        {/* Lighting overlay (Only visible if no custom background, or reduced opacity if custom) */}
        {!customBackgroundImage && (
          <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-white/20 to-slate-100/50 mix-blend-overlay"></div>
        )}
        
        {/* Darken overlay for better contrast if custom background is used */}
        {customBackgroundImage && (
          <div className="absolute inset-0 bg-black/10 pointer-events-none z-0"></div>
        )}
        
        {/* THE BRACELET STRIP */}
        <div className="flex items-center justify-center relative z-10 drop-shadow-2xl filter">
          
          {/* Spring Mechanism Hint (Left) - Visual Only */}
          <div className="w-2 h-[56px] bg-gradient-to-r from-gray-300 to-gray-100 rounded-l opacity-50 shadow-sm"></div>

          {links.map((link, index) => {
            // Logic to determine if we show the base image
            // We show base image IF: The slot is empty OR The charm is NOT a full link photo
            const showBaseImage = !link.charm || !link.charm.isFullLink;

            return (
              <div
                key={link.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="relative w-[72px] h-[56px] flex-shrink-0 cursor-pointer group transition-transform hover:z-20 hover:scale-105"
                style={{ marginLeft: '-1px' }} // Slight overlap to prevent white pixel lines
              >
                {/* THE BASE LINK IMAGE (Only shown if needed) */}
                {showBaseImage && (
                  <img 
                    src={customBaseImage} 
                    alt="Link" 
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none block shadow-sm z-0"
                  />
                )}

                {/* Charm Overlay or Full Replacement */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden z-10">
                  {link.charm ? (
                    <div className={`relative w-full h-full flex items-center justify-center ${link.charm.isFullLink ? '' : 'p-[10%]'}`}>
                       {/* Charm Image */}
                       <img 
                         src={link.charm.imageUrl} 
                         alt={link.charm.name} 
                         className={`
                           ${link.charm.isFullLink ? 'w-full h-full object-cover' : 'max-w-full max-h-full object-contain filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]'}
                         `}
                       />
                       
                       {/* Remove Button */}
                       <button 
                         onClick={(e) => { e.stopPropagation(); onRemoveCharm(index); }}
                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md text-[10px] transition-all z-30 transform hover:scale-110"
                         title="Remove Charm"
                       >
                         ×
                       </button>
                    </div>
                  ) : (
                    // Hover highlight for empty slots
                    <div className="w-full h-full opacity-0 group-hover:opacity-30 transition-opacity bg-blue-400 rounded-sm border-2 border-blue-300 border-dashed"></div>
                  )}
                </div>
              </div>
            );
          })}

           {/* Spring Mechanism Hint (Right) */}
           <div className="w-2 h-[56px] bg-gradient-to-l from-gray-300 to-gray-100 rounded-r opacity-50 shadow-sm"></div>

        </div>
      </div>
      
      <div className="mt-4 text-slate-400 text-xs text-center flex gap-4">
        <span>
            {customBaseImage.startsWith('data') ? "✓ Custom Base Link" : "• Default Base Link"}
        </span>
        <span>
            {customBackgroundImage ? "✓ Custom Background" : "• Default Background"}
        </span>
      </div>
    </div>
  );
};

export default BraceletBuilder;
