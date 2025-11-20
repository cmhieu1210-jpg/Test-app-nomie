import React from 'react';
import { BraceletSize } from '../types';
import { SIZES } from '../constants';

interface SizeSelectorProps {
  currentSizeId: string;
  onSelect: (size: BraceletSize) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ currentSizeId, onSelect, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-serif font-bold text-slate-800">Select Bracelet Size</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        
        <div className="space-y-3">
          {SIZES.map((size) => (
            <button
              key={size.id}
              onClick={() => { onSelect(size); onClose(); }}
              className={`
                w-full p-4 rounded-lg border-2 text-left flex justify-between items-center transition-all
                ${currentSizeId === size.id 
                  ? 'border-slate-800 bg-slate-50' 
                  : 'border-slate-100 hover:border-slate-300'}
              `}
            >
              <div>
                <span className="block font-bold text-slate-800 uppercase tracking-wide text-sm">{size.name}</span>
                <span className="text-xs text-slate-500">{size.links} Links</span>
              </div>
              <div className="text-slate-600 font-mono text-sm">{size.description}</div>
            </button>
          ))}
        </div>
        
        <div className="mt-6 text-center text-xs text-slate-400">
           Most adults fit Small or Medium.
        </div>
      </div>
    </div>
  );
};

export default SizeSelector;
