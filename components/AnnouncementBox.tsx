import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { X, Minus, Sparkles, ChevronRight } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
  is_new: boolean;
  visible: boolean;
}

const AnnouncementBox: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hidden = localStorage.getItem('announcement_hidden');
    if (hidden) {
      setIsVisible(false);
      return;
    }

    const fetchAnnouncements = async () => {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .eq('visible', true)
        .order('created_at', { ascending: false });
      
      if (data) setAnnouncements(data);
    };

    fetchAnnouncements();

    const collapsed = localStorage.getItem('announcement_read');
    if (collapsed) setIsOpen(false);
  }, []);

  const handleToggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newState = !isOpen;
    setIsOpen(newState);
    if (!newState) {
        localStorage.setItem('announcement_read', '1');
    } else {
        localStorage.removeItem('announcement_read');
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem('announcement_hidden', '1');
  };

  if (!isVisible || announcements.length === 0) return null;

  return (
    <div 
      className={`fixed top-24 right-6 w-80 z-40 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-3.5rem)]'} hidden lg:block`}
    >
      <div 
        className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden ring-1 ring-ocean-100 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
      >
        
        {/* Header - Clickable to toggle state */}
        <div 
            onClick={() => !isOpen && setIsOpen(true)}
            className={`bg-gradient-to-r from-ocean-500 to-aqua-400 p-4 flex justify-between items-center text-white relative overflow-hidden ${!isOpen ? 'cursor-pointer' : ''}`}
            title={!isOpen ? "Click to expand" : ""}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
          
          <div className="flex items-center gap-2 font-bold text-sm z-10 min-w-0">
            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm shrink-0">
                <Sparkles size={14} className="text-white" />
            </div>
            <span className={`tracking-wide text-shadow-sm whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>What's New</span>
          </div>
          
          <div className="flex gap-2 z-10 shrink-0">
            <button onClick={handleToggle} className="hover:bg-black/10 p-1.5 rounded-full transition-colors text-white/90">
              {isOpen ? <Minus size={14} /> : <ChevronRight size={14} />}
            </button>
            <button onClick={handleClose} className="hover:bg-black/10 p-1.5 rounded-full transition-colors text-white/90">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-1 max-h-[300px] overflow-y-auto custom-scrollbar">
            {announcements.map((item, index) => (
              <div key={item.id} className={`p-4 hover:bg-ocean-50/50 transition-colors ${index !== announcements.length - 1 ? 'border-b border-slate-100' : ''}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  {item.is_new && (
                    <span className="bg-gradient-to-r from-ocean-500 to-ocean-400 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm shadow-ocean-200">
                      NEW
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{item.created_at.slice(0, 10)}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1 leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
             <span className="text-[10px] text-slate-400 font-medium">✨ Keep your app updated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBox;
