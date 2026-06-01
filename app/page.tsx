<div className="text-3xl font-black tracking-[3px] text-yellow-300 drop-shadow-[0_0_20px_#facc15]">
  LIVE SPOTLIGHT LEADERBOARD
</div>
"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

type LeaderboardEntry = {
  participant_name: string;
  score: number;
  thumbnail_url: string;
  fb_post_url: string;
};

export default function KaraokeLeaderboardWidget() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const getCurrentEventHashtag = () => {
    const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
    return `#${months[new Date().getMonth()]}spotlight`;
  };

  async function fetchLeaderboard() {
    try {
      setLoading(true);
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      const { data } = await supabase
        .from("leaderboard_cache")
        .select("data")
        .eq("event_id", getCurrentEventHashtag())
        .single();

      if (data?.data) setEntries(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0a061f] text-white font-sans overflow-hidden border border-purple-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-[#1a1033] to-purple-950 p-6 text-center border-b-4 border-yellow-400">
        <div className="text-3xl font-black tracking-[3px] text-yellow-300 drop-shadow-[0_0_20px_#facc15]">
          LIVE SPOTLIGHT LEADERBOARD
        </div>
        <div className="text-purple-300 mt-2 text-lg font-medium">{getCurrentEventHashtag()}</div>
      </div>

      <div className="p-6 space-y-4">
        {loading && entries.length === 0 ? (
          <div className="text-center py-20">
            <div className="animate-spin h-12 w-12 mx-auto border-4 border-purple-600 border-t-yellow-400 rounded-full"></div>
            <p className="text-purple-400 mt-6">The stage is lighting up...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 text-purple-400">
            No entries yet this month...
          </div>
        ) : (
          entries.slice(0, 8).map((entry, index) => (
            <div
              key={index}
              className={`group flex items-center gap-5 bg-gradient-to-r from-[#1a1033] to-black border rounded-2xl p-5 transition-all hover:scale-[1.02] ${
                index === 0 
                  ? 'border-yellow-400 shadow-2xl shadow-yellow-400/50 bg-gradient-to-r from-purple-900 to-black' 
                  : 'border-purple-800 hover:border-purple-600'
              }`}
            >
              <div className="w-10 text-center font-black text-4xl text-yellow-300">
                {index + 1}
              </div>

              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-purple-700 flex-shrink-0 shadow-inner">
                <img 
                  src={entry.thumbnail_url} 
                  alt={entry.participant_name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <a 
                  href={entry.fb_post_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-lg hover:text-yellow-300 transition-colors block"
                >
                  {entry.participant_name}
                </a>
              </div>

              <div className="text-right">
                <div className="text-4xl font-bold text-yellow-300 tracking-tighter">
                  {entry.score}
                </div>
                <div className="text-xs uppercase text-purple-500 tracking-widest">POINTS</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center text-xs text-purple-500 py-4 border-t border-purple-900 bg-black">
        LIVE SPOTLIGHT COMPETITION • UPDATES EVERY 30s
      </div>
    </div>
  );
}