"use client";

import { useEffect, useState } from "react";

type Entry = {
  id?: string;
  participant_name: string;
  score: number;
};

export default function Home() {
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const getAvatar = (entry: any) => {
  const name = entry?.participant_name || "Player";

  // ONLY use Facebook if it's a real image URL
  const fb = entry?.facebook_profile_url;

  const isValidImage =
    fb &&
    (fb.includes("http://") || fb.includes("https://")) &&
    (fb.includes(".jpg") ||
      fb.includes(".png") ||
      fb.includes(".jpeg") ||
      fb.includes("graph.facebook.com"));

  if (isValidImage) {
    return fb;
  }

  // PERFECT fallback (never breaks)
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name
  )}`;
};

  async function fetchData() {
    try {
      const res = await fetch("/api/leaderboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6">
        
        <h1 className="text-3xl font-bold text-center mb-6">
          🔥 Live Leaderboard
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-3">
            {data.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl border bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">

  {/* Avatar */}
  <img
    src={getAvatar(entry)}
    alt={entry.participant_name}
    className="w-10 h-10 rounded-full border border-white/20 object-cover"
  />

  <span className="text-2xl w-10">
    {getMedal(index)}
  </span>

  <span className="font-semibold">
    {entry.participant_name}
  </span>
                </div>

                <div className="text-lg font-bold text-blue-600">
                  {entry.score} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}