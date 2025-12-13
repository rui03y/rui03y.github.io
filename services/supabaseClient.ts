import { createClient } from '@supabase/supabase-js';

// Provided in the original code snippet
const SUPABASE_URL = 'https://bcwzifmqmuwsqrqtmilt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjd3ppZm1xbXV3c3FycXRtaWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzQ4NzIsImV4cCI6MjA2ODgxMDg3Mn0.RxY5MeL-r4cWzAUcKoKPl_FyZUXM573ZBDNj5dDQsK4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem('deeplink_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('deeplink_user_id', userId);
  }
  return userId;
};

export const logConversion = async (action: string, inputUrl: string, outputUrl: string) => {
  const userId = getOrCreateUserId();
  try {
    const { error } = await supabase.from('conversion_logs').insert([
      {
        user_id: userId,
        action: action,
        input_url: inputUrl,
        output_url: outputUrl
      }
    ]);
    if (error) console.error('Supabase Log Error:', error);
  } catch (err) {
    console.error('Supabase Log Exception:', err);
  }
};

export const logShortlink = async (shortcode: string, previewUrl: string, originalUrl?: string) => {
    try {
        const { error } = await supabase.from('shortlink_logs').insert([{
            shortcode: shortcode, 
            preview_url: previewUrl,
            url: originalUrl 
        }]);
        if (error) console.error('Supabase Shortlink Log Error:', error);
    } catch (err) {
        console.error('Supabase Shortlink Log Exception:', err);
    }
}