import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { users } from '../api/client';
import { User, Mail, Trophy, Flame, Target, Edit, LogOut, Save } from 'lucide-react';

function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
    preferred_deep_work_start: user?.preferred_deep_work_start || 9,
    preferred_deep_work_end: user?.preferred_deep_work_end || 12,
    daily_sleep_goal: user?.daily_sleep_goal || 8,
  });

  const handleSave = async () => {
    try {
      const response = await users.updateMe(formData);
      updateUser(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const achievements = [
    { name: 'Early Bird', icon: '🌅', condition: user?.preferred_deep_work_start < 8 },
    { name: 'Night Owl', icon: '🦉', condition: user?.preferred_deep_work_start > 20 },
    { name: 'Week Warrior', icon: '⚔️', condition: user?.current_streak >= 7 },
    { name: 'Consistency King', icon: '👑', condition: user?.current_streak >= 30 },
    { name: 'Productive Pro', icon: '⭐', condition: user?.total_points >= 1000 },
    { name: 'Level Master', icon: '🏆', condition: user?.level >= 5 },
  ];

  const earnedAchievements = achievements.filter((a) => a.condition);

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
          Profile Settings ⚙️
        </h1>
        <p style={{ color: '#999', fontSize: '15px', fontWeight: 500 }}>
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Header */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'start' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '48px',
            fontWeight: 900,
            color: '#fff',
            border: '4px solid #1a1a1a'
          }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                {user?.full_name || user?.username}
              </h2>
              <span className="badge badge-primary" style={{ fontWeight: 700, fontSize: '12px' }}>
                🎯 Level {user?.level}
              </span>
            </div>
            <p style={{ color: '#999', marginBottom: '16px', fontSize: '15px', fontWeight: 600 }}>
              @{user?.username}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
              <div className="card" style={{ background: '#0a0a0a', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '20px' }}>🏆</span>
                  <span style={{ fontSize: '11px', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Points
                  </span>
                </div>
                <p style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                  {user?.total_points || 0}
                </p>
              </div>

              <div className="card" style={{ background: '#0a0a0a', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '20px' }}>🔥</span>
                  <span style={{ fontSize: '11px', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Current
                  </span>
                </div>
                <p style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                  {user?.current_streak || 0} days
                </p>
              </div>

              <div className="card" style={{ background: '#0a0a0a', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '20px' }}>🎖️</span>
                  <span style={{ fontSize: '11px', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Best
                  </span>
                </div>
                <p style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                  {user?.longest_streak || 0} days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      {earnedAchievements.length > 0 && (
        <div className="card" style={{ marginBottom: '20px' }}>
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
            <span style={{ fontSize: '24px' }}>🏆</span>
            Achievements
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {earnedAchievements.map((achievement) => (
              <div
                key={achievement.name}
                className="card"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  textAlign: 'center',
                  padding: '16px 12px'
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>{achievement.icon}</div>
                <p style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '-0.2px' }}>
                  {achievement.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 800,
            letterSpacing: '-0.3px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '10px',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '24px' }}>👤</span>
            Profile Information
          </h3>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn btn-secondary" style={{ fontWeight: 700, fontSize: '13px' }}>
              <Edit size={16} />
              Edit
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleSave} className="btn btn-primary" style={{ fontWeight: 700, fontSize: '13px' }}>
                <Save size={16} />
                Save
              </button>
              <button onClick={() => setEditing(false)} className="btn btn-secondary" style={{ fontWeight: 700, fontSize: '13px' }}>
                Cancel
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px', 
              fontWeight: 700, 
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <User size={16} />
              Full Name
            </label>
            <input
              type="text"
              className="input"
              style={{ fontWeight: 500 }}
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              disabled={!editing}
            />
          </div>

          <div>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px', 
              fontWeight: 700, 
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <Mail size={16} />
              Email
            </label>
            <input 
              type="email" 
              className="input" 
              style={{ fontWeight: 500, opacity: 0.7 }}
              value={user?.email} 
              disabled 
            />
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
              📝 Bio
            </label>
            <textarea
              className="input"
              rows="3"
              style={{ fontWeight: 500, resize: 'vertical' }}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!editing}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 800,
            letterSpacing: '-0.3px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '10px',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '24px' }}>⚡</span>
            Productivity Preferences
          </h3>
          <button onClick={handleSave} className="btn btn-primary" style={{ fontWeight: 700, fontSize: '13px' }}>
            <Save size={16} />
            Save Changes
          </button>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: 700, 
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              🧠 Deep Work Hours: <span style={{ color: '#6366f1', fontSize: '15px', fontWeight: 900 }}>
                {formData.preferred_deep_work_start}:00 - {formData.preferred_deep_work_end}:00
              </span>
            </label>
            <p style={{ fontSize: '13px', color: '#999', marginBottom: '12px', fontWeight: 500 }}>
              When do you focus best? AI will schedule demanding tasks during these hours.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999' }}>
                  Start Time
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  className="input"
                  style={{ fontWeight: 600 }}
                  value={formData.preferred_deep_work_start}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferred_deep_work_start: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999' }}>
                  End Time
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  className="input"
                  style={{ fontWeight: 600 }}
                  value={formData.preferred_deep_work_end}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferred_deep_work_end: parseInt(e.target.value),
                    })
                  }
                />
              </div>
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
              😴 Daily Sleep Goal: <span style={{ color: '#6366f1', fontSize: '16px', fontWeight: 900 }}>
                {formData.daily_sleep_goal} hours
              </span>
            </label>
            <input
              type="range"
              min="4"
              max="12"
              step="0.5"
              style={{
                width: '100%',
                height: '8px',
                background: '#333',
                borderRadius: '8px',
                appearance: 'none',
                cursor: 'pointer',
                outline: 'none'
              }}
              value={formData.daily_sleep_goal}
              onChange={(e) =>
                setFormData({ ...formData, daily_sleep_goal: parseFloat(e.target.value) })
              }
            />
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              fontSize: '12px', 
              color: '#999', 
              marginTop: '8px',
              fontWeight: 600
            }}>
              <span>4h</span>
              <span style={{ textAlign: 'center' }}>8h</span>
              <span style={{ textAlign: 'right' }}>12h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="card" style={{ 
        background: 'rgba(239, 68, 68, 0.1)', 
        border: '1px solid rgba(239, 68, 68, 0.3)' 
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '16px' }}>
          <div>
            <h3 style={{ fontWeight: 800, marginBottom: '4px', fontSize: '16px', letterSpacing: '-0.2px' }}>
              🚪 Sign Out
            </h3>
            <p style={{ fontSize: '13px', color: '#999', fontWeight: 500 }}>
              Log out from your account
            </p>
          </div>
          <button onClick={handleLogout} className="btn btn-danger" style={{ fontWeight: 800, fontSize: '14px' }}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
