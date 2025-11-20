import React, { useState, useRef } from 'react';
import { editImageWithGemini } from '../services/geminiService';

interface AiStudioProps {
  onClose: () => void;
}

const AiStudio: React.FC<AiStudioProps> = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;

    setIsLoading(true);
    setError(null);

    try {
      // Identify mime type
      const mimeType = selectedImage.match(/data:(.*);base64,/)?.[1] || 'image/png';
      
      const generatedBase64 = await editImageWithGemini(selectedImage, mimeType, prompt);
      setResultImage(`data:image/png;base64,${generatedBase64}`);
    } catch (err: any) {
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-1.5 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </span>
            <h2 className="text-xl font-serif font-bold text-slate-800">Nano Banana AI Studio</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">1. Upload Photo</h3>
              <p className="text-xs text-slate-500">Upload a photo of your charm bracelet to edit it with AI.</p>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden relative"
              >
                {selectedImage ? (
                  <img src={selectedImage} alt="Original" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center p-4">
                    <svg className="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span className="text-slate-500 font-medium">Click to upload image</span>
                  </div>
                )}
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">2. Enter Prompt</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Add a vintage filter, make it glow..."
                  className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !selectedImage || !prompt}
                  className={`
                    px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all flex items-center gap-2
                    ${isLoading || !selectedImage || !prompt 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:-translate-y-0.5'}
                  `}
                >
                  {isLoading ? 'Thinking...' : 'Generate'}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="space-y-2">
             <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">3. AI Result</h3>
             <div className="border border-slate-200 bg-slate-50 rounded-xl h-[400px] lg:h-[500px] flex items-center justify-center relative overflow-hidden">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 animate-pulse">Generating with Gemini 2.5...</p>
                  </div>
                ) : resultImage ? (
                  <img src={resultImage} alt="Generated" className="w-full h-full object-contain" />
                ) : (
                  <p className="text-slate-400 text-center px-8">Generated image will appear here.</p>
                )}
             </div>
             {resultImage && (
               <div className="flex justify-end">
                 <a 
                   href={resultImage} 
                   download="charm-ai-edit.png"
                   className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                   Download Result
                 </a>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiStudio;
