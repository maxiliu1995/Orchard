'use client';

import React, { createContext, useContext, useState } from 'react';

interface ErrorContextType {
  error: Error | null;
  setError: (error: Error | null) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);
  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {error ? (
        <div className="fixed inset-0 bg-red-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-red-600 font-bold">Error</h3>
            <p className="mt-2">{error.message}</p>
            <button onClick={clearError} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
              Dismiss
            </button>
          </div>
        </div>
      ) : children}
    </ErrorContext.Provider>
  );
}

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) throw new Error('useError must be used within an ErrorProvider');
  return context;
}; 