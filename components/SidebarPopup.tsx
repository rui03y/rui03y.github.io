import React, { useState } from 'react';
import { X, Link as LinkIcon, Copy, Loader2 } from 'lucide-react';
import { logShortlink } from '../services/supabaseClient';

interface SidebarPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onPreview: (url: string) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const SidebarPopup: React.FC<SidebarPopupProps> = ({ isOpen, onClose, onPreview, showToast }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState<{ shortUrl: string, shortcode: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const generateShortlink = async () => {
    if (!inputUrl.trim()) {
      showToast('Please enter a URL first', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("https://api.bigoug.live/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl })
      });
      
      const data = await response.json();
      
      if (data.code === 0 && data.data?.row?.length > 0) {
        const row = data.data.row[0];
        const match = row.shortUrl.match(/slink\.bigovideo\.tv\/([A-Za-z0-9]+)/);
        const code = match ? match[1] : '';
        
        setResult({ shortUrl: row.shortUrl, shortcode: code });

        // Auto preview
        let previewURL = row.shortUrl;
        if (!previewURL.includes('?')) {
            previewURL += '?livelive=1&debug=true&eruda=true?testuid=1600007163';
        }
        onPreview(previewURL);
        
        logShortlink(code, previewURL, inputUrl);
        showToast('Shortlink generated successfully!');
      } else {
        showToast('Failed to generate shortlink.', 'error');
      }
    } catch (error) {
      showToast(`Error: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const previewManually = () => {
    let code = '';
    const matchUnderscore = inputUrl.match(/__([A-Za-z0-9]{6})__/);
    const matchLink = inputUrl.match(/slink\.bigovideo\.tv\/([A-Za-z0-9]{6})/);
    
    if (matchUnderscore) code = matchUnderscore[1];
    else if (matchLink) code = matchLink[1];
    else if (/^[A-Za-z0-9]{6}$/.test(inputUrl)) code = inputUrl;

    if (!code) {
      showToast('Invalid shortcode or link format', 'error');
      return;
    }

    const previewUrl = `https://slink.bigovideo.tv/${code}`;
    onPreview(previewUrl); // App.tsx handles parameter appending
    setResult({ shortUrl: previewUrl, shortcode: code });
    
    logShortlink(code, previewUrl);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied ${label}!`);
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Panel */}
      <div className={`fixed top-0 left-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-ocean-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LinkIcon className="text-ocean-600" size={24} />
            Shortlink Tool
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white p-1 rounded-xl mb-6 shadow-sm border border-slate-100">
             <div className="bg-ocean-50 rounded-lg p-3">
                <label className="block text-[10px] font-bold text-ocean-400 uppercase tracking-wider mb-2">
                  Activity URL / Shortcode
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. https://activity.bigo.tv/..." 
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all"
                />
             </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={generateShortlink}
              disabled={loading}
              className="w-full bg-gradient-to-r from-ocean-600 to-aqua-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-ocean-500/30 hover:shadow-ocean-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Generate New Shortlink'}
            </button>
            
            <button 
              onClick={previewManually}
              className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
            >
              Preview Existing Code
            </button>
          </div>

          <div className="mt-6 p-4 bg-ocean-50 rounded-xl border border-ocean-100 text-xs text-ocean-700 leading-relaxed text-center">
             💡 <strong>Pro Tip:</strong> You can paste just the 6-character code (e.g. <code>AbC123</code>) to quickly preview a shortlink.
          </div>

          {result && (
            <div className="mt-8 animate-fade-in">
              <div className="bg-aqua-50 border border-aqua-100 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-aqua-200/40 to-transparent rounded-bl-full -mr-8 -mt-8"></div>
                
                <h3 className="text-sm font-bold text-aqua-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-aqua-500 animate-pulse"></div>
                    Generated Successfully
                </h3>
                
                <div className="space-y-4 relative z-10">
                    <div className="group bg-white/60 p-3 rounded-xl border border-aqua-100/50 hover:bg-white transition-colors">
                        <label className="text-[10px] uppercase font-bold text-aqua-600/70 mb-1 block">Shortlink</label>
                        <div className="flex items-center gap-2">
                             <a href={result.shortUrl} target="_blank" rel="noreferrer" className="text-aqua-900 font-medium truncate text-sm hover:underline flex-1">
                                {result.shortUrl}
                             </a>
                             <button onClick={() => copyToClipboard(result.shortUrl, 'Shortlink')} className="text-aqua-600 hover:text-aqua-800 p-1.5 hover:bg-aqua-100 rounded-lg transition-colors">
                                <Copy size={16} />
                             </button>
                        </div>
                    </div>

                    <div className="group bg-white/60 p-3 rounded-xl border border-aqua-100/50 hover:bg-white transition-colors">
                        <label className="text-[10px] uppercase font-bold text-aqua-600/70 mb-1 block">Ad Code Format</label>
                        <div className="flex items-center gap-2">
                             <code className="text-ocean-700 font-bold font-mono text-sm flex-1">
                                __{result.shortcode}__
                             </code>
                             <button onClick={() => copyToClipboard(`__${result.shortcode}__`, 'Ad Code')} className="text-ocean-600 hover:text-ocean-800 p-1.5 hover:bg-ocean-100 rounded-lg transition-colors">
                                <Copy size={16} />
                             </button>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SidebarPopup;