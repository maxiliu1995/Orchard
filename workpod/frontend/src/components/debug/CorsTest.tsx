'use client';

import { useEffect } from 'react';

export function CorsTest() {
  useEffect(() => {
    const testCors = async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.178.28:3001/api';
      console.log('Testing CORS with API URL:', API_URL);

      try {
        console.log('Attempting CORS request...');
        const response = await fetch(`${API_URL}/debug/cors`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('CORS Response:', data);
      } catch (error: any) {
        console.error('CORS test error details:', {
          message: error.message,
          error
        });
      }
    };

    testCors();
  }, []);

  return null;
} 