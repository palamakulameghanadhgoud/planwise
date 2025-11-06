import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Moon, TrendingUp, Calendar } from 'lucide-react';

function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/sleep', icon: Moon, label: 'Sleep' },
    { path: '/skills', icon: TrendingUp, label: 'Skills' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#111',
      borderTop: '1px solid #333',
      zIndex: 50
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${navItems.length}, 1fr)`,
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'grid',
                justifyItems: 'center',
                padding: '12px 8px',
                color: isActive ? '#fff' : '#bbb',
                textDecoration: 'none',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Icon size={22} />
              <span style={{
                fontSize: '12px',
                marginTop: '4px',
                fontWeight: isActive ? 600 : 400
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
