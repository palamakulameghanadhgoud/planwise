import React, { useEffect, useState } from 'react';
import { mood as moodApi } from '../api/client';
import { Heart, Zap, AlertCircle } from 'lucide-react';

const MOOD_OPTIONS = [
  { value: 'great', label: 'Great', emoji: '😄', color: '#34d399' },
  { value: 'good', label: 'Good', emoji: '🙂', color: '#60a5fa' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: '#fbbf24' },
  { value: 'low', label: 'Low', emoji: '😔', color: '#fb923c' },
  { value: 'stressed', label: 'Stressed', emoji: '😰', color: '#f87171' },
];

function MoodCheck() {
  const [moodData, setMoodData] = useState({
    mood: 'okay',
    energy_level: 5,
    stress_level: 5,
    notes: '',
  });
  const [support, setSupport] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentMoods, setRecentMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    try {
      const [supportRes, analyticsRes, moodsRes] = await Promise.all([
        moodApi.getSupport().catch(() => ({ data: null })),
        moodApi.getAnalytics({ days: 7 }).catch(() => ({ data: null })),
        moodApi.getAll({ days: 7 }),
      ]);
      setSupport(supportRes.data);
      setAnalytics(analyticsRes.data);
      setRecentMoods(moodsRes.data);
    } catch (error) {
      console.error('Failed to load mood data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await moodApi.log(moodData);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      loadMoodData();
      setMoodData({
        mood: 'okay',
        energy_level: 5,
        stress_level: 5,
        notes: '',
      });
    } catch (error) {
      console.error('Failed to log mood:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '80px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', marginTop: '8px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 900, 
          marginBottom: '8px',
          letterSpacing: '-0.5px',
          lineHeight: '1.2'
        }}>
          How are you feeling? 💭
        </h1>
        <p style={{ color: '#999', fontSize: '15px', fontWeight: 500 }}>
          Take a moment to check in with yourself
        </p>
      </div>

      {/* Emotional Support */}
      {support && (
        <div className="card" style={{
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          border: 'none'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '16px', alignItems: 'start' }}>
            <div style={{ fontSize: '32px' }}>💖</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.3px' }}>
                {support.message}
              </h3>
              <p style={{ fontSize: '16px', marginBottom: '12px', fontWeight: 500, fontStyle: 'italic', opacity: 0.95 }}>
                "{support.quote}"
              </p>
              <p style={{ fontSize: '14px', opacity: 0.9, fontWeight: 500 }}>{support.tip}</p>
              {support.mood_insight && (
                <p style={{ fontSize: '13px', marginTop: '12px', opacity: 0.8, fontWeight: 500, paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  {support.mood_insight}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {submitted && (
        <div className="card" style={{ 
          marginBottom: '20px', 
          background: 'rgba(16, 185, 129, 0.2)', 
          border: '1px solid #10b981',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '15px', fontWeight: 700 }}>✅ Mood logged successfully!</p>
        </div>
      )}

      {/* Mood Logger */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 800, 
          marginBottom: '20px',
          letterSpacing: '-0.3px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '10px',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '24px' }}>📝</span>
          Log Your Mood
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
          {/* Mood Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: 700, 
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              😊 How do you feel?
            </label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', 
              gap: '12px' 
            }}>
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMoodData({ ...moodData, mood: option.value })}
                  style={{
                    padding: '16px 8px',
                    borderRadius: '12px',
                    border: moodData.mood === option.value ? '2px solid #6366f1' : '2px solid #333',
                    background: moodData.mood === option.value ? 'rgba(99, 102, 241, 0.2)' : '#0a0a0a',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>{option.emoji}</div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 700,
                    color: moodData.mood === option.value ? option.color : '#999'
                  }}>
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: 700, 
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ⚡ Energy Level: <span style={{ color: '#6366f1', fontSize: '16px', fontWeight: 900 }}>
                {moodData.energy_level}/10
              </span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '12px', alignItems: 'center' }}>
              <Zap size={20} style={{ color: '#fbbf24' }} />
              <input
                type="range"
                min="1"
                max="10"
                value={moodData.energy_level}
                onChange={(e) =>
                  setMoodData({ ...moodData, energy_level: parseInt(e.target.value) })
                }
                style={{
                  width: '100%',
                  height: '8px',
                  background: '#333',
                  borderRadius: '8px',
                  appearance: 'none',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '24px', fontWeight: 900, minWidth: '40px', textAlign: 'center' }}>
                {moodData.energy_level}
              </span>
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: 700, 
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              😰 Stress Level: <span style={{ color: '#6366f1', fontSize: '16px', fontWeight: 900 }}>
                {moodData.stress_level}/10
              </span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '12px', alignItems: 'center' }}>
              <AlertCircle size={20} style={{ color: '#f87171' }} />
              <input
                type="range"
                min="1"
                max="10"
                value={moodData.stress_level}
                onChange={(e) =>
                  setMoodData({ ...moodData, stress_level: parseInt(e.target.value) })
                }
                style={{
                  width: '100%',
                  height: '8px',
                  background: '#333',
                  borderRadius: '8px',
                  appearance: 'none',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '24px', fontWeight: 900, minWidth: '40px', textAlign: 'center' }}>
                {moodData.stress_level}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: 700, 
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📌 Notes (optional)
            </label>
            <textarea
              className="input"
              rows="3"
              placeholder="What's on your mind?"
              style={{ fontWeight: 500, resize: 'vertical' }}
              value={moodData.notes}
              onChange={(e) => setMoodData({ ...moodData, notes: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              width: '100%',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 800,
              letterSpacing: '0.3px'
            }} 
            disabled={loading}
          >
            <Heart size={20} />
            {loading ? 'Logging...' : 'Log Mood'}
          </button>
        </form>
      </div>

      {/* Analytics */}
      {analytics && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div className="card">
            <h3 style={{ 
              fontWeight: 800, 
              marginBottom: '20px',
              fontSize: '16px',
              letterSpacing: '-0.2px',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '10px',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              7-Day Overview
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999' }}>
                    Average Energy
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 900 }}>{analytics.avg_energy}/10</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '8px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(analytics.avg_energy / 10) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #34d399, #10b981)',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999' }}>
                    Average Stress
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 900 }}>{analytics.avg_stress}/10</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '8px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(analytics.avg_stress / 10) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #f87171, #ef4444)',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              </div>

              <div style={{ paddingTop: '8px' }}>
                <p style={{ fontSize: '12px', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  Trend
                </p>
                <p style={{ 
                  fontSize: '16px', 
                  fontWeight: 700,
                  color: analytics.trend === 'improving' ? '#34d399' : analytics.trend === 'declining' ? '#f87171' : '#fbbf24'
                }}>
                  {analytics.trend === 'improving' && '📈 Improving'}
                  {analytics.trend === 'declining' && '📉 Declining'}
                  {analytics.trend === 'stable' && '➡️ Stable'}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ 
              fontWeight: 800, 
              marginBottom: '20px',
              fontSize: '16px',
              letterSpacing: '-0.2px'
            }}>
              Mood Distribution
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {Object.entries(analytics.mood_distribution || {}).map(([mood, count]) => {
                const moodOption = MOOD_OPTIONS.find((m) => m.value === mood);
                return (
                  <div key={mood} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '28px' }}>{moodOption?.emoji}</span>
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>{moodOption?.label}</span>
                    </div>
                    <span className="badge badge-secondary" style={{ fontWeight: 700, fontSize: '12px' }}>
                      {count}x
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recent Moods */}
      {recentMoods.length > 0 && (
        <div className="card">
          <h3 style={{ 
            fontWeight: 800, 
            marginBottom: '16px',
            fontSize: '18px',
            letterSpacing: '-0.3px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '10px',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '24px' }}>📋</span>
            Recent Check-ins
          </h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {recentMoods.slice(0, 5).map((mood) => {
              const moodOption = MOOD_OPTIONS.find((m) => m.value === mood.mood);
              const date = new Date(mood.created_at);
              return (
                <div
                  key={mood.id}
                  className="card"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    alignItems: 'center',
                    gap: '16px',
                    background: '#0a0a0a'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '32px' }}>{moodOption?.emoji}</span>
                    <div>
                      <p style={{ fontWeight: 700, marginBottom: '4px', fontSize: '15px', letterSpacing: '-0.2px' }}>
                        {moodOption?.label}
                      </p>
                      <p style={{ fontSize: '12px', color: '#999', fontWeight: 600 }}>
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at{' '}
                        {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: 600 }}>
                    <p style={{ marginBottom: '4px' }}>⚡ {mood.energy_level}/10</p>
                    <p>😰 {mood.stress_level}/10</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MoodCheck;
