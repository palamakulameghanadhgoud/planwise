import React, { useEffect, useState } from 'react';
import { skills as skillsApi } from '../api/client';
import { TrendingUp, Award, Target, Lightbulb, ArrowUp, ArrowDown, Minus } from 'lucide-react';

function Skills() {
  const [skillsAnalytics, setSkillsAnalytics] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const [analyticsRes, suggestionsRes] = await Promise.all([
        skillsApi.getAnalytics().catch(() => ({ data: [] })),
        skillsApi.getSuggestions().catch(() => ({ data: [] })),
      ]);
      setSkillsAnalytics(analyticsRes.data || []);
      setSuggestions(suggestionsRes.data || []);

      // Update skills from tasks
      await skillsApi.update().catch(() => {});
    } catch (error) {
      console.error('Failed to load skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
        return '📈';
      case 'decreasing':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing':
        return '#34d399';
      case 'decreasing':
        return '#f87171';
      default:
        return '#fbbf24';
    }
  };

  const getSkillIcon = (skillName) => {
    const icons = {
      study: '📚',
      coding: '💻',
      fitness: '💪',
      reading: '📖',
      writing: '✍️',
      organizing: '📋',
      creativity: '🎨',
      social: '👥',
    };
    return icons[skillName] || '🎯';
  };

  const getSuggestionIcon = (type) => {
    const icons = {
      strength: '💪',
      growth_opportunity: '📈',
      milestone: '🎯',
      getting_started: '🌟',
    };
    return icons[type] || '💡';
  };

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        color: '#999'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #333',
            borderTop: '3px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ fontSize: '15px', fontWeight: 500 }}>Loading your skills...</p>
        </div>
      </div>
    );
  }

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
          Skill Development 📊
        </h1>
        <p style={{ color: '#999', fontSize: '15px', fontWeight: 500 }}>
          Track your growth across different areas
        </p>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="card" style={{
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
          border: 'none'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 800, 
            marginBottom: '16px',
            letterSpacing: '-0.3px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '10px',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '24px' }}>💡</span>
            AI Suggestions
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className="card" style={{ background: 'rgba(0, 0, 0, 0.3)', border: 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', alignItems: 'start' }}>
                  <span style={{ fontSize: '28px' }}>{getSuggestionIcon(suggestion.type)}</span>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: '6px', fontSize: '15px', letterSpacing: '-0.2px' }}>
                      {suggestion.message}
                    </p>
                    {suggestion.detail && (
                      <p style={{ fontSize: '14px', opacity: 0.9, fontWeight: 500, marginBottom: '8px' }}>
                        {suggestion.detail}
                      </p>
                    )}
                    {suggestion.action && (
                      <p style={{ fontSize: '13px', opacity: 0.8, fontWeight: 500 }}>
                        💡 {suggestion.action}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Overview */}
      {skillsAnalytics.length === 0 ? (
        <div>
          <div className="card" style={{ textAlign: 'center', padding: '48px 20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>🎯</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.3px' }}>
              No Skills Tracked Yet
            </h3>
            <p style={{ color: '#999', marginBottom: '0', fontWeight: 500, fontSize: '15px' }}>
              Start completing tasks in different categories to build your skill profile!
            </p>
          </div>
          
          {/* Growth Tips - Always show */}
          <div className="card">
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 800, 
              marginBottom: '16px',
              letterSpacing: '-0.3px',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '10px',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '24px' }}>💡</span>
              Growth Tips
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div className="card" style={{ background: '#0a0a0a' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '15px', letterSpacing: '-0.2px' }}>
                  📚 Consistent Practice
                </h4>
                <p style={{ fontSize: '14px', color: '#ddd', fontWeight: 500, lineHeight: '1.5' }}>
                  Spend at least 30 minutes daily on your chosen skills for steady improvement.
                </p>
              </div>
              <div className="card" style={{ background: '#0a0a0a' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '15px', letterSpacing: '-0.2px' }}>
                  🎯 Balanced Development
                </h4>
                <p style={{ fontSize: '14px', color: '#ddd', fontWeight: 500, lineHeight: '1.5' }}>
                  While focusing on strengths is great, don't neglect other areas completely.
                </p>
              </div>
              <div className="card" style={{ background: '#0a0a0a' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '15px', letterSpacing: '-0.2px' }}>
                  🏆 Level Milestones
                </h4>
                <p style={{ fontSize: '14px', color: '#ddd', fontWeight: 500, lineHeight: '1.5' }}>
                  Each level requires 10 hours. Level 5 = Proficient, Level 10 = Master!
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '12px',
            marginBottom: '20px'
          }}>
            {skillsAnalytics.map((skill) => (
              <div key={skill.skill_name} className="card">
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', marginBottom: '16px', alignItems: 'start' }}>
                  <span style={{ fontSize: '48px' }}>{getSkillIcon(skill.skill_name)}</span>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, textTransform: 'capitalize', marginBottom: '8px', letterSpacing: '-0.3px' }}>
                      {skill.skill_name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary" style={{ fontWeight: 700, fontSize: '11px' }}>
                        🎯 Level {skill.level}
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        fontWeight: 700,
                        color: getTrendColor(skill.trend),
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {getTrendIcon(skill.trend)} {skill.trend}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', fontSize: '12px', marginBottom: '8px', fontWeight: 700 }}>
                    <span style={{ color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Progress to Level {skill.level + 1}
                    </span>
                    <span style={{ color: '#6366f1' }}>
                      {skill.total_hours.toFixed(1)}h / {(skill.level * 10)}h
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '8px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(
                          ((skill.total_hours % 10) / 10) * 100,
                          100
                        )}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                        borderRadius: '8px',
                        transition: 'width 0.3s'
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div className="card" style={{ background: '#0a0a0a', padding: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#999', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Total Hours
                    </p>
                    <p style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                      {skill.total_hours.toFixed(1)}h
                    </p>
                  </div>
                  <div className="card" style={{ background: '#0a0a0a', padding: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#999', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Recent (7d)
                    </p>
                    <p style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                      {skill.recent_hours.toFixed(1)}h
                    </p>
                  </div>
                </div>

                {/* Achievements */}
                <div style={{ paddingTop: '16px', borderTop: '1px solid #333' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award style={{ color: '#fbbf24' }} size={20} />
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>
                        {skill.level >= 5 ? '🏆 Expert' : skill.level >= 3 ? '⭐ Proficient' : '🌱 Learning'}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#999', fontWeight: 600 }}>
                      {((skill.level - 1) * 10).toFixed(0)}h invested
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Growth Tips */}
          <div className="card">
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 800, 
              marginBottom: '16px',
              letterSpacing: '-0.3px',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '10px',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '24px' }}>💡</span>
              Growth Tips
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div className="card" style={{ background: '#0a0a0a' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '15px', letterSpacing: '-0.2px' }}>
                  📚 Consistent Practice
                </h4>
                <p style={{ fontSize: '14px', color: '#ddd', fontWeight: 500, lineHeight: '1.5' }}>
                  Spend at least 30 minutes daily on your chosen skills for steady improvement.
                </p>
              </div>
              <div className="card" style={{ background: '#0a0a0a' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '15px', letterSpacing: '-0.2px' }}>
                  🎯 Balanced Development
                </h4>
                <p style={{ fontSize: '14px', color: '#ddd', fontWeight: 500, lineHeight: '1.5' }}>
                  While focusing on strengths is great, don't neglect other areas completely.
                </p>
              </div>
              <div className="card" style={{ background: '#0a0a0a' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '15px', letterSpacing: '-0.2px' }}>
                  🏆 Level Milestones
                </h4>
                <p style={{ fontSize: '14px', color: '#ddd', fontWeight: 500, lineHeight: '1.5' }}>
                  Each level requires 10 hours. Level 5 = Proficient, Level 10 = Master!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Skills;
