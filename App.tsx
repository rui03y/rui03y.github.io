import React, { useState, useEffect } from 'react';
import { Settings, Copy, Smartphone, MessageSquareWarning, Wand2 } from 'lucide-react';
import { logConversion } from './services/supabaseClient';
import AnnouncementBox from './components/AnnouncementBox';
import SidebarPopup from './components/SidebarPopup';
import { ShortlinkCard } from './components/ShortlinkCard'

function App() {
  // --- Global State ---
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error' | 'info', visible: boolean}>({
    msg: '', type: 'info', visible: false
  });

  // --- Converter State ---
  const [urlInput, setUrlInput] = useState('');
  const [outputResult, setOutputResult] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  // Spotlight Effect State
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const shownCount = parseInt(localStorage.getItem('spotlightShown') || '0');
    if (shownCount < 3) {
      setShake(true);
      localStorage.setItem('spotlightShown', (shownCount + 1).toString());
      setTimeout(() => setShake(false), 1000);
    }
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  // --- Shared Logic ---
  const updatePreview = (url: string) => {
    let finalUrl = url;
    if (!finalUrl.includes('https://activity.bigo.tv/live/act/act_16907/index.html?')) {
        const separator = finalUrl.includes('?') ? '&' : '?';
        finalUrl += `${separator}livelive=1&debug=true&eruda=true?testuid=1600007163`;
    }
    setPreviewUrl(finalUrl);
  };

  // --- Converter Logic ---
  const handleEncode = () => {
    const trimmedInput = urlInput.trim();
    if (!trimmedInput) {
        showToast('Please enter a URL to encode', 'error');
        return;
    }

    let fullEncodedURL;
    if (trimmedInput.startsWith('bigolive://web?url=')) {
      fullEncodedURL = trimmedInput;
    } else {
      const encodedURL = encodeURIComponent(trimmedInput);
      fullEncodedURL = `bigolive://web?url=${encodedURL}`;
    }

    setOutputResult(fullEncodedURL);
    logConversion("encode", trimmedInput, fullEncodedURL);

    const rawUrl = decodeURIComponent(fullEncodedURL.replace('bigolive://web?url=', ''));
    updatePreview(rawUrl);
  };

  const handleDecode = () => {
    let trimmedInput = urlInput.trim();
    if (!trimmedInput) {
        showToast('Please enter a deeplink to decode', 'error');
        return;
    }

    if (trimmedInput.startsWith('bigolive://web?url=')) {
        trimmedInput = trimmedInput.replace('bigolive://web?url=', '');
    }
    
    const decodedURL = decodeURIComponent(trimmedInput);
    setOutputResult(decodedURL);
    logConversion("decode", urlInput, decodedURL);
    updatePreview(decodedURL);
  };

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult)
      .then(() => {
        setCopyStatus('copied');
        showToast('Result copied!');
        setTimeout(() => setCopyStatus('idle'), 2000);
      })
      .catch(() => setCopyStatus('error'));
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-ocean-200 selection:text-ocean-900 flex flex-col items-center justify-center py-10 px-4 sm:px-6 overflow-x-hidden relative">
      
      {/* Background decorations if needed, kept clean for now */}

      {/* Toast */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[70] transition-all duration-500 ease-in-out ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className={`px-6 py-3 rounded-full shadow-xl shadow-ocean-100 text-sm font-semibold backdrop-blur-md border border-white/60 flex items-center gap-2 ${
            toast.type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white/90 text-slate-700 border-white/60'
        }`}>
            {toast.type === 'success' && <span className="text-aqua-500">✓</span>}
            {toast.msg}
        </div>
      </div>

      <AnnouncementBox />
      
      <SidebarPopup 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onPreview={updatePreview}
        showToast={showToast}
      />

      {/* Header - Centered and Spaced */}
      <div className="text-center mb-16 animate-fade-in relative z-10 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-3 tracking-tight leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-600 via-aqua-500 to-ocean-500">
            Bigo Deeplink Pro
          </span>
        </h1>
        <p className="text-slate-500 text-lg font-medium tracking-wide opacity-80">Operations Tool Suite</p>
      </div>

      {/* Main Content Area */}
      {/* Aligned items-start to ensure tops match. Both children have fixed h-[780px]. */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 animate-slide-up z-10">
        
        {/* ================= LEFT COLUMN: Link Converter ================= */}
        <div className="w-full max-w-[380px] h-[780px] flex-shrink-0 flex flex-col">
            
            <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-xl shadow-ocean-900/5 border border-white/60 p-6 relative overflow-hidden flex flex-col h-full">
                
                {/* 1. Header & Dino */}
                <div className="flex flex-col items-center justify-center pt-4 mb-6">
                    <div 
                      className={`relative group cursor-pointer transition-transform duration-300 ${shake ? 'animate-bounce-slow' : ''} hover:scale-105`}
                      onClick={() => setIsSidebarOpen(true)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-ocean-400 to-aqua-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <ShortlinkCard />
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-ocean-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-2 py-0.5 rounded-full shadow-sm ring-1 ring-ocean-100">
                            ✨ Open Shortlink
                        </span>
                    </div>
                </div>

                {/* 2. Converter Inputs */}
                <div className="flex-1 flex flex-col justify-center space-y-5 px-1">
                    <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-lg justify-center">
                        <div className="p-1.5 bg-ocean-100 rounded-lg text-ocean-600">
                            <Wand2 size={18} />
                        </div>
                        <h2>Link Converter</h2>
                    </div>

                    <div className="relative group">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-2 mb-1 block">Input URL</label>
                        <input 
                            type="text" 
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="http://... or bigolive://..." 
                            className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-ocean-100 focus:border-ocean-400 transition-all placeholder:text-slate-400 shadow-sm"
                        />
                        {urlInput && (
                            <button onClick={() => setUrlInput('')} className="absolute right-3 top-7 text-slate-300 hover:text-slate-500">
                                <Settings size={14} className="animate-spin-slow" />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={handleEncode}
                            className="bg-gradient-to-r from-ocean-500 to-ocean-600 hover:from-ocean-400 hover:to-ocean-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-ocean-500/30 active:scale-95 transition-all text-sm flex justify-center items-center gap-2"
                        >
                            Encode
                        </button>
                        <button 
                            onClick={handleDecode}
                            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-2xl shadow-sm hover:shadow-md active:scale-95 transition-all text-sm flex justify-center items-center gap-2"
                        >
                            Decode
                        </button>
                    </div>

                    <div className="pt-5 border-t border-slate-100/50">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-2 mb-1 block">Result</label>
                        <div 
                            onClick={() => outputResult && window.open(outputResult, '_blank')}
                            className="w-full min-h-[50px] bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex items-center cursor-pointer hover:border-ocean-300 transition-all mb-3 group hover:bg-white hover:shadow-sm"
                        >
                            <p className="text-slate-600 font-mono text-xs break-all leading-relaxed group-hover:text-ocean-700 line-clamp-2">
                                {outputResult || <span className="text-slate-300 italic">Result will appear here...</span>}
                            </p>
                        </div>
                        <button 
                            onClick={handleCopy}
                            disabled={!outputResult}
                            className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                copyStatus === 'copied' 
                                ? 'bg-aqua-500 text-white shadow-lg shadow-aqua-500/20' 
                                : 'bg-slate-800 text-white hover:bg-slate-700 hover:shadow-lg hover:shadow-slate-800/10'
                            } ${!outputResult ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Copy size={14} /> {copyStatus === 'copied' ? 'Copied' : 'Copy Result'}
                        </button>
                    </div>
                </div>

                 {/* Footer Links */}
                 <div className="mt-auto text-center text-[10px] text-slate-400 font-medium pb-2">
                    <div className="flex justify-center gap-3">
                         <a href="https://manage-oss.bigo.sg/bigoActivity/actmachine-v2/list" target="_blank" className="hover:text-ocean-600 transition-colors">Activity Templates</a>
                         <span>•</span>
                         <a href="https://doc.weixin.qq.com/forms/ANsAMQeuAAYAYUAMwY3ALkCND10S1KALf?page=1" target="_blank" className="hover:text-ocean-600 transition-colors flex items-center gap-1 justify-center">
                            <MessageSquareWarning size={10} /> Feedback
                         </a>
                    </div>
                </div>
            </div>
        </div>

        {/* ================= RIGHT COLUMN: Phone Preview ================= */}
        <div className="w-full max-w-[360px] h-[780px] flex-shrink-0 relative group">
            
            {/* Label - Absolute Positioned to not affect height flow */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-sm transition-all duration-300 group-hover:bg-white/80">
                <Smartphone size={14} className="text-slate-500" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Mobile Preview</span>
            </div>

            {/* PHONE MOCKUP BODY: Fixed Height 780px */}
            <div className="relative w-full h-full border-gray-900 bg-gray-900 border-[12px] rounded-[3.5rem] shadow-2xl shadow-ocean-900/20 flex flex-col overflow-hidden">
                
                {/* Dynamic Island */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-[26px] w-[96px] bg-gray-900 rounded-b-2xl z-20 flex justify-center items-center">
                    <div className="w-16 h-1.5 bg-gray-800 rounded-full opacity-50"></div>
                </div>

                {/* Side Buttons */}
                <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[15px] top-[100px] rounded-l-lg border-r border-gray-700"></div>
                <div className="h-[50px] w-[3px] bg-gray-800 absolute -left-[15px] top-[160px] rounded-l-lg border-r border-gray-700"></div>
                <div className="h-[50px] w-[3px] bg-gray-800 absolute -left-[15px] top-[220px] rounded-l-lg border-r border-gray-700"></div>
                <div className="h-[70px] w-[3px] bg-gray-800 absolute -right-[15px] top-[180px] rounded-r-lg border-l border-gray-700"></div>

                {/* Screen Content */}
                <div className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden relative">
                    {previewUrl ? (
                        <iframe 
                            src={previewUrl} 
                            className="w-full h-full border-none"
                            title="Mobile Preview"
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups" 
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-8 text-center">
                            <div className="w-20 h-20 bg-ocean-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                <Smartphone size={32} className="text-ocean-200" />
                            </div>
                            <p className="font-semibold text-slate-500">Ready to Preview</p>
                            <p className="text-xs mt-2 text-slate-400">Enter a URL or Shortlink code</p>
                        </div>
                    )}
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full z-20 backdrop-blur-sm pointer-events-none mix-blend-multiply"></div>
            </div>
            
            {/* Reflection Shadow - Absolute Positioned to not affect height flow */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[300px] h-6 bg-ocean-900/10 blur-2xl rounded-full"></div>
        </div>

      </div>
    </div>
  );
}

export default App;
