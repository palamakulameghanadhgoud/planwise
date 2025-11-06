import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store';
import { users } from '../api/client';

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('user');

    if (token && userId) {
      // Store token in localStorage first
      localStorage.setItem('token', token);
      
      // Set auth with minimal user data
      const userData = { id: userId };
      setAuth(userData, token);
      
      // Fetch full user data
      users.getMe()
        .then((response) => {
          setAuth(response.data, token);
          navigate('/');
        })
        .catch(() => {
          // Even if fetching user fails, we have the token
          navigate('/');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, setAuth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Completing sign in...</p>
      </div>
    </div>
  );
}

export default OAuthCallback;

