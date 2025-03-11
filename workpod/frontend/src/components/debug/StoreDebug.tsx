'use client';

import { useEffect } from 'react';
import { useStore } from 'react-redux';

export function StoreDebug() {
  const store = useStore();

  useEffect(() => {
    console.log('Current store state:', store.getState());
    console.log('Store middleware:', store);
  }, [store]);

  return null;
} 