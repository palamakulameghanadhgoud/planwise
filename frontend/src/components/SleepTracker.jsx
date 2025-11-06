import React, { useEffect, useState } from 'react';
import { sleep as sleepApi } from '../api/client';
import { Moon, TrendingUp, AlertTriangle, Check, Calendar } from 'lucide-react';

function SleepTracker() {
  const [sleepData, setSleepData] = useState({
    date: new Date().toISOString().split('T')[0],
    hours_slept: 7,
    quality: 7,
    notes: '',
  });
  const [sleepDebt, setSleepDebt] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadSleepData();
  }, []);

  const loadSleepData = async () => {
    try {
      const [debtRes, analyticsRes, logsRes] = await Promise.all([
        sleepApi.getDebt(),
        sleepApi.getAnalytics({ days: 14 }).catch(() => ({ data: null })),
        sleepApi.getAll({ days: 14 }),
      ]);
      setSleepDebt(debtRes.data);
      setAnalytics(analyticsRes.data);
      setRecentLogs(logsRes.data);
    } catch (error) {
      console.error('Failed to load sleep data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...sleepData,
        date: new Date(sleepData.date).toISOString(),
      };
      await sleepApi.log(dataToSubmit);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      loadSleepData();
      setSleepData({
        date: new Date().toISOString().split('T')[0],
        hours_slept: 7,
        quality: 7,
        notes: '',
      });
    } catch (error) {
      console.error('Failed to log sleep:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDebtStyles = (status) => {
    switch (status) {
      case 'critical':
        return { background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', border: 'none' };
      case 'warning':
        return { background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', border: 'none' };
      case 'caution':
        return { background: 'linear-gradient(135deg, #d97706 0%, #a16207 100%)', border: 'none' };
      default:
        return { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', border: 'none' };
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
          Sleep Tracker 😴
        </h1>
        <p style={{ color: '#999', fontSize: '15px', fontWeight: 500 }}>
          Monitor your sleep and avoid burnout
        </p>
      </div>

      {/* Sleep Debt Alert */}
      {sleepDebt && (
        <div className="card" style={{ ...getDebtStyles(sleepDebt.status), marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '16px', alignItems: 'start' }}>
            {sleepDebt.status === 'healthy' ? (
              <div style={{ fontSize: '32px' }}>✅</div>
            ) : (
              <div style={{ fontSize: '32px' }}>⚠️</div>
            )}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.3px' }}>
                Sleep Debt: {sleepDebt.sleep_debt}h
              </h3>
              {sleepDebt.warning && (
                <p style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 500, opacity: 0.95 }}>
                  {sleepDebt.warning}
                </p>
              )}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                gap: '16px',
                marginTop: '16px'
              }}>
                <div>
                  <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px', fontWeight: 600 }}>
                    Average Sleep
                  </p>
                  <p style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                    {sleepDebt.avg_sleep}h
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px', fontWeight: 600 }}>
                    Your Goal
                  </p>
                  <p style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                    {sleepDebt.goal}h
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px', fontWeight: 600 }}>
                    Days Tracked
                  </p>
                  <p style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                    {sleepDebt.days_tracked}
                  </p>
                </div>
              </div>
              {sleepDebt.recommendations && sleepDebt.recommendations.length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Recommendations:
                  </p>
                  <ul style={{ fontSize: '14px', lineHeight: '1.6', fontWeight: 500 }}>
                    {sleepDebt.recommendations.map((rec, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>• {rec}</li>
                    ))}
                  </ul>
                </div>
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
          <p style={{ fontSize: '15px', fontWeight: 700 }}>✅ Sleep logged successfully!</p>
        </div>
      )}

      {/* Sleep Logger */}
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
          Log Sleep
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: 700, 
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📅 Date
            </label>
            <input
              type="date"
              className="input"
              style={{ fontWeight: 500 }}
              value={sleepData.date}
              onChange={(e) => setSleepData({ ...sleepData, date: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: 700, 
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ⏰ Hours Slept: <span style={{ color: '#6366f1', fontSize: '16px', fontWeight: 900 }}>
                {sleepData.hours_slept}h
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={sleepData.hours_slept}
              onChange={(e) =>
                setSleepData({ ...sleepData, hours_slept: parseFloat(e.target.value) })
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
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              fontSize: '12px', 
              color: '#999', 
              marginTop: '8px',
              fontWeight: 600
            }}>
              <span>0h</span>
              <span style={{ textAlign: 'center' }}>6h</span>
              <span style={{ textAlign: 'right' }}>12h</span>
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: 700, 
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ⭐ Sleep Quality: <span style={{ color: '#6366f1', fontSize: '16px', fontWeight: 900 }}>
                {sleepData.quality}/10
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={sleepData.quality}
              onChange={(e) =>
                setSleepData({ ...sleepData, quality: parseInt(e.target.value) })
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
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              fontSize: '12px', 
              color: '#999', 
              marginTop: '8px',
              fontWeight: 600
            }}>
              <span>Poor</span>
              <span style={{ textAlign: 'center' }}>Average</span>
              <span style={{ textAlign: 'right' }}>Excellent</span>
            </div>
          </div>

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
              placeholder="Dreams, interruptions, etc."
              style={{ fontWeight: 500, resize: 'vertical' }}
              value={sleepData.notes}
              onChange={(e) => setSleepData({ ...sleepData, notes: e.target.value })}
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
            <Moon size={20} />
            {loading ? 'Logging...' : 'Log Sleep'}
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
              display: 'grid', 
              gridTemplateColumns: 'auto 1fr', 
              gap: '10px', 
              alignItems: 'center',
              fontSize: '16px',
              letterSpacing: '-0.2px'
            }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              Sleep Analytics
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Average Hours
                </p>
                <p style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', lineHeight: '1' }}>
                  {analytics.avg_hours}h
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Average Quality
                </p>
                <p style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', lineHeight: '1' }}>
                  {analytics.avg_quality}<span style={{ fontSize: '18px', color: '#999' }}>/10</span>
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
              <div>
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Consistency
                </p>
                <p style={{ fontSize: '16px', fontWeight: 700 }}>
                  {analytics.consistency === 'high' ? '✅ High' : '⚠️ Needs Improvement'}
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
              Best & Worst Nights
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div className="card" style={{ 
                background: 'rgba(16, 185, 129, 0.2)', 
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <p style={{ fontSize: '11px', color: '#999', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🏆 Best Night
                </p>
                <p style={{ fontSize: '32px', fontWeight: 900, marginBottom: '4px', letterSpacing: '-0.5px' }}>
                  {analytics.best_night?.hours}h
                </p>
                <p style={{ fontSize: '13px', color: '#999', fontWeight: 600 }}>
                  {new Date(analytics.best_night?.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="card" style={{ 
                background: 'rgba(239, 68, 68, 0.2)', 
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <p style={{ fontSize: '11px', color: '#999', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  😰 Worst Night
                </p>
                <p style={{ fontSize: '32px', fontWeight: 900, marginBottom: '4px', letterSpacing: '-0.5px' }}>
                  {analytics.worst_night?.hours}h
                </p>
                <p style={{ fontSize: '13px', color: '#999', fontWeight: 600 }}>
                  {new Date(analytics.worst_night?.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Logs */}
      {recentLogs.length > 0 && (
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
            Recent Sleep Logs
          </h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {recentLogs.slice(0, 7).map((log) => (
              <div
                key={log.id}
                className="card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  gap: '16px',
                  background: '#0a0a0a'
                }}
              >
                <div>
                  <p style={{ fontWeight: 700, marginBottom: '4px', fontSize: '15px', letterSpacing: '-0.2px' }}>
                    {new Date(log.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  {log.notes && (
                    <p style={{ fontSize: '13px', color: '#999', fontWeight: 500 }}>
                      {log.notes}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '24px', fontWeight: 900, marginBottom: '2px', letterSpacing: '-0.5px' }}>
                    {log.hours_slept}h
                  </p>
                  <p style={{ fontSize: '13px', color: '#999', fontWeight: 600 }}>
                    Quality: {log.quality}/10
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SleepTracker;
