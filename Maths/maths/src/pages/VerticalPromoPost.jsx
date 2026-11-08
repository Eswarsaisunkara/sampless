import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

const VerticalPromoPost = () => {
  const postRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!postRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const dataUrl = await toPng(postRef.current, { 
        cacheBust: true,
        pixelRatio: 2, // High resolution
        backgroundColor: '#4C1D95', // Deep purple background
        width: 600,
        height: 750, // 4:5 Aspect Ratio for Instagram
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "FirstStep_Vertical_Post.png";
      link.click();
      
    } catch (error) {
      console.error("Oops, image generation failed!", error);
      alert("Download failed. Check the console for details.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 font-sans">
      
      {/* --- INSTAGRAM PORTRAIT CANVAS (4:5 Ratio) --- */}
      <div 
        ref={postRef}
        className="relative w-[600px] h-[750px] shrink-0 min-w-[600px] min-h-[750px] bg-[#4C1D95] overflow-hidden shadow-2xl flex flex-col justify-between mb-8"
      >
        
        {/* --- TOP DARK CARD --- */}
        <div className="z-20 bg-[#2E1065] w-full rounded-b-[40px] px-8 pt-10 pb-10 shadow-xl border-b border-purple-800/50">
          
          {/* Framed Title Area */}
          <div className="border-[3px] border-[#A855F7] p-5 mb-6">
            <h1 className="text-[#FDF8F5] text-[2.75rem] leading-[1.05] font-black uppercase tracking-tight text-center">
              Every Business<br />Needs A Website!
            </h1>
          </div>

          {/* Subtext and Button Row */}
          <div className="flex items-center justify-between gap-6 px-2">
            <p className="text-[#E9D5FF] text-lg font-medium leading-tight flex-1">
              A fast, professional, and mobile-friendly website can make all the difference!
            </p>
            <div className="shrink-0 border-2 border-[#E9D5FF] rounded-full px-6 py-3 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
              <span className="text-[#E9D5FF] font-bold text-sm tracking-wider uppercase text-center leading-tight">
                DM FOR<br/>BUSINESS
              </span>
            </div>
          </div>

        </div>

        {/* --- CENTRAL VISUAL: THE WORKSTATION --- */}
        <div className="relative z-10 flex-grow w-full flex items-end justify-center pb-24">
          {/* Large background abstract circle */}
          <div className="absolute w-[450px] h-[450px] bg-[#3B0764] rounded-full top-[10%] opacity-60"></div>
          
          {/* Desk & Monitor Composition */}
          <div className="relative z-20 flex flex-col items-center">
            
            {/* The Ultra-Wide Monitor */}
            <div className="relative w-[380px] h-[180px] bg-[#171717] rounded-xl border-[6px] border-[#262626] shadow-2xl flex items-center justify-center overflow-hidden z-20 mb-2 transform perspective-[1000px] rotateX-2">
              {/* Screen Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none"></div>
              
              {/* Fake Code / Editor UI */}
              <div className="w-full h-full p-4 flex gap-6 opacity-90">
                {/* Code Window */}
                <div className="flex-1 bg-[#0A0A0A] rounded border border-gray-800 p-3 flex flex-col gap-2">
                  <div className="w-1/3 h-2 bg-[#A855F7] rounded"></div>
                  <div className="w-3/4 h-1.5 bg-gray-600 rounded"></div>
                  <div className="w-1/2 h-1.5 bg-gray-600 rounded"></div>
                  <div className="w-2/3 h-1.5 bg-gray-600 rounded"></div>
                  <div className="w-full h-1.5 bg-gray-700 rounded mt-2"></div>
                  <div className="w-4/5 h-1.5 bg-gray-700 rounded"></div>
                </div>
                {/* Preview Windows */}
                <div className="w-24 flex flex-col gap-3">
                  <div className="flex-1 bg-[#FDE047] rounded shadow-[0_0_15px_rgba(253,224,71,0.2)]"></div>
                  <div className="flex-1 bg-[#60A5FA] rounded shadow-[0_0_15px_rgba(96,165,250,0.2)]"></div>
                </div>
              </div>
            </div>

            {/* Monitor Stand */}
            <div className="w-16 h-8 bg-[#262626] z-10"></div>
            <div className="w-32 h-2 bg-[#404040] rounded-t z-10"></div>

            {/* Desk Surface */}
            <div className="w-[450px] h-3 bg-[#1E1B4B] rounded-full z-10 shadow-lg mt-1"></div>
            
            {/* Desk Legs */}
            <div className="w-[300px] flex justify-between mt-0">
              <div className="w-4 h-32 bg-[#1E1B4B]"></div>
              <div className="w-4 h-32 bg-[#1E1B4B]"></div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM FOOTER --- */}
        <div className="absolute bottom-0 w-full bg-[#2E1065] border-t border-purple-800/50 p-4 flex flex-col items-center justify-center gap-1.5 z-30">
          <div className="flex w-full justify-between items-center px-6">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#A855F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <span className="text-purple-100 text-[13px] font-semibold tracking-wide">firststepwebtech@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#A855F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              <span className="text-purple-100 text-[13px] font-semibold tracking-wide">firststepwebtech.com</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <svg className="w-4 h-4 text-[#A855F7]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            <span className="text-white text-[13px] font-bold tracking-widest">@firststep_webtech</span>
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
            : 'bg-[#2E1065] hover:bg-[#1E0A45] text-white hover:-translate-y-1 active:scale-95'
          }
        `}
      >
        {isDownloading ? "Generating..." : "Download Portrait Post"}
      </button>

    </div>
  );
};

export default VerticalPromoPost;