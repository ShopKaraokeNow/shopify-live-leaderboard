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
    <div style={{
      backgroundColor: '#0a061f',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      border: '1px solid #6b21a8',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.9)'
    }}>
      {/* Stage Curtain Header */}
      <div style={{
        background: 'linear-gradient(180deg, #1e0533 0%, #3b0764 100%)',
        padding: '28px 20px',
        textAlign: 'center',
        borderBottom: '6px solid #eab308',
        position: 'relative'
      }}>
        <div style={{ 
          fontSize: '32px', 
          fontWeight: '900', 
          letterSpacing: '3px', 
          color: '#fcd34d',
          textShadow: '0 0 30px rgba(234,179,8,0.8)'
        }}>
          ✨ ON STAGE ✨
        </div>
        <div style={{ fontSize: '26px', fontWeight: '700', color: '#f3e8ff', marginTop: '6px' }}>
          LIVE SPOTLIGHT LEADERBOARD
        </div>
        <div style={{ color: '#c4b5fd', marginTop: '8px', fontSize: '17px' }}>
          {getCurrentEventHashtag()} • MONTHLY KARAOKE COMPETITION
        </div>
      </div>

      <div style={{ padding: '24px', backgroundColor: '#0a061f' }}>
        {loading && entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '70px 20px' }}>
            <div style={{ display: 'inline-block', width: '52px', height: '52px', border: '6px solid #6b21a8', borderTopColor: '#eab308', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: '#e0bbff', marginTop: '24px', fontSize: '18px' }}>Lights... Camera... Stardom...</p>
          </div>
        ) : entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '70px 20px', color: '#c4b5fd' }}>
            The stage is waiting for its next star...
          </div>
        ) : (
          entries.slice(0, 8).map((entry, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                background: index === 0 ? 'linear-gradient(to right, #4c1d95, #1e0533)' : '#1a1033',
                border: index === 0 ? '3px solid #eab308' : '1px solid #6b21a8',
                borderRadius: '14px',
                padding: '18px',
                marginBottom: '14px',
                transition: 'all 0.4s ease'
              }}
            >
              <div style={{ 
                width: '42px', 
                textAlign: 'center', 
                fontSize: '34px', 
                fontWeight: '900', 
                color: index === 0 ? '#fcd34d' : '#a5b4fc' 
              }}>
                {index + 1}
              </div>

              <div style={{ width: '68px', height: '68px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #7c3aed' }}>
                <img 
                  src={entry.thumbnail_url} 
                  alt={entry.participant_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <a 
                  href={entry.fb_post_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'white', fontSize: '18px', fontWeight: '600', textDecoration: 'none' }}
                >
                  {entry.participant_name}
                </a>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '34px', fontWeight: '700', color: '#fcd34d' }}>
                  {entry.score}
                </div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#c4b5fd' }}>POINTS</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ textAlign: 'center', padding: '16px', fontSize: '13px', color: '#a78bfa', backgroundColor: '#0a061f' }}>
        UNDER THE SPOTLIGHT • MONTHLY KARAOKE COMPETITION
      </div>
    </div>
  );
}