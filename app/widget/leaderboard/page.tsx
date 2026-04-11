"use client";

import { useEffect, useState } from "react";

type Entry = {
  participant_name: string;
  score: number;
  facebook_profile_url?: string;
};

export default function WidgetLeaderboard() {
  const [data, setData] = useState<Entry[]>([]);

  async function fetchData() {
    const res = await fetch("/api/leaderboard");
    const json = await res.json();
    setData(json);
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getAvatar = (entry: Entry) =>
    entry.facebook_profile_url?.startsWith("http")
      ? entry.facebook_profile_url
      : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          entry.participant_name
        )}`;

  return (
    <div className="w-full h-full bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        
        <h2 className="text-lg font-bold text-center mb-3">
          🔥 Live Leaderboard
        </h2>

        <div className="space-y-2">
          {data.map((entry, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-2">
                <img
                  src={getAvatar(entry)}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm">{entry.participant_name}</span>
              </div>

              <span className="text-cyan-300 font-bold text-sm">
                {entry.score} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}