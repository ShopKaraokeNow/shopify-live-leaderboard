"use client";

import { useEffect, useState } from "react";

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
    <div style={{ backgroundColor: '#0a061f', color: 'white', fontFamily: 'system-ui, sans-serif', border: '1px solid #6b21a8', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(to right, #1e0533, #3b0764, #1e0533)', padding: '24px', textAlign: 'center', borderBottom: '4px solid #eab308' }}>
        <div style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '2px', color: '#fcd34d' }}>
          LIVE SPOTLIGHT LEADERBOARD
        </div>
        <div style={{ color: '#c4b5fd', marginTop: '8px', fontSize: '17px' }}>
          {getCurrentEventHashtag()}
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {loading && entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ display: 'inline-block', width: '48px', height: '48px', border: '5px solid #6b21a8', borderTopColor: '#eab308', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: '#c4b5fd', marginTop: '20px' }}>The stage is lighting up...</p>
          </div>
        ) : entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#c4b5fd' }}>
            No entries yet this month...
          </div>
        ) : (
          entries.slice(0, 8).map((entry, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              background: index === 0 ? 'linear-gradient(to right, #3b0764, #1e0533)' : '#1a1033',
              border: index === 0 ? '2px solid #eab308' : '1px solid #6b21a8',
              borderRadius: '12px',
              padding: '18px',
              marginBottom: '12px'
            }}>
              <div style={{ width: '40px', textAlign: 'center', fontSize: '32px', fontWeight: '900', color: '#fcd34d' }}>
                {index + 1}
              </div>

              <div style={{ width: '64px', height: '64px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #6b21a8' }}>
                <img src={entry.thumbnail_url} alt={entry.participant_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ flex: 1 }}>
                <a href={entry.fb_post_url} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>
                  {entry.participant_name}
                </a>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#fcd34d' }}>
                  {entry.score}
                </div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a78bfa' }}>POINTS</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ textAlign: 'center', padding: '14px', fontSize: '12px', color: '#a78bfa', backgroundColor: '#0a061f' }}>
        LIVE SPOTLIGHT COMPETITION • UPDATES EVERY 30s
      </div>
    </div>
  );
}