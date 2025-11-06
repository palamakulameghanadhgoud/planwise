import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { analytics, tasks as tasksApi } from '../api/client';
import {
  Trophy,
  Target,
  Flame,
  TrendingUp,
  Calendar,
  CheckCircle,
  Brain,
  Moon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState([]);
  const [productivityScore, setProductivityScore] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, insightsRes, scoreRes, tasksRes] = await Promise.all([
        analytics.getDashboard(),
        analytics.getInsights().catch(() => ({ data: [] })),
        analytics.getProductivityScore().catch(() => ({ data: null })),
        tasksApi.getAll({ completed: false }),
      ]);

      setStats(statsRes.data);
      setInsights(insightsRes.data || []);
      setProductivityScore(scoreRes.data);
      setTodayTasks(tasksRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    try {
      await tasksApi.update(taskId, { completed: true });
      loadDashboardData();
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
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
          <p style={{ fontSize: '15px', fontWeight: 500 }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div style={{ marginBottom: '32px', marginTop: '8px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 800, 
          marginBottom: '8px',
          letterSpacing: '-0.5px',
          lineHeight: '1.2'
        }}>
          Welcome back, {user?.full_name || user?.username}! 👋
        </h1>
        <p style={{ color: '#999', fontSize: '15px', fontWeight: 500 }}>
          Here's your productivity overview
        </p>
      </div>

      {productivityScore && (
        <div className="card" style={{
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          border: 'none'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div>
              <h3 style={{ 
                fontSize: '15px', 
                fontWeight: 700, 
                marginBottom: '12px',
                letterSpacing: '0.3px',
                textTransform: 'uppercase',
                opacity: 0.9
              }}>
                ⚡ Productivity Score
              </h3>
              <p style={{ 
                fontSize: '42px', 
                fontWeight: 900,
                letterSpacing: '-1px',
                lineHeight: '1'
              }}>
                {productivityScore.total_score || 85}/100
              </p>
              <p style={{ 
                fontSize: '14px', 
                opacity: 0.9,
                marginTop: '8px',
                fontWeight: 500
              }}>
                {productivityScore.message || "You're doing great!"}
              </p>
            </div>
            <div style={{ 
              fontSize: '80px', 
              fontWeight: 900, 
              opacity: 0.2,
              lineHeight: '1'
            }}>
              {productivityScore.grade || 'A'}
            </div>
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', alignItems: 'center' }}>
            <div style={{ 
              padding: '12px', 
              background: 'rgba(99, 102, 241, 0.2)', 
              borderRadius: '12px',
              fontSize: '28px'
            }}>
              🏆
            </div>
            <div>
              <p style={{ 
                fontSize: '11px', 
                color: '#999', 
                marginBottom: '4px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Points
              </p>
              <p style={{ 
                fontSize: '26px', 
                fontWeight: 900,
                letterSpacing: '-0.5px',
                lineHeight: '1'
              }}>
                {stats?.gamification?.total_points || user?.total_points || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', alignItems: 'center' }}>
            <div style={{ 
              padding: '12px', 
              background: 'rgba(251, 146, 60, 0.2)', 
              borderRadius: '12px',
              fontSize: '28px'
            }}>
              🔥
            </div>
            <div>
              <p style={{ 
                fontSize: '11px', 
                color: '#999', 
                marginBottom: '4px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Streak
              </p>
              <p style={{ 
                fontSize: '26px', 
                fontWeight: 900,
                letterSpacing: '-0.5px',
                lineHeight: '1'
              }}>
                {stats?.gamification?.current_streak || user?.current_streak || 0} days
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', alignItems: 'center' }}>
            <div style={{ 
              padding: '12px', 
              background: 'rgba(16, 185, 129, 0.2)', 
              borderRadius: '12px',
              fontSize: '28px'
            }}>
              ✅
            </div>
            <div>
              <p style={{ 
                fontSize: '11px', 
                color: '#999', 
                marginBottom: '4px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Completed
              </p>
              <p style={{ 
                fontSize: '26px', 
                fontWeight: 900,
                letterSpacing: '-0.5px',
                lineHeight: '1'
              }}>
                {stats?.tasks?.completed || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', alignItems: 'center' }}>
            <div style={{ 
              padding: '12px', 
              background: 'rgba(168, 85, 247, 0.2)', 
              borderRadius: '12px',
              fontSize: '28px'
            }}>
              📈
            </div>
            <div>
              <p style={{ 
                fontSize: '11px', 
                color: '#999', 
                marginBottom: '4px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Level
              </p>
              <p style={{ 
                fontSize: '26px', 
                fontWeight: 900,
                letterSpacing: '-0.5px',
                lineHeight: '1'
              }}>
                {stats?.gamification?.level || user?.level || 1}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '24px' }}>😴</span>
            <h3 style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '0.3px' }}>Sleep Debt</h3>
          </div>
          <p style={{ 
            fontSize: '38px', 
            fontWeight: 900,
            letterSpacing: '-1px',
            lineHeight: '1'
          }}>
            {stats?.sleep?.total_sleep_debt?.toFixed(1) || 0}
            <span style={{ fontSize: '18px', color: '#999', fontWeight: 600 }}>h</span>
          </p>
          <p style={{ fontSize: '13px', color: '#999', marginTop: '6px', fontWeight: 500 }}>
            Hours behind target
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '24px' }}>🎯</span>
            <h3 style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '0.3px' }}>Completion</h3>
          </div>
          <p style={{ 
            fontSize: '38px', 
            fontWeight: 900,
            letterSpacing: '-1px',
            lineHeight: '1'
          }}>
            {stats?.tasks?.completion_rate?.toFixed(0) || 0}
            <span style={{ fontSize: '18px', color: '#999', fontWeight: 600 }}>%</span>
          </p>
          <p style={{ fontSize: '13px', color: '#999', marginTop: '6px', fontWeight: 500 }}>
            Task success rate
          </p>
        </div>
      </div>

      {insights.length > 0 && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 800, 
            marginBottom: '16px', 
            display: 'grid', 
            gridTemplateColumns: 'auto 1fr', 
            gap: '10px', 
            alignItems: 'center',
            letterSpacing: '-0.3px'
          }}>
            <span style={{ fontSize: '24px' }}>🧠</span>
            AI Insights
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {insights.map((insight, index) => (
              <div key={index} className="card" style={{ background: '#0a0a0a' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '15px', letterSpacing: '-0.2px' }}>
                  {insight.title}
                </h4>
                <p style={{ fontSize: '14px', color: '#ddd', marginBottom: '10px', lineHeight: '1.5', fontWeight: 500 }}>
                  {insight.message}
                </p>
                {insight.suggestion && (
                  <p style={{ fontSize: '14px', color: '#818cf8', fontWeight: 600 }}>
                    💡 {insight.suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', marginBottom: '16px', alignItems: 'center' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 800, 
            display: 'grid', 
            gridTemplateColumns: 'auto 1fr', 
            gap: '10px', 
            alignItems: 'center',
            letterSpacing: '-0.3px'
          }}>
            <span style={{ fontSize: '24px' }}>📅</span>
            Today's Tasks
          </h3>
          <Link to="/tasks" style={{ 
            color: '#6366f1', 
            textDecoration: 'none', 
            fontSize: '14px', 
            fontWeight: 700,
            letterSpacing: '0.2px'
          }}>
            View All →
          </Link>
        </div>

        {todayTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#999' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📝</div>
            <p style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 600 }}>No tasks for today</p>
            <p style={{ fontSize: '14px', marginBottom: '16px', fontWeight: 500 }}>Create some to get started!</p>
            <Link to="/tasks" className="btn btn-primary" style={{ fontWeight: 700 }}>
              Create Task
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {todayTasks.map((task) => (
              <div key={task.id} className="card" style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '12px',
                alignItems: 'center',
                background: '#0a0a0a'
              }}>
                <button
                  onClick={() => completeTask(task.id)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2px solid #999',
                    background: 'none',
                    cursor: 'pointer'
                  }}
                />
                <div>
                  <h4 style={{ 
                    fontWeight: 700, 
                    marginBottom: '8px', 
                    fontSize: '15px',
                    letterSpacing: '-0.2px'
                  }}>
                    {task.title}
                  </h4>
                  <div style={{ display: 'grid', gridAutoFlow: 'column', gap: '8px', justifyContent: 'start' }}>
                    <span className={`badge badge-${task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'primary'}`}
                      style={{ fontWeight: 700, fontSize: '11px' }}>
                      {task.priority}
                    </span>
                    <span className="badge badge-secondary" style={{ fontWeight: 600, fontSize: '11px' }}>
                      {task.category}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '13px', color: '#999', fontWeight: 600 }}>
                  {task.estimated_duration}min
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
