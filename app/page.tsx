"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import confetti from "canvas-confetti";

type LeaderboardEntry = {
  participant_name: string;
  score: number;
  thumbnail_url: string;
  fb_post_url: string;
};

export default function KaraokeLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [previousTop, setPreviousTop] = useState<string>("");

  const getCurrentEventHashtag = () => {
    const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
    return `#${months[new Date().getMonth()]}spotlight`;
  };

  async function fetchLeaderboard() {
    setLoading(true);
    const { data } = await supabase
      .from("leaderboard_cache")
      .select("data, updated_at")
      .eq("event_id", getCurrentEventHashtag())
      .single();

    if (data?.data) {
      const newEntries = data.data;
      const currentTop = newEntries[0]?.participant_name;

      if (currentTop && currentTop !== previousTop) {
        triggerConfetti();
        setPreviousTop(currentTop);
      }

      setEntries(newEntries);
    }
    setLoading(false);
  }

  const triggerConfetti = () => {
    confetti({ particleCount: 180, spread: 70, origin: { y: 0.6 } });
  };

  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel("karaoke-leaderboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "leaderboard_cache" }, fetchLeaderboard)
      .subscribe();

    const interval = setInterval(fetchLeaderboard, 20000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [previousTop]);

  return (
    <div className="min-h-screen bg-[#0c001a] overflow-hidden relative font-sans">
      {/* Enhanced Glowing Gold Spotlights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(234,179,8,0.28)_0%,transparent_45%)] animate-spotlight1"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(234,179,8,0.25)_0%,transparent_50%)] animate-spotlight2"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_70%,rgba(234,179,8,0.22)_0%,transparent_55%)] animate-spotlight3"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_80%,rgba(234,179,8,0.18)_0%,transparent_50%)] animate-spotlight4"></div>

      {/* Stage Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[420px] bg-gradient-to-t from-purple-950 via-black to-transparent"></div>

      <div className="max-w-5xl mx-auto p-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-16 pt-6">
          <div className="text-6xl md:text-7xl font-black tracking-[4px] text-yellow-300 drop-shadow-[0_0_50px_#facc15] mb-3">
            KARAOKE SPOTLIGHT
          </div>
          <p className="text-xl text-purple-300 tracking-widest">{getCurrentEventHashtag()}</p>
          <div className="h-px w-40 mx-auto bg-gradient-to-r from-transparent via-yellow-400 to-transparent my-6"></div>
          <p className="text-sm uppercase tracking-[3px] text-purple-400">LATE NIGHT • LIVE • UNCENSORED</p>
        </div>

        {loading && entries.length === 0 ? (
          <div className="text-center py-32">
            <div className="animate-spin h-16 w-16 mx-auto border-4 border-purple-500 border-t-yellow-400 rounded-full"></div>
            <p className="mt-10 text-xl text-purple-300">The stage is heating up...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {entries.length === 0 ? (
              <div className="text-center py-32 border border-purple-800 rounded-3xl bg-black/40">
                <p className="text-3xl text-purple-200">The stage is empty tonight...</p>
                <p className="text-purple-400 mt-6">Step up and claim the spotlight.</p>
              </div>
            ) : (
              entries.map((entry, index) => (
                <div
                  key={index}
                  className={`group relative flex items-center gap-8 bg-gradient-to-r from-purple-950/90 to-black/90 border rounded-3xl p-9 transition-all duration-700 hover:scale-[1.015] overflow-hidden ${
                    index === 0 
                      ? 'border-yellow-400 shadow-2xl shadow-yellow-400/40 scale-[1.02]' 
                      : 'border-purple-800 hover:border-purple-600'
                  }`}
                >
                  {/* Extra Gold Glow for #1 */}
                  {index === 0 && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-pulse"></div>
                  )}

                  {/* Stage Platform Glow */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-400/10 to-transparent"></div>

                  {/* Rank */}
                  <div className="w-20 text-center relative z-10">
                    <div className={`text-6xl font-black ${
                      index === 0 ? 'text-yellow-300 drop-shadow-[0_0_35px_#facc15] animate-bounce' : 'text-purple-300'
                    }`}>
                      {index + 1}
                    </div>
                    {index === 0 && <div className="text-4xl mt-1">👑</div>}
                  </div>

                  {/* Performer on Stage */}
                  <div className="w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden border-4 border-purple-700/60 shadow-2xl relative z-10">
                    <img
                      src={entry.thumbnail_url}
                      alt={entry.participant_name}
                      className="w-full h-full object-cover transition-all group-hover:scale-110 duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70"></div>
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <a
                      href={entry.fb_post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-3xl font-bold text-white hover:text-yellow-300 transition-colors truncate"
                    >
                      {entry.participant_name}
                    </a>
                    <p className="text-purple-400 mt-2">LIVE ON STAGE</p>
                  </div>

                  {/* Score */}
                  <div className="text-right relative z-10">
                    <div className="text-6xl font-black text-yellow-300 tracking-tighter">
                      {entry.score}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-purple-400">POINTS</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="text-center text-xs text-purple-600 py-10 tracking-widest">
        ADULT KARAOKE SPOTLIGHT • 18+ • LIVE LEADERBOARD
      </div>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes spotlight1 { 0% { background-position: 20% 25%; } 50% { background-position: 35% 20%; } 100% { background-position: 20% 25%; } }
        @keyframes spotlight2 { 0% { background-position: 80% 35%; } 50% { background-position: 70% 45%; } 100% { background-position: 80% 35%; } }
        @keyframes spotlight3 { 0% { background-position: 45% 70%; } 50% { background-position: 55% 60%; } 100% { background-position: 45% 70%; } }
        @keyframes spotlight4 { 0% { background-position: 65% 80%; } 50% { background-position: 75% 70%; } 100% { background-position: 65% 80%; } }
        
        .animate-spotlight1 { animation: spotlight1 32s ease infinite; }
        .animate-spotlight2 { animation: spotlight2 26s ease infinite; }
        .animate-spotlight3 { animation: spotlight3 38s ease infinite; }
        .animate-spotlight4 { animation: spotlight4 29s ease infinite; }
      `}</style>
    </div>
  );
}