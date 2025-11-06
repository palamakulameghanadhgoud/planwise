import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Bell, Settings, LogOut, User as UserIcon } from 'lucide-react';

function TopBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      background: '#000',
      borderBottom: '1px solid #333',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        padding: '12px 16px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '26px',
          fontWeight: 900,
          color: '#fff',
          letterSpacing: '-0.5px'
        }}>
          PlanWise ⚡
        </div>

        <div></div>

        <div style={{ display: 'grid', gridAutoFlow: 'column', gap: '12px', alignItems: 'center' }}>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#bbb',
            cursor: 'pointer',
            padding: '8px'
          }}>
            <Bell size={20} />
          </button>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#bbb',
            cursor: 'pointer',
            padding: '8px'
          }}>
            <Settings size={20} />
          </button>
          
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '999px',
                background: '#6366f1',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
                color: '#fff',
                fontSize: '16px'
              }}>
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            </button>

            {showDropdown && (
              <div style={{
                position: 'absolute',
                right: 0,
                marginTop: '8px',
                width: '200px',
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#222'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <UserIcon size={18} />
                  <span>Profile</span>
                </button>
                <div style={{ height: '1px', background: '#333' }}></div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#222'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
