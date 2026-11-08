import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

const InstagramPost = () => {
  const postRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!postRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const dataUrl = await toPng(postRef.current, { 
        cacheBust: true,
        pixelRatio: 2, 
        backgroundColor: '#1a1a1a',
        width: 600,
        height: 600,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "FirstStep_Marketing_Post.png";
      link.click();
      
    } catch (error) {
      console.error("Oops, image generation failed!", error);
      alert("Download failed. Check the console for details.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8 font-sans">
      
      {/* --- INSTAGRAM CANVAS --- */}
      <div 
        ref={postRef}
        className="relative w-[600px] h-[600px] shrink-0 min-w-[600px] min-h-[600px] bg-[#1a1a1a] overflow-hidden shadow-2xl flex flex-col justify-between mb-8"
      >
        {/* Subtle Background Texture/Grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* --- HEADER --- */}
        {/* Reduced top padding here from pt-10 to pt-6 */}
        <div className="z-10 flex flex-col items-center pt-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 border-2 border-white flex items-center justify-center transform rotate-45">
              <div className="w-2 h-2 bg-white"></div>
            </div>
            <span className="text-white font-bold tracking-widest text-sm uppercase">FirstStep</span>
          </div>

          <p className="text-gray-400 text-xs tracking-[0.2em] uppercase font-semibold mb-2">
            The architecture of modern business
          </p>
          <h1 className="text-white text-4xl font-black uppercase tracking-tight text-center leading-tight">
            Web & Digital<br/>Solutions
          </h1>
          
          <div className="mt-4 border border-white/20 rounded-full px-5 py-1.5 backdrop-blur-sm">
            <p className="text-white text-[10px] tracking-widest uppercase">
              Core technologies we build with
            </p>
          </div>
        </div>

        {/* --- CENTRAL VISUAL: STICKY NOTES GRID --- */}
        <div className="relative z-10 flex-grow flex items-center justify-center w-full px-12">
          {/* Reduced gap-y-10 to gap-y-4 to pull the rows closer together */}
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            {/* Row 1 */}
            <NoteCard color="bg-[#60A5FA]" text="CUSTOM WEB" rotation="-rotate-6" />
            <NoteCard color="bg-[#FDE047]" text="SEO / RANKING" rotation="rotate-3" />
            <NoteCard color="bg-[#6EE7B7]" text="REACT UI" rotation="-rotate-3" />

            {/* Row 2 */}
            <NoteCard color="bg-[#F472B6]" text="FASTAPI" rotation="-rotate-3" />
            <NoteCard color="bg-[#FDBA74]" text="SECURE DATA" rotation="rotate-2" />
            <NoteCard color="bg-[#C084FC]" text="AI / RAG" rotation="-rotate-6" />
          </div>
        </div>

        {/* --- FOOTER --- */}
        {/* Reduced bottom padding from pb-8 to pb-4 */}
        <div className="z-10 pb-4 flex flex-col items-center w-full">
          <div className="w-16 h-[1px] bg-white/20 mb-3"></div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-white text-sm font-semibold tracking-wider">
              firststepwebtech@gmail.com
            </p>
            <div className="flex items-center gap-2 mt-1">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              <p className="text-gray-400 text-sm font-medium tracking-wide">
                @firststep_webtech
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- DOWNLOAD BUTTON --- */}
      <button 
        onClick={handleDownload}
        disabled={isDownloading}
        className={`flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-300 w-64
          ${isDownloading 
            ? 'bg-gray-400 text-gray-800 cursor-not-allowed scale-95' 
            : 'bg-[#1a1a1a] hover:bg-black text-white hover:-translate-y-1 active:scale-95'
          }
        `}
      >
        {isDownloading ? "Generating..." : "Download HD Post"}
      </button>

    </div>
  );
};

// Reusable Post-it Note Component 
const NoteCard = ({ color, text, rotation }) => {
  return (
    <div className={`relative ${rotation} transition-transform hover:scale-110 duration-300 cursor-pointer`}>
      <div className={`w-32 h-28 ${color} shadow-[6px_6px_15px_rgba(0,0,0,0.6)] flex items-center justify-center p-2 rounded-sm relative`}>
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-black/10 rounded-tl-full"></div>
        <p className="text-black font-black text-center text-lg leading-tight uppercase transform -rotate-1 opacity-90 drop-shadow-sm">
          {text}
        </p>
      </div>
    </div>
  );
};

export default InstagramPost;